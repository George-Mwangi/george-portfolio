import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@2024!', 12)
  await prisma.user.upsert({ where: { email: 'mwangig25@gmail.com' }, update: {}, create: { email: 'mwangig25@gmail.com', name: 'George Mwangi', password, role: 'ADMIN' } })

  let profile = await prisma.profile.findFirst()
  if (!profile) profile = await prisma.profile.create({ data: {
    name: 'George Mwangi', title: ['Systems Administrator','Full-Stack Developer','Business Automation Specialist','IT Support Specialist','Cybersecurity Specialist'],
    mainTitle: 'IT Systems & Software Solutions Specialist', heroDescription: 'I build, automate, and support the technology that keeps businesses running.',
    summary: 'Results-driven IT professional with over five years of experience in software development, systems administration, IT support, enterprise business systems, and digital transformation.',
    professionalSummary: 'Experienced in developing business applications, administering enterprise infrastructure, automating workflows, supporting networks, implementing business systems, and improving operational efficiency.',
    email: 'mwangig25@gmail.com', phone: '+254706609056', whatsappNumber: '+254706609056', location: 'Nakuru, Kenya',
    availabilityText: 'Available for new opportunities', primaryCtaText: 'View My Work', primaryCtaUrl: '#projects', secondaryCtaText: 'Hire Me', secondaryCtaUrl: '#contact', isPublished: true,
  } })
  else if (!profile.mainTitle) profile = await prisma.profile.update({ where: { id: profile.id }, data: {
    mainTitle: 'IT Systems & Software Solutions Specialist',
    heroDescription: profile.heroDescription || 'I build, automate, and support the technology that keeps businesses running.',
    professionalSummary: profile.professionalSummary || profile.summary,
    availabilityText: profile.availabilityText || 'Available for new opportunities',
    primaryCtaText: profile.primaryCtaText || 'View My Work', primaryCtaUrl: profile.primaryCtaUrl || '#projects',
    secondaryCtaText: profile.secondaryCtaText || 'Hire Me', secondaryCtaUrl: profile.secondaryCtaUrl || '#contact',
  } })

  if (await prisma.profileTitle.count({ where: { profileId: profile.id } }) === 0) {
    const titles = profile.title.length ? profile.title : ['Systems Administrator','Full-Stack Developer','Business Automation Specialist','IT Support Specialist','Cybersecurity Specialist']
    await prisma.profileTitle.createMany({ data: titles.map((title, order) => ({ profileId: profile!.id, title, order, isPrimary: order === 0, isActive: true })) })
  }

  let about = await prisma.aboutContent.findFirst()
  if (!about) about = await prisma.aboutContent.create({ data: { sectionTitle: 'About Me', subtitle: 'IT systems, software and automation', introduction: 'I turn operational challenges into reliable technology solutions.', professionalSummary: profile.professionalSummary || profile.summary, mission: 'Build practical, secure technology that improves how organisations work.', ctaText: 'View My Experience', ctaUrl: '#experience' } })

  const groups = [
    ['Development','Software engineering and web technologies'],['Databases','Data storage and querying'],['Systems','Infrastructure and administration'],['Automation','Business process automation'],['Security','Security and network analysis'],
  ] as const
  for (const [order,[name,description]] of groups.entries()) await prisma.skillGroup.upsert({ where: { name }, update: {}, create: { name, description, order } })
  const allGroups = await prisma.skillGroup.findMany()
  const groupId = (name:string) => allGroups.find((group)=>group.name===name)?.id
  const assignments: Record<string,string> = { Python:'Development',React:'Development','Node.js':'Development','SQL Databases':'Databases','System Administration':'Systems','Microsoft 365 Administration':'Systems','Network Administration':'Systems','Power Platform':'Automation',Cybersecurity:'Security','IT Support':'Systems' }
  for (const [skillName,groupName] of Object.entries(assignments)) await prisma.skill.updateMany({ where: { name: skillName, skillGroupId: null }, data: { skillGroupId: groupId(groupName), proficiency: null } })

  if (await prisma.service.count() === 0) await prisma.service.createMany({ data: [
    { title:'IT Systems & Infrastructure',description:'Administration and support for servers, networks, Microsoft 365 and business-critical infrastructure.',order:0 },
    { title:'Business Automation',description:'Workflow and operational automation using practical low-code and custom software solutions.',order:1 },
    { title:'Full-Stack Development',description:'Modern web applications and internal business systems built around real operational needs.',order:2 },
    { title:'IT Support',description:'Responsive end-user, hardware, software and enterprise systems support.',order:3 },
    { title:'Cybersecurity',description:'Security-conscious systems administration, assessment and infrastructure hardening.',order:4 },
  ] })

  if (await prisma.achievement.count() === 0) await prisma.achievement.create({ data: { title:'Years Experience',label:'Years Experience',value:'5',suffix:'+',description:'Professional experience across software, systems, support and automation.',order:0,isPublished:true } })

  for (const experience of await prisma.experience.findMany()) if (await prisma.experienceDetail.count({ where: { experienceId: experience.id } }) === 0 && experience.achievements.length) await prisma.experienceDetail.createMany({ data: experience.achievements.map((text,order)=>({ experienceId:experience.id,type:'RESPONSIBILITY',text,order })) })

  if (await prisma.navigationItem.count() === 0) await prisma.navigationItem.createMany({ data: [
    ['Home','/'],['About','/#about'],['Services','/#services'],['Skills','/#skills'],['Experience','/#experience'],['Projects','/#projects'],['Certifications','/#certifications'],['Contact','/#contact'],
  ].map(([label,url],order)=>({label,url,order,isVisible:true})) })

  if (await prisma.socialLink.count() === 0) {
    const links = [['LinkedIn',profile.linkedinUrl],['GitHub',profile.githubUrl],['WhatsApp',profile.whatsappNumber ? `https://wa.me/${profile.whatsappNumber.replace(/\D/g,'')}` : null]].filter((entry): entry is [string,string]=>Boolean(entry[1]))
    if (links.length) await prisma.socialLink.createMany({ data: links.map(([platform,url],order)=>({platform,url,order})) })
  }
  if (await prisma.contactContent.count() === 0) await prisma.contactContent.create({ data: { heading:"Let's work together",description:'Have an opportunity or a technology challenge? Send me a message.',email:profile.email,phone:profile.phone,location:profile.location } })
  if (await prisma.seoSettings.count() === 0) await prisma.seoSettings.create({ data: { siteTitle:`${profile.name} | ${profile.mainTitle || 'Professional Portfolio'}`,metaDescription:profile.summary,keywords:[profile.name,'IT systems','business automation','full-stack development','IT support','Kenya'],canonicalUrl:process.env.NEXT_PUBLIC_SITE_URL } })
}

main().catch((error)=>{console.error(error);process.exit(1)}).finally(()=>prisma.$disconnect())
