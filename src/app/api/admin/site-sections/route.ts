import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  parseSiteSections,
  SITE_SECTION_DEFINITIONS,
  SITE_SECTIONS_SETTING_KEY,
} from '@/lib/siteSections'

const sectionIds = SITE_SECTION_DEFINITIONS.map((section) => section.id)
const sectionsSchema = z.array(z.object({
  id: z.enum(sectionIds as [typeof sectionIds[number], ...typeof sectionIds]),
  enabled: z.boolean(),
  order: z.number().int().nonnegative(),
})).length(sectionIds.length)

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const setting = await prisma.siteSettings.findUnique({ where: { key: SITE_SECTIONS_SETTING_KEY } })
  return NextResponse.json(parseSiteSections(setting?.value))
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const parsed = sectionsSchema.safeParse(await req.json())
  if (!parsed.success || new Set(parsed.data.map((section) => section.id)).size !== sectionIds.length) {
    return NextResponse.json({ message: 'Invalid section settings' }, { status: 400 })
  }

  const sections = parseSiteSections(JSON.stringify(parsed.data))
  const setting = await prisma.siteSettings.upsert({
    where: { key: SITE_SECTIONS_SETTING_KEY },
    update: { value: JSON.stringify(sections) },
    create: {
      key: SITE_SECTIONS_SETTING_KEY,
      value: JSON.stringify(sections),
      description: 'Controls public website section visibility and homepage order.',
    },
  })

  await prisma.auditLog.create({
    data: {
      userId: session.user.id as string,
      action: 'UPDATE',
      resource: 'SiteSections',
      resourceId: setting.id,
    },
  })

  // These routes read SiteSettings directly. Invalidate every public surface so
  // a visibility change is reflected immediately in production deployments.
  for (const path of ['/', '/about', '/skills', '/experience', '/education', '/projects', '/clients', '/contact', '/resume']) {
    revalidatePath(path)
  }

  return NextResponse.json(sections)
}
