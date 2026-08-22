import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { ClientsSection } from '@/components/sections/ClientsSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { TestimonialSubmitForm } from '@/components/sections/TestimonialSubmitForm'
import { ParticleBackground } from '@/components/shared/ParticleBackground'
import { PageHero } from '@/components/shared/PageHero'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSiteSections } from '@/lib/siteSectionSettings'
import { isSiteSectionEnabled } from '@/lib/siteSections'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Clients & Testimonials',
  description: 'Clients and testimonials for George Mwangi — IT professional.',
}

export default async function ClientsPage() {
  const [profile, clients, testimonials, sections] = await Promise.all([
    prisma.profile.findFirst({ where: { isPublished: true } }).catch(() => null),
    prisma.client.findMany({ where: { isPublished: true }, orderBy: { order: 'asc' } }).catch(() => []),
    prisma.testimonial.findMany({ where: { isPublished: true }, orderBy: { order: 'asc' } }).catch(() => []),
    getSiteSections(),
  ])
  const clientsEnabled = isSiteSectionEnabled(sections, 'clients')
  const testimonialsEnabled = isSiteSectionEnabled(sections, 'testimonials')
  if (!clientsEnabled && !testimonialsEnabled) notFound()
  return (
    <main className="relative min-h-screen">
      <ParticleBackground />
      <Navbar profileName={profile?.name || 'Portfolio'} sections={sections} />
      <PageHero
        title={clientsEnabled && testimonialsEnabled ? 'Clients & Testimonials' : clientsEnabled ? 'Clients' : 'Testimonials'}
        subtitle="Organisations I've served and what they say"
      />
      {clientsEnabled && <ClientsSection clients={clients} />}
      {testimonialsEnabled && testimonials.length > 0 && <TestimonialsSection testimonials={testimonials} />}
      {testimonialsEnabled && <TestimonialSubmitForm />}
      <Footer profile={profile} sections={sections} />
    </main>
  )
}
