import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { ParticleBackground } from '@/components/shared/ParticleBackground'
import { PageHero } from '@/components/shared/PageHero'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Projects and key deliverables by George Mwangi.',
}

export default async function ProjectsPage() {
  const [profile, projects] = await Promise.all([
    prisma.profile.findFirst({ where: { isPublished: true } }).catch(() => null),
    prisma.project.findMany({ where: { isPublished: true }, orderBy: [{ isFeatured: 'desc' }, { order: 'asc' }] }).catch(() => []),
  ])
  return (
    <main className="relative min-h-screen">
      <ParticleBackground />
      <Navbar profileName={profile?.name || 'George Mwangi'} />
      <PageHero title="Projects" subtitle="Highlighted work and key deliverables" />
      <ProjectsSection projects={projects} />
      <Footer profile={profile} />
    </main>
  )
}
