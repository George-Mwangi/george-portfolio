import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { SkillsSection } from '@/components/sections/SkillsSection'
import { ToolsSection } from '@/components/sections/ToolsSection'
import { ParticleBackground } from '@/components/shared/ParticleBackground'
import { PageHero } from '@/components/shared/PageHero'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Skills',
  description: 'Skills and tools expertise of George Mwangi — procurement, logistics, sales and customer service.',
}

export default async function SkillsPage() {
  const [profile, skills, tools] = await Promise.all([
    prisma.profile.findFirst({ where: { isPublished: true } }).catch(() => null),
    prisma.skill.findMany({ where: { isPublished: true }, orderBy: { order: 'asc' } }).catch(() => []),
    prisma.tool.findMany({ where: { isPublished: true }, orderBy: { order: 'asc' } }).catch(() => []),
  ])
  return (
    <main className="relative min-h-screen">
      <ParticleBackground />
      <Navbar profileName={profile?.name || 'George Mwangi'} />
      <PageHero title="Skills & Tools" subtitle="Capabilities built across years of professional experience" />
      <SkillsSection skills={skills} />
      <ToolsSection tools={tools} />
      <Footer profile={profile} />
    </main>
  )
}
