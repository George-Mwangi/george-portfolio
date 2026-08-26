import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { SkillsSection } from '@/components/sections/SkillsSection'
import { ToolsSection } from '@/components/sections/ToolsSection'
import { ParticleBackground } from '@/components/shared/ParticleBackground'
import { PageHero } from '@/components/shared/PageHero'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSiteSections } from '@/lib/siteSectionSettings'
import { isSiteSectionEnabled } from '@/lib/siteSections'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Skills',
  description: 'Skills and tools expertise of George Mwangi — Web Development, Cyber Security and System Administration.',
}

export default async function SkillsPage() {
  const [profile, skills, tools, sections] = await Promise.all([
    prisma.profile.findFirst({ where: { isPublished: true } }).catch(() => null),
    prisma.skill.findMany({ where: { isPublished: true }, include: { skillGroup: true }, orderBy: { order: 'asc' } }).catch(() => []),
    prisma.tool.findMany({ where: { isPublished: true }, orderBy: { order: 'asc' } }).catch(() => []),
    getSiteSections(),
  ])
  const skillsEnabled = isSiteSectionEnabled(sections, 'skills')
  const toolsEnabled = isSiteSectionEnabled(sections, 'tools')
  if (!skillsEnabled && !toolsEnabled) notFound()
  return (
    <main className="relative min-h-screen">
      <ParticleBackground />
      <Navbar profileName={profile?.name || 'Portfolio'} logoUrl={profile?.logoUrl} sections={sections} />
      <PageHero
        title={skillsEnabled && toolsEnabled ? 'Skills & Tools' : skillsEnabled ? 'Skills' : 'Tools'}
        subtitle="Capabilities built across years of professional experience"
      />
      {skillsEnabled && <SkillsSection skills={skills} />}
      {toolsEnabled && <ToolsSection tools={tools} />}
      <Footer profile={profile} sections={sections} />
    </main>
  )
}
