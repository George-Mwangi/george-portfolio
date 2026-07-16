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
  id: '1',
  name: 'George Mwangi',
  title: [
    'IT Professional',
    'Cyber Security Specialist',
    'Full Stack Web Developer',
    'Network & Systems Administrator'
  ],

  summary:
    "I'm an IT Professional with experience in software development, cyber security, IT infrastructure, cloud technologies, networking, technical support, and business systems. I build secure, scalable web applications while helping organizations improve operational efficiency through technology. I'm passionate about ethical hacking, automation, and solving real-world business challenges.",

  email: 'mwangig25@gmail.com',
  phone: '+254706609056',
  location: 'Nakuru, Kenya',

  whatsappNumber: '+254706609056',

  linkedinUrl: null,
  githubUrl: 'https://github.com/George-Mwangi',
  twitterUrl: null,

  profileImageUrl: null,
  faviconUrl: null,
  logoUrl: null,
  cvUrl: null,
  cvFileName: null,

  isPublished: true,
  createdAt: new Date(),
  updatedAt: new Date(),
},
  experiences: [
  {
    id: '1',
    company: 'Agventure Limited',
    role: 'IT Specialist',

    startDate: new Date('2021-02-09'),
    endDate: new Date('2025-10-24'),
    isCurrent: false,

    location: 'Nakuru, Kenya',

    description: null,

    order: 1,
    isPublished: true,

    createdAt: new Date(),
    updatedAt: new Date(),

    achievements: [
      'IT Support',
      'Network Administration',
      'Database Development',
      'Knack Development',
      'AppSheet Development',
      'Palladium ERP Support',
      'Google Workspace Administration',
      'Hardware & Software Maintenance',
      'Systems Troubleshooting',
      'Technical Documentation'
    ]
  }
],
  education: [
  {
    id: '1',
    institution: 'Chuka University',

    degree: 'Diploma',

    field: 'Computer Science',

    startDate: new Date('2018-09-09'),
    endDate: new Date('2020-12-18'),

    isCurrent: false,

    grade: null,
    description: null,

    order: 1,
    isPublished: true,

    createdAt: new Date(),
    updatedAt: new Date(),
  }
],
  certifications: [
  {
    id: '1',

    name: 'Cyber Security Certification',

    issuer: 'CodeBrave',

    issueDate: new Date('2021-01-01'),

    expiryDate: null,

    credentialId: null,
    credentialUrl: null,
    imageUrl: null,

    order: 1,
    isPublished: true,

    createdAt: new Date(),
    updatedAt: new Date(),
  }
],
  skills: [
  {
    id: '1',
    name: 'Cyber Security',
    category: 'CORE',
    proficiency: 90,
    order: 1,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Full Stack Development',
    category: 'CORE',
    proficiency: 92,
    order: 2,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Python',
    category: 'CORE',
    proficiency: 90,
    order: 3,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'React & Next.js',
    category: 'CORE',
    proficiency: 90,
    order: 4,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'Networking',
    category: 'CORE',
    proficiency: 88,
    order: 5,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    name: 'Problem Solving',
    category: 'SOFT',
    proficiency: 95,
    order: 1,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '7',
    name: 'Communication',
    category: 'SOFT',
    proficiency: 90,
    order: 2,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '8',
    name: 'Project Management',
    category: 'SOFT',
    proficiency: 85,
    order: 3,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
],
  tools: [
  {
    id: '1',
    name: 'React',
    category: 'PROGRAMMING',
    iconUrl: null,
    order: 1,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Next.js',
    category: 'PROGRAMMING',
    iconUrl: null,
    order: 2,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'TypeScript',
    category: 'PROGRAMMING',
    iconUrl: null,
    order: 3,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Python',
    category: 'PROGRAMMING',
    iconUrl: null,
    order: 4,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'FastAPI',
    category: 'FRAMEWORK',
    iconUrl: null,
    order: 5,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    name: 'PostgreSQL',
    category: 'DATABASE',
    iconUrl: null,
    order: 6,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '7',
    name: 'Docker',
    category: 'DEVOPS',
    iconUrl: null,
    order: 7,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '8',
    name: 'Git',
    category: 'DEVOPS',
    iconUrl: null,
    order: 8,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '9',
    name: 'Kali Linux',
    category: 'CYBER_SECURITY',
    iconUrl: null,
    order: 9,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '10',
    name: 'Wireshark',
    category: 'CYBER_SECURITY',
    iconUrl: null,
    order: 10,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
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
