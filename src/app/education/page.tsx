import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { EducationSection } from '@/components/sections/EducationSection'
import { CertificationsSection } from '@/components/sections/CertificationsSection'
import { ParticleBackground } from '@/components/shared/ParticleBackground'
import { PageHero } from '@/components/shared/PageHero'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Education',
  description: 'Academic background and professional certifications of George Mwangi.',
}

export default async function EducationPage() {
  const [profile, education, certifications] = await Promise.all([
    prisma.profile.findFirst({ where: { isPublished: true } }).catch(() => null),
    prisma.education.findMany({ where: { isPublished: true }, orderBy: { order: 'asc' } }).catch(() => []),
    prisma.certification.findMany({ where: { isPublished: true }, orderBy: { order: 'asc' } }).catch(() => []),
  ])
  return (
    <main className="relative min-h-screen">
      <ParticleBackground />
      <Navbar profileName={profile?.name || 'George Mwangi'} />
      <PageHero title="Education" subtitle="Academic foundations and professional certifications" />
      <EducationSection education={education} />
      <CertificationsSection certifications={certifications} />
      <Footer profile={profile} />
    </main>
  )
}
