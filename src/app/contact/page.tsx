import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { ContactSection } from '@/components/sections/ContactSection'
import { ParticleBackground } from '@/components/shared/ParticleBackground'
import { PageHero } from '@/components/shared/PageHero'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSiteSections } from '@/lib/siteSectionSettings'
import { isSiteSectionEnabled } from '@/lib/siteSections'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with George Mwangi — open to Web Development, Cyber Security and System Administration opportunities around the world.',
}

export default async function ContactPage() {
  const [profile, sections] = await Promise.all([
    prisma.profile.findFirst({ where: { isPublished: true } }).catch(() => null),
    getSiteSections(),
  ])
  if (!isSiteSectionEnabled(sections, 'contact')) notFound()
  return (
    <main className="relative min-h-screen">
      <ParticleBackground />
      <Navbar profileName={profile?.name || 'Portfolio'} logoUrl={profile?.logoUrl} sections={sections} />
      <PageHero title="Contact" subtitle="Let's connect and explore opportunities together" />
      <ContactSection profile={profile} />
      <Footer profile={profile} sections={sections} />
    </main>
  )
}
