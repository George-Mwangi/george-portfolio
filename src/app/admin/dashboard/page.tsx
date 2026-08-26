import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient'
import type { Metadata } from 'next'
import { getSiteSections } from '@/lib/siteSectionSettings'

export const metadata: Metadata = { title: 'Admin Dashboard' }
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminDashboardPage({ searchParams }: { searchParams: Promise<{ section?: string }> }) {
  const session = await auth()
  if (!session?.user) redirect('/admin/login')
  const { section } = await searchParams

  const [
    profile, experiences, education, skills, tools,
    certifications, projects, clients, messages, testimonials, siteSections,
    profileTitles, aboutContent, achievements, services, skillGroups, socialLinks,
    navigationItems, contactContent, seoSettings, resumes, mediaAssets,
  ] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.experience.findMany({ orderBy: { order: 'asc' }, include: { details: { orderBy: { order: 'asc' } } } }),
    prisma.education.findMany({ orderBy: { order: 'asc' } }),
    prisma.skill.findMany({ orderBy: { order: 'asc' } }),
    prisma.tool.findMany({ orderBy: { order: 'asc' } }),
    prisma.certification.findMany({ orderBy: { order: 'asc' } }),
    prisma.project.findMany({ orderBy: [{ isFeatured: 'desc' }, { order: 'asc' }], include: { images: { orderBy: { order: 'asc' } }, technologies: { include: { skill: true }, orderBy: { order: 'asc' } } } }),
    prisma.client.findMany({ orderBy: { order: 'asc' } }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 50 }),
    prisma.testimonial.findMany({ orderBy: { order: 'asc' } }),
    getSiteSections(),
    prisma.profileTitle.findMany({ orderBy: { order: 'asc' } }),
    prisma.aboutContent.findFirst({ include: { points: { orderBy: { order: 'asc' } } } }),
    prisma.achievement.findMany({ orderBy: { order: 'asc' } }),
    prisma.service.findMany({ orderBy: { order: 'asc' } }),
    prisma.skillGroup.findMany({ orderBy: { order: 'asc' } }),
    prisma.socialLink.findMany({ orderBy: { order: 'asc' } }),
    prisma.navigationItem.findMany({ orderBy: { order: 'asc' } }),
    prisma.contactContent.findFirst(),
    prisma.seoSettings.findFirst(),
    prisma.resume.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.mediaAsset.findMany({ orderBy: { createdAt: 'desc' } }),
  ])

  const [totalMessages, unreadMessages, totalDownloads, pendingTestimonials] = await Promise.all([
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
    prisma.resume.aggregate({ _sum: { downloads: true } }).then(r => r._sum.downloads ?? 0),
    prisma.testimonial.count({ where: { isPublished: false } }),
  ])

  const hydratedExperiences = experiences.map((experience) => ({
    ...experience,
    responsibilities: experience.details.filter((detail) => detail.type === 'RESPONSIBILITY').map((detail) => detail.text),
    experienceAchievements: experience.details.filter((detail) => detail.type === 'ACHIEVEMENT').map((detail) => detail.text),
  }))
  const hydratedProjects = projects.map((project) => ({
    ...project,
    imageList: project.images.map((image) => `${image.url}${image.altText ? `|${image.altText}` : ''}`),
    technologyNames: project.technologies.map((technology) => technology.skill.name),
  }))

  return (
    <AdminDashboardClient
      user={{ name: session.user.name, email: session.user.email, id: session.user.id }}
      initialSection={section}
      initialData={{
        profile,
        experiences: hydratedExperiences,
        education,
        skills,
        tools,
        certifications,
        projects: hydratedProjects,
        clients,
        messages,
        testimonials,
        siteSections,
        profileTitles, aboutContent, achievements, services, skillGroups, socialLinks,
        navigationItems, contactContent, seoSettings, resumes, mediaAssets,
        stats: { totalMessages, unreadMessages, totalDownloads, pendingTestimonials },
      }}
    />
  )
}
