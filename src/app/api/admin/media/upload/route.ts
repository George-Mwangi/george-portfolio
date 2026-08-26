import { NextRequest, NextResponse } from 'next/server'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { auth } from '@/lib/auth'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/x-icon', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
const MAX_SIZE = 10 * 1024 * 1024

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  if (!process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ message: 'Vercel Blob is not connected to this deployment.' }, { status: 503 })

  try {
    const body = await req.json() as HandleUploadBody
    const response = await handleUpload({
      request: req,
      body,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith('portfolio/')) throw new Error('Invalid upload path')
        return {
          allowedContentTypes: ALLOWED_TYPES,
          maximumSizeInBytes: MAX_SIZE,
          addRandomSuffix: true,
          cacheControlMaxAge: 60 * 60 * 24 * 30,
        }
      },
    })
    return NextResponse.json(response)
  } catch (error) {
    console.error('Blob token error:', error)
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Unable to authorize upload' }, { status: 400 })
  }
}
