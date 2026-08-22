import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { ParticleBackground } from '@/components/shared/ParticleBackground'
import { PageHero } from '@/components/shared/PageHero'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSiteSections } from '@/lib/siteSectionSettings'
import { isSiteSectionEnabled } from '@/lib/siteSections'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Projects and key deliverables by George Mwangi.',
}

export default async function ProjectsPage() {
  const [profile, projects, sections] = await Promise.all([
    prisma.profile.findFirst({ where: { isPublished: true } }).catch(() => null),
    prisma.project.findMany({ where: { isPublished: true }, orderBy: [{ isFeatured: 'desc' }, { order: 'asc' }] }).catch(() => []),
    getSiteSections(),
  ])
  if (!isSiteSectionEnabled(sections, 'projects')) notFound()
  return (
    <main className="relative min-h-screen">
      <ParticleBackground />
      <Navbar profileName={profile?.name || 'Portfolio'} sections={sections} />
      <PageHero title="Projects" subtitle="Highlighted work and key deliverables" />
      <ProjectsSection projects={projects} />
      <Footer profile={profile} sections={sections} />
    </main>
  )
}
