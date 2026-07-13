import { Suspense } from 'react'
import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { HeroSection } from '@/components/sections/HeroSection'
import { AboutSection } from '@/components/sections/AboutSection'
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

// ── Fallback seed data (used when DB is not yet connected) ─────────────────────
const FALLBACK = {
  profile: {
    id: '1', name: 'George Mwangi',
    title: ['Procurement Officer', 'Sales Executive', 'Customer Service Professional', 'Logistics Specialist'],
    summary: "I'm a proactive and adaptable professional with a strong background in sales, customer service, administrative support, and logistics. I have built a track record of delivering exceptional customer experiences, resolving issues promptly, and consistently surpassing sales targets. I bring a people-first approach, excellent communication skills, and strong attention to detail.",
    email: 'mwangig25@gmail.com', phone: '+254719440407', location: 'Nakuru, Kenya',
    whatsappNumber: '+254719440407', linkedinUrl: null, githubUrl: null, twitterUrl: null,
    profileImageUrl: null, faviconUrl: null, logoUrl: null, cvUrl: null, cvFileName: null,
    isPublished: true, createdAt: new Date(), updatedAt: new Date(),
  },
  experiences: [
    { id: '1', company: 'Outspan Hospital', role: 'Procurement Officer', startDate: new Date('2026-01-01'), endDate: null, isCurrent: true, location: 'Kenya', description: null, order: 1, isPublished: true, createdAt: new Date(), updatedAt: new Date(), achievements: ['Procurement Planning', 'Supplier Evaluation', 'Contract Negotiation', 'Procurement Documentation', 'Inventory Management', 'Warehouse Coordination', 'Logistics Coordination', 'Regulatory Compliance', 'Procurement Reporting'] },
    { id: '2', company: 'Airtel Kenya', role: 'Sales Executive', startDate: new Date('2025-01-01'), endDate: new Date('2025-12-31'), isCurrent: false, location: 'Kenya', description: null, order: 2, isPublished: true, createdAt: new Date(), updatedAt: new Date(), achievements: ['Agent Recruitment', 'Distribution Channel Management', 'Territory Mapping', 'Route Planning', 'Market Expansion', 'Relationship Management', 'Sales Growth', 'Product Visibility', 'Market Intelligence', 'Sales Reporting'] },
  ],
  education: [
    { id: '1', institution: 'Kenya Institute of Supply Examination Board', degree: 'Certified Procurement and Supply Professional of Kenya (CPSP-K)', field: 'Procurement & Supply', startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31'), isCurrent: false, grade: null, description: null, order: 1, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { id: '2', institution: 'Kabarak University', degree: "Bachelor's Degree", field: 'Procurement and Logistics', startDate: new Date('2019-01-01'), endDate: new Date('2023-12-31'), isCurrent: false, grade: null, description: null, order: 2, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
  ],
  certifications: [
    { id: '1', name: 'Certified Procurement and Supply Professional of Kenya', issuer: 'Kenya Institute of Supply Examination Board', issueDate: new Date('2024-12-01'), expiryDate: null, credentialId: null, credentialUrl: null, imageUrl: null, order: 1, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
  ],
  skills: [
    { id: '1', name: 'Procurement Management', category: 'CORE', proficiency: 95, order: 1, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { id: '2', name: 'Supply Chain Logistics', category: 'CORE', proficiency: 90, order: 2, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { id: '3', name: 'Contract Negotiation', category: 'CORE', proficiency: 88, order: 3, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { id: '4', name: 'Sales & Business Development', category: 'CORE', proficiency: 92, order: 4, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { id: '5', name: 'Customer Service', category: 'CORE', proficiency: 95, order: 5, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { id: '6', name: 'CRM', category: 'SOFT', proficiency: 95, order: 1, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { id: '7', name: 'Problem Solving', category: 'SOFT', proficiency: 90, order: 2, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { id: '8', name: 'Time Management', category: 'SOFT', proficiency: 92, order: 3, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
  ],
  tools: [
    { id: '1', name: 'Zendesk', category: 'CRM_SUPPORT', iconUrl: null, order: 1, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { id: '2', name: 'HubSpot', category: 'CRM_SUPPORT', iconUrl: null, order: 2, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { id: '3', name: 'Microsoft Office', category: 'PRODUCTIVITY', iconUrl: null, order: 1, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { id: '4', name: 'SAP', category: 'ERP_ACCOUNTING', iconUrl: null, order: 1, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { id: '5', name: 'Trello', category: 'PROJECT_MANAGEMENT', iconUrl: null, order: 1, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
    { id: '6', name: 'Slack', category: 'COMMUNICATION', iconUrl: null, order: 1, isPublished: true, createdAt: new Date(), updatedAt: new Date() },
  ],
  projects: [],
  clients: [],
  testimonials: [],
}

async function getData() {
  try {
    const [profile, experiences, education, certifications, skills, tools, projects, clients, testimonials] =
      await Promise.all([
        prisma.profile.findFirst({ where: { isPublished: true } }),
        prisma.experience.findMany({ where: { isPublished: true }, orderBy: { order: 'asc' } }),
        prisma.education.findMany({ where: { isPublished: true }, orderBy: { order: 'asc' } }),
        prisma.certification.findMany({ where: { isPublished: true }, orderBy: { order: 'asc' } }),
        prisma.skill.findMany({ where: { isPublished: true }, orderBy: { order: 'asc' } }),
        prisma.tool.findMany({ where: { isPublished: true }, orderBy: { order: 'asc' } }),
        prisma.project.findMany({ where: { isPublished: true }, orderBy: [{ isFeatured: 'desc' }, { order: 'asc' }] }),
        prisma.client.findMany({ where: { isPublished: true }, orderBy: { order: 'asc' } }),
        prisma.testimonial.findMany({ where: { isPublished: true }, orderBy: { order: 'asc' } }),
      ])
    return { profile, experiences, education, certifications, skills, tools, projects, clients, testimonials }
  } catch {
    return FALLBACK
  }
}

export default async function HomePage() {
  const d = await getData()

  return (
    <main className="relative min-h-screen">
      <ParticleBackground />
      <Navbar profileName={d.profile?.name || 'George Mwangi'} />

      <HeroSection profile={d.profile} />
      <AboutSection profile={d.profile} />

      <Suspense fallback={null}><SkillsSection skills={d.skills} /></Suspense>
      <Suspense fallback={null}><ExperienceSection experiences={d.experiences} /></Suspense>
      <Suspense fallback={null}><EducationSection education={d.education} /></Suspense>
      <Suspense fallback={null}><CertificationsSection certifications={d.certifications} /></Suspense>
      <Suspense fallback={null}><ToolsSection tools={d.tools} /></Suspense>

      {d.projects.length > 0 && (
        <Suspense fallback={null}><ProjectsSection projects={d.projects} /></Suspense>
      )}
      {d.clients.length > 0 && (
        <Suspense fallback={null}><ClientsSection clients={d.clients} /></Suspense>
      )}
      {d.testimonials.length > 0 && (
        <Suspense fallback={null}><TestimonialsSection testimonials={d.testimonials} /></Suspense>
      )}

      <ResumeSection cvUrl={d.profile?.cvUrl} />
      <ContactSection profile={d.profile} />
      <Footer profile={d.profile} />
    </main>
  )
}
