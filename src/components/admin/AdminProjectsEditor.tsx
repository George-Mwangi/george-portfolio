'use client'
import { useState } from 'react'
import { Plus, Trash2, Save, X, FolderOpen, Star, StarOff } from 'lucide-react'
import toast from 'react-hot-toast'

const empty = { title: '', description: '', category: '', client: '', projectUrl: '', imageUrl: '', tags: '', isFeatured: false }

export function AdminProjectsEditor({ projects: init }: { projects: any[] }) {
  const [projects, setProjects] = useState(init)
  const [form, setForm]         = useState<any|null>(null)
  const [saving, setSaving]     = useState(false)
  const [deleting, setDeleting] = useState<string|null>(null)

  const save = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return }
    setSaving(true)
    try {
      const isEdit = !!form.id
      const payload = { ...form, tags: typeof form.tags === 'string' ? form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : form.tags }
      const res = await fetch(isEdit ? `/api/admin/projects/${form.id}` : '/api/admin/projects', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      const saved = await res.json()
      setProjects(isEdit ? projects.map(p => p.id === saved.id ? saved : p) : [...projects, saved])
      toast.success(isEdit ? 'Updated' : 'Added')
      setForm(null)
    } catch { toast.error('Failed') }
    finally { setSaving(false) }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this project?')) return
    setDeleting(id)
    try {
      await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' })
      setProjects(projects.filter(p => p.id !== id))
      toast.success('Deleted')
    } catch { toast.error('Failed') }
    finally { setDeleting(null) }
  }

  const openEdit = (p: any) => setForm({ ...p, tags: Array.isArray(p.tags) ? p.tags.join(', ') : p.tags || '' })

  const toggleFeatured = async (project: any) => {
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...project, isFeatured: !project.isFeatured }),
      })
      if (!res.ok) throw new Error()
      const saved = await res.json()
      setProjects(projects.map(p => p.id === saved.id ? saved : p))
    } catch { toast.error('Failed') }
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-foreground">Projects</h2>
        <button onClick={() => setForm({ ...empty })}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
          <Plus className="w-4 h-4" />Add Project
        </button>
      </div>

      {form && (
        <div className="glass-card rounded-2xl p-5 border border-primary/20 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{form.id ? 'Edit' : 'New'} Project</h3>
            <button onClick={() => setForm(null)}><X className="w-4 h-4 text-muted-foreground" /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3" suppressHydrationWarning>
            {[['title','Project Title *'],['category','Category'],['client','Client Name'],['projectUrl','Project URL'],['imageUrl','Image URL']].map(([f,l]) => (
              <div key={f} suppressHydrationWarning>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">{l}</label>
                <input value={form[f]||''} onChange={e=>setForm({...form,[f]:e.target.value})}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:border-primary/50 focus:outline-none" suppressHydrationWarning />
              </div>
            ))}
            <div suppressHydrationWarning>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Tags (comma-separated)</label>
              <input value={form.tags||''} onChange={e=>setForm({...form,tags:e.target.value})} placeholder="IT, Cyber Security, FullStack Development, Kenya"
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:border-primary/50 focus:outline-none" suppressHydrationWarning />
            </div>
          </div>
          <div suppressHydrationWarning>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Description *</label>
            <textarea rows={4} value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})}
              className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:border-primary/50 focus:outline-none resize-none" suppressHydrationWarning />
          </div>
          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <input type="checkbox" checked={form.isFeatured} onChange={e=>setForm({...form,isFeatured:e.target.checked})} />
            Mark as featured project
          </label>
          <button onClick={save} disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60">
            {saving ? <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {projects.map(p => (
          <div key={p.id} className="glass-card rounded-2xl border border-border/50 overflow-hidden flex flex-col">
            <div className="h-32 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative">
              {p.imageUrl ? <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" /> : <FolderOpen className="w-10 h-10 text-primary/20" />}
              {p.isFeatured && (
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">Featured</span>
              )}
            </div>
            <div className="p-4 flex-1">
              <h3 className="font-semibold text-foreground text-sm">{p.title}</h3>
              {p.client && <p className="text-xs text-primary mt-0.5">Client: {p.client}</p>}
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
            </div>
            <div className="px-4 pb-4 flex gap-2">
              <button onClick={() => toggleFeatured(p)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 transition-all">
                {p.isFeatured ? <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> : <StarOff className="w-4 h-4" />}
              </button>
              <button onClick={() => openEdit(p)} className="flex-1 py-1.5 rounded-lg text-xs font-medium border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all">Edit</button>
              <button onClick={() => remove(p.id)} disabled={deleting===p.id} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-50"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
      {projects.length===0 && <p className="text-center py-12 text-muted-foreground">No projects yet. Click "Add Project" to start.</p>}
    </div>
  )
}
