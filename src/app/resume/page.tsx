import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { ResumeSection } from '@/components/sections/ResumeSection'
import { ParticleBackground } from '@/components/shared/ParticleBackground'
import { PageHero } from '@/components/shared/PageHero'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resume',
  description: 'Download the CV of George Mwangi — CPSP-K certified procurement and supply professional.',
}

export default async function ResumePage() {
  const profile = await prisma.profile.findFirst({ where: { isPublished: true } }).catch(() => null)
  return (
    <main className="relative min-h-screen">
      <ParticleBackground />
      <Navbar profileName={profile?.name || 'George Mwangi'} />
      <PageHero title="Resume / CV" subtitle="Download a full copy of my professional resume" />
      <ResumeSection cvUrl={profile?.cvUrl} />
      <Footer profile={profile} />
    </main>
  )
}
