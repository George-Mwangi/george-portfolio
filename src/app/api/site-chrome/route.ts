import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const [navigation, socialLinks] = await Promise.all([
    prisma.navigationItem.findMany({ where: { isVisible: true }, orderBy: { order: 'asc' } }),
    prisma.socialLink.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
  ])
  return NextResponse.json({ navigation, socialLinks })
}
