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
        'Procurement Officer',
        'Sales Executive',
        'Customer Service Professional',
        'Logistics Specialist',
      ],
      summary:
        "I'm a proactive and adaptable professional with a strong background in sales, customer service, administrative support, and logistics. I have built a track record of delivering exceptional customer experiences, resolving issues promptly, and consistently surpassing sales targets. I bring a people-first approach, excellent communication skills, and strong attention to detail. I thrive in dynamic environments and take pride in helping businesses grow by building trust with customers.",
      email: 'mwangig25@gmail.com',
      phone: '+254719440407',
      location: 'Nakuru, Kenya',
      whatsappNumber: '+254719440407',
      isPublished: true,
    },
  })
  console.log('Profile created')

  await prisma.experience.deleteMany()
  await prisma.experience.createMany({
    data: [
      {
        company: 'Outspan Hospital',
        role: 'Procurement Officer',
        startDate: new Date('2026-01-01'),
        isCurrent: true,
        location: 'Kenya',
        achievements: [
          'Procurement Planning',
          'Supplier Evaluation',
          'Contract Negotiation',
          'Procurement Documentation',
          'Inventory Management',
          'Warehouse Coordination',
          'Logistics Coordination',
          'Regulatory Compliance',
          'Procurement Reporting',
        ],
        order: 1,
        isPublished: true,
      },
      {
        company: 'Airtel Kenya',
        role: 'Sales Executive',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        isCurrent: false,
        location: 'Kenya',
        achievements: [
          'Agent Recruitment',
          'Distribution Channel Management',
          'Territory Mapping',
          'Route Planning',
          'Market Expansion',
          'Relationship Management',
          'Sales Growth',
          'Product Visibility',
          'Market Intelligence',
          'Sales Reporting',
        ],
        order: 2,
        isPublished: true,
      },
    ],
  })
  console.log('Experience created')

  await prisma.education.deleteMany()
  await prisma.education.createMany({
    data: [
      {
        institution: 'Kenya Institute of Supply Examination Board',
        degree: 'Certified Procurement and Supply Professional of Kenya (CPSP-K)',
        field: 'Procurement & Supply',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        order: 1,
        isPublished: true,
      },
      {
        institution: 'Kabarak University',
        degree: "Bachelor's Degree",
        field: 'Procurement and Logistics',
        startDate: new Date('2019-01-01'),
        endDate: new Date('2023-12-31'),
        order: 2,
        isPublished: true,
      },
    ],
  })
  console.log('Education created')

  await prisma.certification.deleteMany()
  await prisma.certification.create({
    data: {
      name: 'Certified Procurement and Supply Professional of Kenya',
      issuer: 'Kenya Institute of Supply Examination Board',
      issueDate: new Date('2024-12-01'),
      order: 1,
      isPublished: true,
    },
  })
  console.log('Certifications created')

  await prisma.skill.deleteMany()
  await prisma.skill.createMany({
    data: [
      { name: 'Procurement Management', category: SkillCategory.CORE, proficiency: 95, order: 1, isPublished: true },
      { name: 'Supply Chain Logistics', category: SkillCategory.CORE, proficiency: 90, order: 2, isPublished: true },
      { name: 'Contract Negotiation', category: SkillCategory.CORE, proficiency: 88, order: 3, isPublished: true },
      { name: 'Sales & Business Development', category: SkillCategory.CORE, proficiency: 92, order: 4, isPublished: true },
      { name: 'Customer Service', category: SkillCategory.CORE, proficiency: 95, order: 5, isPublished: true },
      { name: 'Inventory Management', category: SkillCategory.CORE, proficiency: 88, order: 6, isPublished: true },
    ],
  })
  console.log('Skills created')

  await prisma.tool.deleteMany()
  await prisma.tool.createMany({
    data: [
      { name: 'Zendesk', category: ToolCategory.CRM_SUPPORT, order: 1, isPublished: true },
      { name: 'HubSpot', category: ToolCategory.CRM_SUPPORT, order: 2, isPublished: true },
      { name: 'Freshdesk', category: ToolCategory.CRM_SUPPORT, order: 3, isPublished: true },
      { name: 'Microsoft Office', category: ToolCategory.PRODUCTIVITY, order: 1, isPublished: true },
      { name: 'Microsoft Excel', category: ToolCategory.PRODUCTIVITY, order: 2, isPublished: true },
      { name: 'Microsoft Word', category: ToolCategory.PRODUCTIVITY, order: 3, isPublished: true },
      { name: 'PowerPoint', category: ToolCategory.PRODUCTIVITY, order: 4, isPublished: true },
      { name: 'Google Workspace', category: ToolCategory.PRODUCTIVITY, order: 5, isPublished: true },
      { name: 'Trello', category: ToolCategory.PROJECT_MANAGEMENT, order: 1, isPublished: true },
      { name: 'ClickUp', category: ToolCategory.PROJECT_MANAGEMENT, order: 2, isPublished: true },
      { name: 'Zoom', category: ToolCategory.COMMUNICATION, order: 1, isPublished: true },
      { name: 'Slack', category: ToolCategory.COMMUNICATION, order: 2, isPublished: true },
      { name: 'Microsoft Teams', category: ToolCategory.COMMUNICATION, order: 3, isPublished: true },
      { name: 'Google Meet', category: ToolCategory.COMMUNICATION, order: 4, isPublished: true },
      { name: 'QuickBooks', category: ToolCategory.ERP_ACCOUNTING, order: 1, isPublished: true },
      { name: 'SAP', category: ToolCategory.ERP_ACCOUNTING, order: 2, isPublished: true },
      { name: 'POS Systems', category: ToolCategory.ERP_ACCOUNTING, order: 3, isPublished: true },
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