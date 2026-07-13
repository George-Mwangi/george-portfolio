import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { AboutSection } from '@/components/sections/AboutSection'
import { ParticleBackground } from '@/components/shared/ParticleBackground'
import { PageHero } from '@/components/shared/PageHero'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about George Mwangi — CPSP-K certified procurement professional based in Nakuru, Kenya.',
}

export default async function AboutPage() {
  const profile = await prisma.profile.findFirst({ where: { isPublished: true } }).catch(() => null)
  return (
    <main className="relative min-h-screen">
      <ParticleBackground />
      <Navbar profileName={profile?.name || 'George Mwangi'} />
      <PageHero title="About Me" subtitle="My story, values and what drives me" />
      <AboutSection profile={profile} />
      <Footer profile={profile} />
    </main>
  )
}
