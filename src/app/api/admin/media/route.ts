import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { del, put } from '@vercel/blob'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/x-icon', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
const MAX_SIZE = 10 * 1024 * 1024

function safeFilename(filename: string) {
  return filename.normalize('NFKD').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'upload'
}

function isVercelBlobUrl(url: string) {
  try {
    return new URL(url).hostname.endsWith('.blob.vercel-storage.com')
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  try {
    if (req.headers.get('content-type')?.includes('application/json')) {
      const body = await req.json()
      const { url, name, mimeType, size, altText, type } = body as { url?: string; name?: string; mimeType?: string; size?: number; altText?: string; type?: string }
      if (!url || !name || !mimeType || !type || !isVercelBlobUrl(url)) return NextResponse.json({ message: 'Invalid uploaded file metadata' }, { status: 400 })
      if (!ALLOWED_TYPES.includes(mimeType)) return NextResponse.json({ message: 'File type not allowed' }, { status: 400 })
      if (Number(size || 0) > MAX_SIZE) return NextResponse.json({ message: 'File too large (max 10MB)' }, { status: 400 })

      const kind = mimeType.startsWith('image/') ? (type === 'favicon' ? 'ICON' : 'IMAGE') : 'DOCUMENT'
      const asset = await prisma.mediaAsset.create({ data: { name, url, kind, mimeType, size: Number(size || 0) || null, altText: altText || null } })
      const profile = await prisma.profile.findFirst()
      const updateData: Record<string, string> = {}
      if (type === 'profileImage') updateData.profileImageUrl = url
      if (type === 'heroImage') updateData.heroImageUrl = url
      if (type === 'logo') updateData.logoUrl = url
      if (type === 'favicon') updateData.faviconUrl = url
      if (profile && Object.keys(updateData).length) await prisma.profile.update({ where: { id: profile.id }, data: updateData })
      return NextResponse.json({ url, asset })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const type = formData.get('type') as string | null

    if (!file || !type) return NextResponse.json({ message: 'Missing file or type' }, { status: 400 })
    if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ message: 'File type not allowed' }, { status: 400 })
    if (file.size > MAX_SIZE) return NextResponse.json({ message: 'File too large (max 10MB)' }, { status: 400 })

    const filename = safeFilename(file.name)
    let url: string

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`portfolio/${type}/${filename}`, file, {
        access: 'public',
        addRandomSuffix: true,
        contentType: file.type,
        cacheControlMaxAge: 60 * 60 * 24 * 30,
      })
      url = blob.url
    } else {
      if (process.env.VERCEL) {
        return NextResponse.json({ message: 'Vercel Blob is not connected. Add BLOB_READ_WRITE_TOKEN to this deployment and redeploy.' }, { status: 503 })
      }

      // Local development fallback. Production uploads always use Vercel Blob.
      const ext = filename.includes('.') ? filename.split('.').pop() : 'bin'
      const localFilename = `${type}-${Date.now()}.${ext}`
      const uploadDir = join(process.cwd(), 'public', 'uploads')
      await mkdir(uploadDir, { recursive: true })
      await writeFile(join(uploadDir, localFilename), Buffer.from(await file.arrayBuffer()))
      url = `/uploads/${localFilename}`
    }

    const kind = file.type.startsWith('image/') ? (type === 'favicon' ? 'ICON' : 'IMAGE') : 'DOCUMENT'
    const asset = await prisma.mediaAsset.create({ data: { name: file.name, url, kind, mimeType: file.type, size: file.size, altText: String(formData.get('altText') || '') || null } })

    // Update profile for dedicated branding slots.
    const profile = await prisma.profile.findFirst()
    const updateData: Record<string, string> = {}
    if (type === 'profileImage') updateData.profileImageUrl = url
    if (type === 'heroImage')    updateData.heroImageUrl = url
    if (type === 'logo')         updateData.logoUrl = url
    if (type === 'favicon')      updateData.faviconUrl = url

    if (profile) {
      await prisma.profile.update({ where: { id: profile.id }, data: updateData })
    }

    return NextResponse.json({ url, asset })
  } catch (err) {
    console.error('Media upload error:', err)
    return NextResponse.json({ message: err instanceof Error ? `Upload failed: ${err.message}` : 'Upload failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const { type, id } = await req.json()
  if (id) {
    const asset = await prisma.mediaAsset.findUnique({ where: { id } })
    if (asset && isVercelBlobUrl(asset.url) && process.env.BLOB_READ_WRITE_TOKEN) await del(asset.url)
    if (asset) await prisma.mediaAsset.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  }
  const profile = await prisma.profile.findFirst()
  if (!profile) return NextResponse.json({ ok: true })

  const updateData: Record<string, null> = {}
  if (type === 'profileImage') updateData.profileImageUrl = null
  if (type === 'logo')         updateData.logoUrl = null
  if (type === 'favicon')      updateData.faviconUrl = null

  await prisma.profile.update({ where: { id: profile.id }, data: updateData })
  return NextResponse.json({ ok: true })
}
