import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await req.json()

    const experience = await prisma.experience.create({
      data: {
        company: body.company,
        role: body.role,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        isCurrent: body.isCurrent ?? false,
        description: body.description ?? '',
        achievements: body.achievements ?? [],
        location: body.location ?? '',
        order: body.order ?? 0,
        isPublished: body.isPublished ?? true,
      },
    })

    return NextResponse.json(experience)
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { message: 'Failed to create experience' },
      { status: 500 }
    )
  }
}