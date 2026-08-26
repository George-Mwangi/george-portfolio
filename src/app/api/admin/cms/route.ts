import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type ResourceConfig = { delegate: string; fields: string[]; status?: string; order?: string }

const resources: Record<string, ResourceConfig> = {
  profileTitle: { delegate: 'profileTitle', fields: ['profileId', 'title', 'isPrimary', 'isActive', 'order'], status: 'isActive', order: 'order' },
  aboutPoint: { delegate: 'aboutPoint', fields: ['aboutId', 'text', 'isActive', 'order'], status: 'isActive', order: 'order' },
  achievement: { delegate: 'achievement', fields: ['title', 'description', 'value', 'prefix', 'suffix', 'label', 'date', 'icon', 'order', 'isPublished'], status: 'isPublished', order: 'order' },
  service: { delegate: 'service', fields: ['title', 'description', 'icon', 'iconUrl', 'order', 'isActive'], status: 'isActive', order: 'order' },
  skillGroup: { delegate: 'skillGroup', fields: ['name', 'description', 'order', 'isActive'], status: 'isActive', order: 'order' },
  skill: { delegate: 'skill', fields: ['name', 'category', 'proficiency', 'iconUrl', 'evidence', 'skillGroupId', 'order', 'isPublished'], status: 'isPublished', order: 'order' },
  experience: { delegate: 'experience', fields: ['company', 'role', 'location', 'startDate', 'endDate', 'isCurrent', 'employmentType', 'description', 'technologies', 'systems', 'responsibilities', 'experienceAchievements', 'order', 'isFeatured', 'isPublished'], status: 'isPublished', order: 'order' },
  project: { delegate: 'project', fields: ['title', 'description', 'category', 'client', 'imageUrl', 'projectUrl', 'githubUrl', 'problem', 'solution', 'role', 'features', 'results', 'tags', 'imageList', 'technologyNames', 'startDate', 'endDate', 'isFeatured', 'isPublished', 'order'], status: 'isPublished', order: 'order' },
  certification: { delegate: 'certification', fields: ['name', 'issuer', 'issueDate', 'expiryDate', 'credentialId', 'credentialUrl', 'imageUrl', 'certificateFileUrl', 'isFeatured', 'isPublished', 'order'], status: 'isPublished', order: 'order' },
  socialLink: { delegate: 'socialLink', fields: ['platform', 'url', 'icon', 'order', 'isActive'], status: 'isActive', order: 'order' },
  navigationItem: { delegate: 'navigationItem', fields: ['label', 'url', 'order', 'isVisible', 'newTab'], status: 'isVisible', order: 'order' },
  resume: { delegate: 'resume', fields: ['version', 'fileUrl', 'fileName', 'fileSize', 'isActive'], status: 'isActive' },
}

const singletonFields: Record<string, string[]> = {
  profile: ['name', 'mainTitle', 'heroDescription', 'professionalSummary', 'summary', 'email', 'phone', 'location', 'whatsappNumber', 'linkedinUrl', 'githubUrl', 'websiteUrl', 'availabilityText', 'availabilityActive', 'profileImageUrl', 'heroImageUrl', 'primaryCtaText', 'primaryCtaUrl', 'secondaryCtaText', 'secondaryCtaUrl', 'cvUrl', 'cvFileName', 'isPublished'],
  aboutContent: ['sectionTitle', 'subtitle', 'introduction', 'professionalSummary', 'mission', 'ctaText', 'ctaUrl', 'isPublished'],
  contactContent: ['heading', 'description', 'email', 'phone', 'location', 'ctaText', 'ctaUrl', 'isPublished'],
  seoSettings: ['siteTitle', 'metaDescription', 'keywords', 'openGraphTitle', 'openGraphDescription', 'openGraphImage', 'faviconUrl', 'canonicalUrl'],
}

function pick(data: Record<string, unknown>, allowed: string[]) {
  return Object.fromEntries(Object.entries(data).filter(([key]) => allowed.includes(key)))
}

function normalize(data: Record<string, any>) {
  const result = { ...data }
  for (const key of ['startDate', 'endDate', 'issueDate', 'expiryDate', 'date']) {
    if (key in result) result[key] = result[key] ? new Date(result[key]) : null
  }
  for (const key of ['order', 'proficiency', 'fileSize']) {
    if (key in result) result[key] = result[key] === '' || result[key] == null ? null : Number(result[key])
  }
  for (const key of ['features', 'results', 'tags', 'technologies', 'systems', 'keywords']) {
    if (key in result && !Array.isArray(result[key])) result[key] = String(result[key] || '').split('\n').map((v) => v.trim()).filter(Boolean)
  }
  return result
}

const lines = (value: unknown) => Array.isArray(value) ? value : String(value || '').split('\n').map((entry) => entry.trim()).filter(Boolean)

