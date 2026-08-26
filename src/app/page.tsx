import { Suspense } from 'react'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { HeroSection } from '@/components/sections/HeroSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { AchievementsSection } from '@/components/sections/AchievementsSection'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { SkillsSection } from '@/components/sections/SkillsSection'
import { ExperienceSection } from '@/components/sections/ExperienceSection'
import { EducationSection } from '@/components/sections/EducationSection'
import { CertificationsSection } from '@/components/sections/CertificationsSection'
import { ToolsSection } from '@/components/sections/ToolsSection'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { ClientsSection } from '@/components/sections/ClientsSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { ResumeSection } from '@/components/sections/ResumeSection'
import { ContactSection } from '@/components/sections/ContactSection'
import { ParticleBackground } from '@/components/shared/ParticleBackground'
import { prisma } from '@/lib/prisma'
import { getSiteSections } from '@/lib/siteSectionSettings'
import { isSiteSectionEnabled, type SiteSectionId } from '@/lib/siteSections'

export const dynamic = 'force-dynamic'

async function getData() {
  const siteSections = await getSiteSections()
  try {
    const [profile, about, achievements, services, experiences, education, certifications, skills, tools, projects, clients, testimonials, navigation, socialLinks, contact, activeResume] = await Promise.all([
      prisma.profile.findFirst({ where: { isPublished: true }, include: { titles: { where: { isActive: true }, orderBy: { order: 'asc' } } } }),
      prisma.aboutContent.findFirst({ where: { isPublished: true }, include: { points: { where: { isActive: true }, orderBy: { order: 'asc' } } } }),
      prisma.achievement.findMany({ where: { isPublished: true }, orderBy: { order: 'asc' } }),
      prisma.service.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
      prisma.experience.findMany({ where: { isPublished: true }, include: { details: { orderBy: { order: 'asc' } } }, orderBy: { order: 'asc' } }),
      prisma.education.findMany({ where: { isPublished: true }, orderBy: { order: 'asc' } }),
      prisma.certification.findMany({ where: { isPublished: true }, orderBy: [{ isFeatured: 'desc' }, { order: 'asc' }] }),
      prisma.skill.findMany({ where: { isPublished: true, OR: [{ skillGroupId: null }, { skillGroup: { isActive: true } }] }, include: { skillGroup: true }, orderBy: { order: 'asc' } }),
      prisma.tool.findMany({ where: { isPublished: true }, orderBy: { order: 'asc' } }),
      prisma.project.findMany({ where: { isPublished: true }, include: { images: { orderBy: { order: 'asc' } }, technologies: { include: { skill: true }, orderBy: { order: 'asc' } } }, orderBy: [{ isFeatured: 'desc' }, { order: 'asc' }] }),
      prisma.client.findMany({ where: { isPublished: true }, orderBy: { order: 'asc' } }),
      prisma.testimonial.findMany({ where: { isPublished: true }, orderBy: { order: 'asc' } }),
      prisma.navigationItem.findMany({ where: { isVisible: true }, orderBy: { order: 'asc' } }),
      prisma.socialLink.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
      prisma.contactContent.findFirst({ where: { isPublished: true } }),
      prisma.resume.findFirst({ where: { isActive: true }, orderBy: { updatedAt: 'desc' } }),
    ])
    return { profile, about, achievements, services, experiences, education, certifications, skills, tools, projects, clients, testimonials, navigation, socialLinks, contact, activeResume, siteSections }
  } catch (error) {
    console.error('Portfolio content could not be loaded', error)
    return { profile: null, about: null, achievements: [], services: [], experiences: [], education: [], certifications: [], skills: [], tools: [], projects: [], clients: [], testimonials: [], navigation: [], socialLinks: [], contact: null, activeResume: null, siteSections }
  }
}

export default async function HomePage() {
  const d = await getData()
  const enabled = d.siteSections.filter((section) => section.enabled).map((section) => section.id)
  const renderSection = (id: SiteSectionId) => {
    switch (id) {
      case 'hero': return <HeroSection profile={d.profile} enabledSections={enabled}/>
      case 'about': return <AboutSection profile={d.profile} about={d.about}/>
      case 'achievements': return <AchievementsSection achievements={d.achievements}/>
      case 'services': return <ServicesSection services={d.services}/>
      case 'skills': return <Suspense fallback={null}><SkillsSection skills={d.skills}/></Suspense>
      case 'experience': return <ExperienceSection experiences={d.experiences}/>
      case 'education': return <EducationSection education={d.education}/>
      case 'certifications': return <CertificationsSection certifications={d.certifications}/>
      case 'tools': return <ToolsSection tools={d.tools}/>
      case 'projects': return <ProjectsSection projects={d.projects}/>
      case 'clients': return <ClientsSection clients={d.clients}/>
      case 'testimonials': return <TestimonialsSection testimonials={d.testimonials}/>
      case 'resume': return <ResumeSection cvUrl={d.activeResume?.fileUrl || d.profile?.cvUrl}/>
      case 'contact': return <ContactSection profile={d.profile} content={d.contact} socialLinks={d.socialLinks}/>
    }
  }
  return <main className="relative min-h-screen"><ParticleBackground/><Navbar profileName={d.profile?.name || 'Portfolio'} logoUrl={d.profile?.logoUrl} sections={d.siteSections} items={d.navigation}/>{d.siteSections.filter((section)=>isSiteSectionEnabled(d.siteSections,section.id)).sort((a,b)=>a.order-b.order).map((section)=><div key={section.id} className="contents">{renderSection(section.id)}</div>)}<Footer profile={d.profile} sections={d.siteSections} items={d.navigation} socialLinks={d.socialLinks}/></main>
}
