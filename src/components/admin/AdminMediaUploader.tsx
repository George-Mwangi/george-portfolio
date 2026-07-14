'use client'

import { useState, useRef } from 'react'
import { Upload, Image, Globe, Trash2, CheckCircle2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface Props { profile: any }

type MediaType = 'profileImage' | 'logo' | 'favicon'

const MEDIA_CONFIG: { type: MediaType; label: string; description: string; accept: string; maxMB: number; recommended: string }[] = [
  {
    type: 'profileImage',
    label: 'Profile Photo',
    description: 'Your main profile photograph shown on the homepage hero.',
    accept: 'image/jpeg,image/png,image/webp',
    maxMB: 5,
    recommended: '400×400px or larger. Square format recommended.',
  },
  {
    type: 'logo',
    label: 'Logo (Optional)',
    description: 'A personal logo or brand mark used in the navbar and footer.',
    accept: 'image/jpeg,image/png,image/webp,image/svg+xml',
    maxMB: 2,
    recommended: 'SVG or PNG with transparent background. Min 200px wide.',
  },
  {
    type: 'favicon',
    label: 'Favicon',
    description: 'The small icon shown in browser tabs. Replaces the default GM initials.',
    accept: 'image/png,image/x-icon,image/svg+xml',
    maxMB: 1,
    recommended: '32×32px or 64×64px PNG/ICO/SVG.',
  },
]

function UploadCard({ config, currentUrl, onUploaded }: {
  config: typeof MEDIA_CONFIG[0]
  currentUrl?: string | null
  onUploaded: (url: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview]     = useState<string | null>(currentUrl || null)

  const handleFile = async (file: File) => {
    if (file.size > config.maxMB * 1024 * 1024) {
      toast.error(`File too large. Max ${config.maxMB}MB.`)
      return
    }
    setUploading(true)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', config.type)
      const res = await fetch('/api/admin/media', { method: 'POST', body: formData })
      if (!res.ok) throw new Error((await res.json()).message || 'Upload failed')
      const { url } = await res.json()
      onUploaded(url)
      toast.success(`${config.label} updated!`)
    } catch (err: any) {
      toast.error(err.message || 'Upload failed')
      setPreview(currentUrl || null)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async () => {
    if (!confirm(`Remove ${config.label}?`)) return
    try {
      await fetch('/api/admin/media', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: config.type }) })
      setPreview(null)
      onUploaded('')
      toast.success('Removed.')
    } catch { toast.error('Failed to remove.') }
  }

  return (
    <div className="glass-card rounded-2xl p-6 border border-border/50">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">{config.label}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{config.description}</p>
          <p className="text-xs text-muted-foreground/60 mt-1">{config.recommended}</p>
        </div>
        {preview && (
          <button onClick={handleRemove} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all ml-4 shrink-0">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Preview */}
      {preview ? (
        <div className="mb-4 flex items-center gap-4">
          <div className={cn('rounded-xl overflow-hidden border border-border/50 bg-muted/30 flex items-center justify-center',
            config.type === 'favicon' ? 'w-12 h-12' : config.type === 'logo' ? 'w-32 h-16' : 'w-20 h-20')}>
            <img src={preview} alt={config.label} className="w-full h-full object-contain" />
          </div>
          <div className="flex items-center gap-1.5 text-sm text-primary">
            <CheckCircle2 className="w-4 h-4" />
            Uploaded
          </div>
        </div>
      ) : (
        <div className="mb-4 flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-dashed border-border">
          <Image className="w-5 h-5 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground/60">No {config.label.toLowerCase()} uploaded yet</p>
        </div>
      )}

      <input ref={inputRef} type="file" accept={config.accept} className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
      <button onClick={() => inputRef.current?.click()} disabled={uploading}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-60">
        {uploading
          ? <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          : <Upload className="w-4 h-4" />}
        {uploading ? 'Uploading…' : preview ? `Replace ${config.label}` : `Upload ${config.label}`}
      </button>
    </div>
  )
}

export function AdminMediaUploader({ profile }: Props) {
  const [urls, setUrls] = useState({
    profileImage: profile?.profileImageUrl || '',
    logo:         profile?.logoUrl         || '',
    favicon:      profile?.faviconUrl      || '',
  })

  const handleUploaded = (type: MediaType) => (url: string) => {
    setUrls((prev) => ({ ...prev, [type]: url }))
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-display font-bold text-foreground">Media & Branding</h2>
        <p className="text-sm text-muted-foreground mt-1">Upload your profile photo, logo, and favicon. Files are stored in <code className="text-xs bg-muted px-1.5 py-0.5 rounded">/public/uploads/</code></p>
      </div>

      <div className="space-y-4">
        {MEDIA_CONFIG.map((config) => (
          <UploadCard
            key={config.type}
            config={config}
            currentUrl={urls[config.type]}
            onUploaded={handleUploaded(config.type)}
          />
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Favicon note</p>
            <p>After uploading a favicon, you may need to clear your browser cache or do a hard refresh (Ctrl+Shift+R) to see it update in browser tabs.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
