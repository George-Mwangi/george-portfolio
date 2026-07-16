import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { ContactSection } from '@/components/sections/ContactSection'
import { ParticleBackground } from '@/components/shared/ParticleBackground'
import { PageHero } from '@/components/shared/PageHero'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with George Mwangi — open to Web Development, Cyber Security and System Administration opportunities around the world.',
}

export default async function ContactPage() {
  const profile = await prisma.profile.findFirst({ where: { isPublished: true } }).catch(() => null)
  return (
    <main className="relative min-h-screen">
      <ParticleBackground />
      <Navbar profileName={profile?.name || 'George Mwangi'} />
      <PageHero title="Contact" subtitle="Let's connect and explore opportunities together" />
      <ContactSection profile={profile} />
      <Footer profile={profile} />
    </main>
  )
}
