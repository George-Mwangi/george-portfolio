'use client'

import { useEffect, useRef, useState } from 'react'
import { Copy, File, Image as ImageIcon, Trash2, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { upload as uploadToBlob } from '@vercel/blob/client'

function safeFilename(filename: string) {
  return filename.normalize('NFKD').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'upload'
}

export function AdminMediaUploader({ profile, assets: initialAssets = [] }: { profile: any; assets?: any[] }) {
  const [assets, setAssets] = useState(initialAssets)
  const [uploading, setUploading] = useState(false)
  const input = useRef<HTMLInputElement>(null)

  // Always refresh from the database when returning to this tab instead of
  // reusing the dashboard's original in-memory snapshot.
  useEffect(() => {
    fetch('/api/admin/media', { cache: 'no-store' })
      .then(async (response) => {
        const result = await response.json()
        if (!response.ok) throw new Error(result.message || 'Unable to load media')
        setAssets(result.assets || [])
      })
      .catch(() => toast.error('Could not refresh the media library'))
  }, [])

  const upload = async (file: File, type = 'asset') => {
    setUploading(true)
    try {
      let result: any
      try {
        const blob = await uploadToBlob(`portfolio/${type}/${safeFilename(file.name)}`, file, {
          access: 'public',
          handleUploadUrl: '/api/admin/media/upload',
          clientPayload: JSON.stringify({ type }),
          multipart: file.size > 4 * 1024 * 1024,
        })
        const response = await fetch('/api/admin/media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: blob.url, name: file.name, mimeType: file.type, size: file.size, type }),
        })
        result = await response.json()
        if (!response.ok) throw new Error(result.message || 'Unable to register uploaded file')
      } catch (blobError) {
        if (!['localhost', '127.0.0.1'].includes(window.location.hostname)) throw blobError
        const data = new FormData()
        data.append('file', file)
        data.append('type', type)
        const response = await fetch('/api/admin/media', { method: 'POST', body: data })
        result = await response.json()
        if (!response.ok) throw new Error(result.message || 'Upload failed')
      }
      if (result.asset) setAssets((current) => [result.asset, ...current])
      toast.success('Uploaded. Copy its URL to reuse it anywhere.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const remove = async (asset: any) => {
    if (!confirm(`Remove ${asset.name} from the library?`)) return
    const response = await fetch('/api/admin/media', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: asset.id }) })
    if (response.ok) setAssets((current) => current.filter((item) => item.id !== asset.id))
  }

  const copy = (url: string) => navigator.clipboard.writeText(url).then(() => toast.success('URL copied'))

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div><h2 className="font-display text-2xl font-bold">Media Library</h2><p className="mt-1 text-sm text-muted-foreground">Upload images, certificates and CV files once, then reuse their URLs across CMS forms.</p></div>
        <button onClick={() => input.current?.click()} disabled={uploading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"><Upload className="h-4 w-4" />{uploading ? 'Uploading…' : 'Upload media'}</button>
        <input ref={input} type="file" accept="image/*,.pdf,.doc,.docx" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) upload(file); event.currentTarget.value = '' }} />
      </div>
      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold">Current branding</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[['Profile image', profile?.profileImageUrl], ['Hero image', profile?.heroImageUrl], ['Logo', profile?.logoUrl], ['Favicon', profile?.faviconUrl]].map(([label, url]) => <div key={label} className="rounded-xl border border-border p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 truncate text-sm">{url || 'Not set'}</p></div>)}</div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset) => <article key={asset.id} className="overflow-hidden rounded-2xl border border-border bg-card">{asset.kind === 'IMAGE' || asset.kind === 'ICON' ? <img src={asset.url} alt={asset.altText || asset.name} className="h-36 w-full bg-muted object-cover" /> : <div className="grid h-36 place-items-center bg-muted"><File className="h-10 w-10 text-primary" /></div>}<div className="p-4"><div className="flex items-start gap-2"><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{asset.name}</p><p className="mt-1 text-xs text-muted-foreground">{asset.kind} · {asset.size ? `${Math.round(asset.size / 1024)} KB` : ''}</p></div><button onClick={() => copy(asset.url)} title="Copy URL" className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><Copy className="h-4 w-4" /></button><button onClick={() => remove(asset)} title="Delete" className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button></div></div></article>)}
        {assets.length === 0 && <div className="col-span-full rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground"><ImageIcon className="mx-auto mb-3 h-8 w-8 opacity-40" />No uploaded media yet.</div>}
      </div>
    </section>
  )
}
