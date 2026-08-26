'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import type { CmsField } from './AdminCmsEditor'

const inputClass = 'w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/60'

export function AdminSingletonEditor({ title, description, resource, value, fields }: { title: string; description: string; resource: string; value: any; fields: CmsField[] }) {
  const initial = Object.fromEntries(fields.map((field) => {
    const current = value?.[field.name]
    return [field.name, field.type === 'lines' && Array.isArray(current) ? current.join('\n') : current ?? (field.type === 'checkbox' ? false : '')]
  }))
  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)

  const save = async (event: React.FormEvent) => {
    event.preventDefault(); setSaving(true)
    try {
      const response = await fetch('/api/admin/cms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resource, action: 'saveSingleton', data: form }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Unable to save')
      toast.success(`${title} saved`)
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to save') }
    finally { setSaving(false) }
  }

  return <section className="space-y-5"><div><h2 className="font-display text-2xl font-bold text-foreground">{title}</h2><p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p></div>
    <form onSubmit={save} className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2">
      {fields.map((field) => <label key={field.name} className={field.wide || field.type === 'textarea' || field.type === 'lines' ? 'sm:col-span-2' : ''}>
        {field.type === 'checkbox' ? <span className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm"><input type="checkbox" checked={Boolean(form[field.name])} onChange={(event) => setForm({ ...form, [field.name]: event.target.checked })} />{field.label}</span> : <><span className="mb-1.5 block text-xs font-semibold text-muted-foreground">{field.label}{field.required ? ' *' : ''}</span>{field.type === 'textarea' || field.type === 'lines' ? <textarea rows={field.type === 'lines' ? 4 : 6} className={inputClass} required={field.required} placeholder={field.type === 'lines' ? 'One item per line' : field.placeholder} value={form[field.name] ?? ''} onChange={(event) => setForm({ ...form, [field.name]: event.target.value })} /> : <input className={inputClass} type={field.type || 'text'} required={field.required} placeholder={field.placeholder} value={form[field.name] ?? ''} onChange={(event) => setForm({ ...form, [field.name]: event.target.value })} />}</>}
      </label>)}
      <div className="flex justify-end border-t border-border pt-4 sm:col-span-2"><button disabled={saving} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50">{saving ? 'Saving…' : 'Save changes'}</button></div>
    </form>
  </section>
}
