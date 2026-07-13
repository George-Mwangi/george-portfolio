import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { ClientsSection } from '@/components/sections/ClientsSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { TestimonialSubmitForm } from '@/components/sections/TestimonialSubmitForm'
import { ParticleBackground } from '@/components/shared/ParticleBackground'
import { PageHero } from '@/components/shared/PageHero'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Clients & Testimonials',
  description: 'Clients and testimonials for George Mwangi — procurement and supply chain professional.',
}

export default async function ClientsPage() {
  const [profile, clients, testimonials] = await Promise.all([
    prisma.profile.findFirst({ where: { isPublished: true } }).catch(() => null),
    prisma.client.findMany({ where: { isPublished: true }, orderBy: { order: 'asc' } }).catch(() => []),
    prisma.testimonial.findMany({ where: { isPublished: true }, orderBy: { order: 'asc' } }).catch(() => []),
  ])
  return (
    <main className="relative min-h-screen">
      <ParticleBackground />
      <Navbar profileName={profile?.name || 'George Mwangi'} />
      <PageHero title="Clients & Testimonials" subtitle="Organisations I've served and what they say" />
      <ClientsSection clients={clients} />
      {testimonials.length > 0 && <TestimonialsSection testimonials={testimonials} />}
      <TestimonialSubmitForm />
      <Footer profile={profile} />
    </main>
  )
}
