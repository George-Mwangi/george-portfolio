import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { AboutSection } from '@/components/sections/AboutSection'
import { ParticleBackground } from '@/components/shared/ParticleBackground'
import { PageHero } from '@/components/shared/PageHero'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSiteSections } from '@/lib/siteSectionSettings'
import { isSiteSectionEnabled } from '@/lib/siteSections'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about George Mwangi — IT professional based in Nakuru, Kenya.',
}

export default async function AboutPage() {
  const [profile, about, sections] = await Promise.all([
    prisma.profile.findFirst({ where: { isPublished: true } }).catch(() => null),
    prisma.aboutContent.findFirst({ where: { isPublished: true }, include: { points: { where: { isActive: true }, orderBy: { order: 'asc' } } } }).catch(() => null),
    getSiteSections(),
  ])
  if (!isSiteSectionEnabled(sections, 'about')) notFound()
  return (
    <main className="relative min-h-screen">
      <ParticleBackground />
      <Navbar profileName={profile?.name || 'Portfolio'} sections={sections} />
      <PageHero title="About Me" subtitle="My story, values and what drives me" />
        <AboutSection profile={profile} about={about} />
      <Footer profile={profile} sections={sections} />
    </main>
  )
}
