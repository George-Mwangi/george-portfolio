import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { ResumeSection } from '@/components/sections/ResumeSection'
import { ParticleBackground } from '@/components/shared/ParticleBackground'
import { PageHero } from '@/components/shared/PageHero'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSiteSections } from '@/lib/siteSectionSettings'
import { isSiteSectionEnabled } from '@/lib/siteSections'

export const metadata: Metadata = {
  title: 'Resume',
  description: 'Download the CV of George Mwangi.',
}

export default async function ResumePage() {
  const [profile, sections] = await Promise.all([
    prisma.profile.findFirst({ where: { isPublished: true } }).catch(() => null),
    getSiteSections(),
  ])
  if (!isSiteSectionEnabled(sections, 'resume')) notFound()
  return (
    <main className="relative min-h-screen">
      <ParticleBackground />
      <Navbar profileName={profile?.name || 'Portfolio'} sections={sections} />
      <PageHero title="Resume / CV" subtitle="Download a full copy of my professional resume" />
      <ResumeSection cvUrl={profile?.cvUrl} />
      <Footer profile={profile} sections={sections} />
    </main>
  )
}
