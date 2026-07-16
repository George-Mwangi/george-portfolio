import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const profileSchema = z.object({
  name: z.string().min(2).max(100),
  summary: z.string().min(10).max(5000),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  whatsappNumber: z.string().optional(),
})

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = profileSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ message: 'Invalid data' }, { status: 400 })

  try {
    const existing = await prisma.profile.findFirst()
    const data = {
      ...parsed.data,
      linkedinUrl: parsed.data.linkedinUrl || null,
    }

    const profile = existing
      ? await prisma.profile.update({ where: { id: existing.id }, data })
      : await prisma.profile.create({ data: { ...data, title: ['IT Proffesional'] } })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id as string,
        action: existing ? 'UPDATE' : 'CREATE',
        resource: 'Profile',
        resourceId: profile.id,
      },
    })

    return NextResponse.json(profile)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
