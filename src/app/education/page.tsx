import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { EducationSection } from '@/components/sections/EducationSection'
import { CertificationsSection } from '@/components/sections/CertificationsSection'
import { ParticleBackground } from '@/components/shared/ParticleBackground'
import { PageHero } from '@/components/shared/PageHero'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSiteSections } from '@/lib/siteSectionSettings'
import { isSiteSectionEnabled } from '@/lib/siteSections'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Education',
  description: 'Academic background and professional certifications of George Mwangi.',
}

export default async function EducationPage() {
  const [profile, education, certifications, sections] = await Promise.all([
    prisma.profile.findFirst({ where: { isPublished: true } }).catch(() => null),
    prisma.education.findMany({ where: { isPublished: true }, orderBy: { order: 'asc' } }).catch(() => []),
    prisma.certification.findMany({ where: { isPublished: true }, orderBy: { order: 'asc' } }).catch(() => []),
    getSiteSections(),
  ])
  const educationEnabled = isSiteSectionEnabled(sections, 'education')
  const certificationsEnabled = isSiteSectionEnabled(sections, 'certifications')
  if (!educationEnabled && !certificationsEnabled) notFound()
  return (
    <main className="relative min-h-screen">
      <ParticleBackground />
      <Navbar profileName={profile?.name || 'Portfolio'} sections={sections} />
      <PageHero
        title={educationEnabled && certificationsEnabled ? 'Education & Certifications' : educationEnabled ? 'Education' : 'Certifications'}
        subtitle="Academic foundations and professional certifications"
      />
      {educationEnabled && <EducationSection education={education} />}
      {certificationsEnabled && <CertificationsSection certifications={certifications} />}
      <Footer profile={profile} sections={sections} />
    </main>
  )
}
