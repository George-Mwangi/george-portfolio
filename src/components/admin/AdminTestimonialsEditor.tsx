'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { CheckCircle2, XCircle, Eye, EyeOff, Trash2, Star, Quote, Edit2, Save, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

export function AdminTestimonialsEditor({ testimonials: init }: { testimonials: any[] }) {
  const [testimonials, setTestimonials] = useState(init)
  const [editingId, setEditingId]       = useState<string|null>(null)
  const [editForm, setEditForm]         = useState<any>(null)
  const [saving, setSaving]             = useState(false)
  const [deleting, setDeleting]         = useState<string|null>(null)

  const pending   = testimonials.filter(t => !t.isPublished)
  const published = testimonials.filter(t =>  t.isPublished)

  const togglePublish = async (t: any) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${t.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !t.isPublished }),
      })
      if (!res.ok) throw new Error()
      const saved = await res.json()
      setTestimonials(testimonials.map(x => x.id === saved.id ? saved : x))
      toast.success(saved.isPublished ? 'Published — now visible on site' : 'Unpublished')
    } catch { toast.error('Failed') }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this testimonial permanently?')) return
    setDeleting(id)
    try {
      await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' })
      setTestimonials(testimonials.filter(t => t.id !== id))
      toast.success('Deleted')
    } catch { toast.error('Failed') }
    finally { setDeleting(null) }
  }

  const startEdit = (t: any) => { setEditingId(t.id); setEditForm({ ...t }) }
  const cancelEdit = () => { setEditingId(null); setEditForm(null) }

  const saveEdit = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/testimonials/${editForm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      if (!res.ok) throw new Error()
      const saved = await res.json()
      setTestimonials(testimonials.map(t => t.id === saved.id ? saved : t))
      toast.success('Updated')
      cancelEdit()
    } catch { toast.error('Failed') }
    finally { setSaving(false) }
  }

  const TestimonialCard = ({ t }: { t: any }) => (
    <div className={cn('glass-card rounded-2xl p-5 border transition-all',
      t.isPublished ? 'border-border/50' : 'border-amber-500/30 bg-amber-500/3')}>
      {editingId === t.id ? (
        <div className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3" suppressHydrationWarning>
            {[['authorName','Name'],['authorTitle','Job Title'],['authorCompany','Company']].map(([f,l]) => (
              <div key={f} suppressHydrationWarning>
                <label className="text-xs text-muted-foreground mb-1 block">{l}</label>
                <input value={editForm[f]||''} onChange={e=>setEditForm({...editForm,[f]:e.target.value})}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:border-primary/50 focus:outline-none" suppressHydrationWarning />
              </div>
            ))}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Rating (1-5)</label>
              <input type="number" min={1} max={5} value={editForm.rating||5} onChange={e=>setEditForm({...editForm,rating:Number(e.target.value)})}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:border-primary/50 focus:outline-none" />
            </div>
          </div>
          <div suppressHydrationWarning>
            <label className="text-xs text-muted-foreground mb-1 block">Content</label>
            <textarea rows={4} value={editForm.content||''} onChange={e=>setEditForm({...editForm,content:e.target.value})}
              className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:border-primary/50 focus:outline-none resize-none" suppressHydrationWarning />
          </div>
          <div className="flex gap-2">
            <button onClick={saveEdit} disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60">
              {saving ? <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Save
            </button>
            <button onClick={cancelEdit} className="px-4 py-2 rounded-xl border border-border text-muted-foreground text-sm hover:text-foreground">Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                {t.authorName?.split(' ').map((n:string)=>n[0]).join('').slice(0,2).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{t.authorName}</p>
                <p className="text-xs text-muted-foreground">{[t.authorTitle, t.authorCompany].filter(Boolean).join(' · ')}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {Array.from({length:5}).map((_,i)=>(
                <Star key={i} className={cn('w-3.5 h-3.5', i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30')} />
              ))}
            </div>
          </div>
          <div className="flex items-start gap-2 mb-4">
            <Quote className="w-4 h-4 text-primary/30 shrink-0 mt-0.5" />
            <p className="text-muted-foreground text-sm leading-relaxed">{t.content}</p>
          </div>
          {!t.isPublished && (
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mb-3">⏳ Pending review — not visible on site</p>
          )}
          <div className="flex gap-2">
            <button onClick={() => togglePublish(t)}
              className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                t.isPublished
                  ? 'bg-muted text-muted-foreground hover:bg-muted/80'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90')}>
              {t.isPublished ? <><EyeOff className="w-3.5 h-3.5" />Unpublish</> : <><CheckCircle2 className="w-3.5 h-3.5" />Approve & Publish</>}
            </button>
            <button onClick={() => startEdit(t)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-muted-foreground hover:text-foreground hover:border-primary/40">
              <Edit2 className="w-3.5 h-3.5" />Edit
            </button>
            <button onClick={() => remove(t.id)} disabled={deleting===t.id}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-50">
              <Trash2 className="w-3.5 h-3.5" />Delete
            </button>
          </div>
        </>
      )}
    </div>
  )

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-xl font-display font-bold text-foreground">Testimonials</h2>
        <p className="text-sm text-muted-foreground mt-1">Review submissions from clients. Approve to make them visible on the site.</p>
      </div>

      {pending.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Pending Review ({pending.length})
          </h3>
          <div className="space-y-3">
            {pending.map(t => <TestimonialCard key={t.id} t={t} />)}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Published ({published.length})</h3>
        <div className="space-y-3">
          {published.map(t => <TestimonialCard key={t.id} t={t} />)}
        </div>
        {testimonials.length === 0 && <p className="text-center py-12 text-muted-foreground">No testimonials yet. They'll appear here after clients submit them.</p>}
      </div>
    </div>
  )
}
