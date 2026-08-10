import { prisma } from '@/lib/prisma'
import { parseSiteSections, SITE_SECTIONS_SETTING_KEY } from '@/lib/siteSections'

export async function getSiteSections() {
  const setting = await prisma.siteSettings.findUnique({
    where: { key: SITE_SECTIONS_SETTING_KEY },
    select: { value: true },
  }).catch(() => null)

  return parseSiteSections(setting?.value)
}