async function syncNested(resource: string, id: string, raw: Record<string, unknown>) {
  if (resource === 'experience') {
    const responsibilities = lines(raw.responsibilities)
    const achievements = lines(raw.experienceAchievements)
    await prisma.experienceDetail.deleteMany({ where: { experienceId: id } })
    if (responsibilities.length || achievements.length) await prisma.experienceDetail.createMany({ data: [
      ...responsibilities.map((text, order) => ({ experienceId: id, type: 'RESPONSIBILITY' as const, text: String(text), order })),
      ...achievements.map((text, order) => ({ experienceId: id, type: 'ACHIEVEMENT' as const, text: String(text), order })),
    ] })
  }
  if (resource === 'project') {
    const imageRows = lines(raw.imageList).map((line, order) => {
      const [url, altText] = String(line).split('|').map((part) => part.trim())
      return { projectId: id, url, altText: altText || null, isFeatured: order === 0, order }
    }).filter((row) => row.url)
    await prisma.projectImage.deleteMany({ where: { projectId: id } })
    if (imageRows.length) await prisma.projectImage.createMany({ data: imageRows })

    const technologyNames = lines(raw.technologyNames)
    await prisma.projectTechnology.deleteMany({ where: { projectId: id } })
    for (const [order, name] of technologyNames.entries()) {
      let skill = await prisma.skill.findFirst({ where: { name: { equals: String(name), mode: 'insensitive' } } })
      if (!skill) skill = await prisma.skill.create({ data: { name: String(name), category: 'TECHNICAL', order, isPublished: true } })
      await prisma.projectTechnology.create({ data: { projectId: id, skillId: skill.id, order } })
    }
  }
}

async function audit(userId: string, action: string, resource: string, resourceId?: string) {
  await prisma.auditLog.create({ data: { userId, action, resource, resourceId } })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { resource, action, id } = body as { resource: string; action: string; id?: string }
    const raw = (body.data || {}) as Record<string, unknown>

    if (action === 'saveSingleton' && singletonFields[resource]) {
      const delegate = (prisma as any)[resource]
      const data = normalize(pick(raw, singletonFields[resource]))
      const existing = await delegate.findFirst()
      const item = existing
        ? await delegate.update({ where: { id: existing.id }, data })
        : await delegate.create({ data })
      await audit(session.user.id, existing ? 'UPDATE' : 'CREATE', resource, item.id)
      return NextResponse.json(item)
    }

    const config = resources[resource]
    if (!config) return NextResponse.json({ message: 'Unsupported content type' }, { status: 400 })
    const delegate = (prisma as any)[config.delegate]
    const data = normalize(pick(raw, config.fields))
    delete data.responsibilities
    delete data.experienceAchievements
    delete data.imageList
    delete data.technologyNames

    if (resource === 'profileTitle' && !data.profileId) data.profileId = (await prisma.profile.findFirst())?.id
    if (resource === 'aboutPoint' && !data.aboutId) {
      let about = await prisma.aboutContent.findFirst()
      if (!about) about = await prisma.aboutContent.create({ data: {} })
      data.aboutId = about.id
    }

    if (action === 'create' || action === 'duplicate') {
      if (config.order && data[config.order] == null) data[config.order] = await delegate.count()
      const item = await delegate.create({ data })
      await syncNested(resource, item.id, raw)
      await audit(session.user.id, 'CREATE', resource, item.id)
      return NextResponse.json(item, { status: 201 })
    }
    if (!id) return NextResponse.json({ message: 'Missing record id' }, { status: 400 })
    if (action === 'update') {
      const item = await delegate.update({ where: { id }, data })
      await syncNested(resource, id, raw)
      await audit(session.user.id, 'UPDATE', resource, id)
      return NextResponse.json(item)
    }
    if (action === 'toggle' && config.status) {
      const current = await delegate.findUnique({ where: { id } })
      const item = await delegate.update({ where: { id }, data: { [config.status]: !current[config.status] } })
      await audit(session.user.id, 'TOGGLE', resource, id)
      return NextResponse.json(item)
    }
    if (action === 'delete') {
      await delegate.delete({ where: { id } })
      await audit(session.user.id, 'DELETE', resource, id)
      return NextResponse.json({ ok: true })
    }
    if (action === 'reorder' && config.order) {
      const ids = Array.isArray(body.ids) ? body.ids : []
      await prisma.$transaction(ids.map((recordId: string, index: number) => delegate.update({ where: { id: recordId }, data: { [config.order!]: index } })))
      await audit(session.user.id, 'REORDER', resource)
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ message: 'Unsupported action' }, { status: 400 })
  } catch (error) {
    console.error('CMS mutation failed', error)
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Unable to save content' }, { status: 500 })
  }
}
