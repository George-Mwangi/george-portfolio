import { PrismaClient, SkillCategory, ToolCategory } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@2024!'
  const hashedPassword = await bcrypt.hash(adminPassword, 12)

  await prisma.user.deleteMany()
  await prisma.user.create({
    data: {
      email: 'mwangig25@gmail.com',
      name: 'George Mwangi',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })
  console.log('Admin user created')

  await prisma.profile.deleteMany()
  await prisma.profile.create({
  data: {
    name: 'George Mwangi',
    title: [
      'Software Developer',
      'System Administrator',
      'IT Support Specialist',
      'Cybersecurity Enthusiast',
    ],
    summary:
      'Results-driven IT Professional with over five years of experience in software development, systems administration, IT support, enterprise business systems, and digital transformation. Experienced in developing business applications, administering enterprise infrastructure, automating workflows, supporting networks, implementing business systems, and improving operational efficiency. Passionate about cybersecurity, cloud technologies, and building modern software solutions.',
    email: 'mwangig25@gmail.com',
    phone: '+254706609056',
    whatsappNumber: '+254706609056',
    location: 'Nakuru, Kenya',
    isPublished: true,
  },
})
  console.log('Profile created')

  await prisma.experience.deleteMany()
  await prisma.experience.createMany({
  data: [
    {
      company: 'Agventure Limited',
      role: 'System Administrator | Systems Developer | IT Support Specialist',
      startDate: new Date('2021-02-01'),
      endDate: new Date('2025-09-30'),
      isCurrent: false,
      location: 'Nakuru, Kenya',
      achievements: [
        'Developed business applications using Knack and AppSheet',
        'Administered Windows Servers and Microsoft 365',
        'Managed company network infrastructure and firewalls',
        'Supported Palladium Accounting System',
        'Managed SmartB Weighbridge System',
        'Implemented CCTV, biometric and alarm systems',
        'Coordinated IT hardware procurement and maintenance',
        'Provided organisation-wide technical support',
        'Supported transport and logistics operations',
      ],
      order: 1,
      isPublished: true,
    },
    {
      company: 'FSD Africa',
      role: 'Software Developer',
      startDate: new Date('2020-09-01'),
      endDate: new Date('2020-11-30'),
      isCurrent: false,
      location: 'Nairobi, Kenya',
      achievements: [
        'Developed Power Platform applications',
        'Built workflow automation solutions',
        'Contributed to ERP implementation',
        'Created Power BI dashboards',
        'Collaborated with international stakeholders',
      ],
      order: 2,
      isPublished: true,
    },
    {
      company: 'Joetrix Infotech',
      role: 'IT Consultant & Software Developer',
      startDate: new Date('2020-01-01'),
      endDate: new Date('2020-08-31'),
      isCurrent: false,
      location: 'Nairobi, Kenya',
      achievements: [
        'Managed Microsoft 365 environments',
        'Administered Windows Servers',
        'Managed Azure Active Directory',
        'Supported SharePoint deployments',
        'Provided IT support and software development',
      ],
      order: 3,
      isPublished: true,
    },
  ],
})
  console.log('Experience created')

  await prisma.education.deleteMany()
  await prisma.education.createMany({
  data: [
    {
      institution: 'Chuka University',
      degree: 'Diploma',
      field: 'Computer Science',
      startDate: new Date('2017-01-01'),
      endDate: new Date('2020-12-31'),
      order: 1,
      isPublished: true,
    },
    {
      institution: 'CodeBrave',
      degree: 'Cybersecurity Training',
      field: 'Cybersecurity',
      startDate: new Date('2021-01-01'),
      endDate: new Date('2021-12-31'),
      order: 2,
      isPublished: true,
    },
    {
      institution: 'Udemy',
      degree: 'Certificate',
      field: 'Web Development',
      startDate: new Date('2020-01-01'),
      endDate: new Date('2020-12-31'),
      order: 3,
      isPublished: true,
    },
  ],
})
  console.log('Education created')

  await prisma.certification.deleteMany()
  await prisma.certification.createMany({
  data: [
    {
      name: 'International Computer Driving License (ICDL)',
      issuer: 'ICDL',
      order: 1,
      isPublished: true,
    },
    {
      name: 'Google Digital Skills',
      issuer: 'Google',
      order: 2,
      isPublished: true,
    },
    {
      name: 'Certificate in Web Development',
      issuer: 'Udemy',
      order: 3,
      isPublished: true,
    },
    {
      name: 'Cybersecurity Training',
      issuer: 'CodeBrave',
      order: 4,
      isPublished: true,
    },
    {
      name: 'TryHackMe Security Badges',
      issuer: 'TryHackMe',
      order: 5,
      isPublished: true,
    },
  ],
})
  console.log('Certifications created')

  await prisma.skill.deleteMany()
  await prisma.skill.createMany({
  data: [
    { name: 'Python', category: SkillCategory.CORE, proficiency: 90, order: 1, isPublished: true },
    { name: 'React', category: SkillCategory.CORE, proficiency: 88, order: 2, isPublished: true },
    { name: 'Node.js', category: SkillCategory.CORE, proficiency: 85, order: 3, isPublished: true },
    { name: 'System Administration', category: SkillCategory.CORE, proficiency: 92, order: 4, isPublished: true },
    { name: 'Microsoft 365 Administration', category: SkillCategory.CORE, proficiency: 90, order: 5, isPublished: true },
    { name: 'Network Administration', category: SkillCategory.CORE, proficiency: 88, order: 6, isPublished: true },
    { name: 'Cybersecurity', category: SkillCategory.CORE, proficiency: 80, order: 7, isPublished: true },
    { name: 'SQL Databases', category: SkillCategory.CORE, proficiency: 88, order: 8, isPublished: true },
    { name: 'Power Platform', category: SkillCategory.CORE, proficiency: 90, order: 9, isPublished: true },
    { name: 'IT Support', category: SkillCategory.CORE, proficiency: 95, order: 10, isPublished: true },
  ],
})
  console.log('Skills created')

  await prisma.tool.deleteMany()
  await prisma.tool.createMany({
  data: [
      { name: 'Python', category: ToolCategory.PROGRAMMING, order: 1, isPublished: true },
      { name: 'React', category: ToolCategory.PROGRAMMING, order: 2, isPublished: true },
      { name: 'Next.js', category: ToolCategory.PROGRAMMING, order: 3, isPublished: true },
      { name: 'FastAPI', category: ToolCategory.PROGRAMMING, order: 4, isPublished: true },
      { name: 'PostgreSQL', category: ToolCategory.DATABASE, order: 1, isPublished: true },
      { name: 'Prisma', category: ToolCategory.DATABASE, order: 2, isPublished: true },
      { name: 'Git', category: ToolCategory.DEVOPS, order: 1, isPublished: true },
      { name: 'GitHub', category: ToolCategory.DEVOPS, order: 2, isPublished: true },
      { name: 'Vercel', category: ToolCategory.DEVOPS, order: 3, isPublished: true },
      { name: 'Microsoft 365', category: ToolCategory.CLOUD, order: 1, isPublished: true },
      { name: 'Google Workspace', category: ToolCategory.CLOUD, order: 2, isPublished: true },
      { name: 'Windows Server', category: ToolCategory.SYSTEMS, order: 1, isPublished: true },
      { name: 'Active Directory', category: ToolCategory.SYSTEMS, order: 2, isPublished: true },
      { name: 'SharePoint', category: ToolCategory.SYSTEMS, order: 3, isPublished: true },
      { name: 'Power Apps', category: ToolCategory.PRODUCTIVITY, order: 1, isPublished: true },
      { name: 'Power BI', category: ToolCategory.PRODUCTIVITY, order: 2, isPublished: true },
      { name: 'Power Automate', category: ToolCategory.PRODUCTIVITY, order: 3, isPublished: true },
      { name: 'Wireshark', category: ToolCategory.SECURITY, order: 1, isPublished: true },
      { name: 'Nmap', category: ToolCategory.SECURITY, order: 2, isPublished: true },
      { name: 'TryHackMe', category: ToolCategory.SECURITY, order: 3, isPublished: true },
      { name: 'Teams', category: ToolCategory.COMMUNICATION, order: 1, isPublished: true },
      { name: 'Slack', category: ToolCategory.COMMUNICATION, order: 2, isPublished: true },
      { name: 'Zoom', category: ToolCategory.COMMUNICATION, order: 3, isPublished: true },
      { name: 'Trello', category: ToolCategory.PROJECT_MANAGEMENT, order: 1, isPublished: true },
      { name: 'ClickUp', category: ToolCategory.PROJECT_MANAGEMENT, order: 2, isPublished: true },
      { name: 'Slack', category: ToolCategory.COMMUNICATION, order: 2, isPublished: true },
      { name: 'Microsoft Teams', category: ToolCategory.COMMUNICATION, order: 3, isPublished: true },
      { name: 'Google Meet', category: ToolCategory.COMMUNICATION, order: 4, isPublished: true },
    ],
  })
  console.log('Tools created')

  console.log('Seed complete')
  console.log('Admin login:')
  console.log('Email: mwangig25@gmail.com')
  console.log(`Password: ${adminPassword}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })