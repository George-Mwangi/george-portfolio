import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { ExperienceSection } from '@/components/sections/ExperienceSection'
import { ParticleBackground } from '@/components/shared/ParticleBackground'
import { PageHero } from '@/components/shared/PageHero'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSiteSections } from '@/lib/siteSectionSettings'
import { isSiteSectionEnabled } from '@/lib/siteSections'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Experience',
  description: 'Work history of George Mwangi — IT Professional, Cyber Security Specialist, Full Stack Web Developer, Network & Systems Administrator.',
}

export default async function ExperiencePage() {
  const [profile, experiences, sections] = await Promise.all([
    prisma.profile.findFirst({ where: { isPublished: true } }).catch(() => null),
    prisma.experience.findMany({ where: { isPublished: true }, include: { details: { orderBy: { order: 'asc' } } }, orderBy: { order: 'asc' } }).catch(() => []),
    getSiteSections(),
  ])
  if (!isSiteSectionEnabled(sections, 'experience')) notFound()
  return (
    <main className="relative min-h-screen">
      <ParticleBackground />
      <Navbar profileName={profile?.name || 'Portfolio'} sections={sections} />
      <PageHero title="Work Experience" subtitle="A timeline of roles and responsibilities" />
      <ExperienceSection experiences={experiences} />
      <Footer profile={profile} sections={sections} />
    </main>
  )
}
