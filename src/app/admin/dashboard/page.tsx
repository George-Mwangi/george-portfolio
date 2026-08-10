import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient'
import type { Metadata } from 'next'
import { getSiteSections } from '@/lib/siteSectionSettings'

export const metadata: Metadata = { title: 'Admin Dashboard' }

export default async function AdminDashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/admin/login')

  const [
    profile, experiences, education, skills, tools,
    certifications, projects, clients, messages, testimonials, siteSections,
  ] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.experience.findMany({ orderBy: { order: 'asc' } }),
    prisma.education.findMany({ orderBy: { order: 'asc' } }),
    prisma.skill.findMany({ orderBy: { order: 'asc' } }),
    prisma.tool.findMany({ orderBy: { order: 'asc' } }),
    prisma.certification.findMany({ orderBy: { order: 'asc' } }),
    prisma.project.findMany({ orderBy: [{ isFeatured: 'desc' }, { order: 'asc' }] }),
    prisma.client.findMany({ orderBy: { order: 'asc' } }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 50 }),
    prisma.testimonial.findMany({ orderBy: { order: 'asc' } }),
    getSiteSections(),
  ])

  const [totalMessages, unreadMessages, totalDownloads, pendingTestimonials] = await Promise.all([
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
    prisma.resume.aggregate({ _sum: { downloads: true } }).then(r => r._sum.downloads ?? 0),
    prisma.testimonial.count({ where: { isPublished: false } }),
  ])

  return (
    <AdminDashboardClient
      user={{ name: session.user.name, email: session.user.email, id: session.user.id }}
      initialData={{
        profile,
        experiences,
        education,
        skills,
        tools,
        certifications,
        projects,
        clients,
        messages,
        testimonials,
        siteSections,
        stats: { totalMessages, unreadMessages, totalDownloads, pendingTestimonials },
      }}
    />
  )
}
