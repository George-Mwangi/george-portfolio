'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Plus, Trash2, Save, X, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'

const empty = { name: '', industry: '', websiteUrl: '', logoUrl: '', description: '' }

export function AdminClientsEditor({ clients: init }: { clients: any[] }) {
  const [clients, setClients] = useState(init)
  const [form, setForm]       = useState<any|null>(null)
  const [saving, setSaving]   = useState(false)
  const [deleting, setDeleting] = useState<string|null>(null)

  const save = async () => {
    if (!form.name.trim()) { toast.error('Client name required'); return }
    setSaving(true)
    try {
      const isEdit = !!form.id
      const res = await fetch(isEdit ? `/api/admin/clients/${form.id}` : '/api/admin/clients', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      const saved = await res.json()
      setClients(isEdit ? clients.map(c => c.id === saved.id ? saved : c) : [...clients, saved])
      toast.success(isEdit ? 'Updated' : 'Added')
      setForm(null)
    } catch { toast.error('Failed') }
    finally { setSaving(false) }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this client?')) return
    setDeleting(id)
    try {
      await fetch(`/api/admin/clients/${id}`, { method: 'DELETE' })
      setClients(clients.filter(c => c.id !== id))
      toast.success('Deleted')
    } catch { toast.error('Failed') }
    finally { setDeleting(null) }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-foreground">Clients</h2>
        <button onClick={() => setForm({ ...empty })}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
          <Plus className="w-4 h-4" />Add Client
        </button>
      </div>
      {form && (
        <div className="glass-card rounded-2xl p-5 border border-primary/20 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{form.id ? 'Edit' : 'New'} Client</h3>
            <button onClick={() => setForm(null)}><X className="w-4 h-4 text-muted-foreground" /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3" suppressHydrationWarning>
            {[['name','Client Name *'],['industry','Industry'],['websiteUrl','Website URL'],['logoUrl','Logo URL']].map(([f,l]) => (
              <div key={f} suppressHydrationWarning>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">{l}</label>
                <input value={form[f]||''} onChange={e=>setForm({...form,[f]:e.target.value})}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:border-primary/50 focus:outline-none" suppressHydrationWarning />
              </div>
            ))}
          </div>
          <div suppressHydrationWarning>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Brief Description</label>
            <textarea rows={2} value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})}
              className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:border-primary/50 focus:outline-none resize-none" suppressHydrationWarning />
          </div>
          <button onClick={save} disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60">
            {saving ? <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-3">
        {clients.map(c => (
          <div key={c.id} className="glass-card rounded-2xl p-4 border border-border/50 flex items-center gap-3">
            {c.logoUrl ? <img src={c.logoUrl} alt={c.name} className="w-10 h-10 object-contain rounded-lg" /> : <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Building2 className="w-5 h-5 text-primary" /></div>}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm truncate">{c.name}</p>
              {c.industry && <p className="text-xs text-muted-foreground">{c.industry}</p>}
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => setForm({...c})} className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted"><Save className="w-3.5 h-3.5" /></button>
              <button onClick={() => remove(c.id)} disabled={deleting===c.id} className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-50"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
      {clients.length===0 && <p className="text-center py-12 text-muted-foreground">No clients yet.</p>}
    </div>
  )
}
