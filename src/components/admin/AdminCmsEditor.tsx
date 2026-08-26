'use client'

import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, Copy, Pencil, Plus, Power, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { AdminModal } from './AdminModal'

export type CmsField = {
  name: string
  label: string
  type?: 'text' | 'textarea' | 'url' | 'email' | 'number' | 'date' | 'checkbox' | 'select' | 'lines'
  required?: boolean
  placeholder?: string
  options?: { label: string; value: string }[]
  wide?: boolean
}

type Props = {
  title: string
  description: string
  resource: string
  items: any[]
  fields: CmsField[]
  displayField: string
  secondaryField?: string
  statusField?: string
  orderField?: string
  createLabel?: string
}

const inputClass = 'w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/60'

export function AdminCmsEditor({ title, description, resource, items: initialItems, fields, displayField, secondaryField, statusField, orderField = 'order', createLabel }: Props) {
  const [items, setItems] = useState(initialItems)
  const [editing, setEditing] = useState<any | null>(null)
  const [form, setForm] = useState<Record<string, any>>({})
  const [saving, setSaving] = useState(false)
  const singularTitle = title.endsWith('Categories') ? title.replace(/Categories$/, 'Category') : title.replace(/s$/, '')

  const sorted = useMemo(() => [...items].sort((a, b) => (a[orderField] ?? 0) - (b[orderField] ?? 0)), [items, orderField])

  const open = (item?: any) => {
    setEditing(item || {})
    setForm(Object.fromEntries(fields.map((field) => {
      const value = item?.[field.name]
      const formatted = field.type === 'lines' && Array.isArray(value)
        ? value.join('\n')
        : field.type === 'date' && value
          ? new Date(value).toISOString().slice(0, 10)
          : value
      return [field.name, formatted ?? (field.type === 'checkbox' ? false : '')]
    })))
  }

  const request = async (payload: Record<string, unknown>) => {
    const response = await fetch('/api/admin/cms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resource, ...payload }) })
    const result = await response.json()
    if (!response.ok) throw new Error(result.message || 'Request failed')
    return result
  }

  const save = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    try {
      const action = editing?.id ? 'update' : 'create'
      const saved = await request({ action, id: editing?.id, data: form })
      setItems((current) => action === 'create' ? [...current, saved] : current.map((item) => item.id === saved.id ? saved : item))
      setEditing(null)
      toast.success(`${singularTitle} saved`)
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to save') }
    finally { setSaving(false) }
  }

  const remove = async (item: any) => {
    if (!confirm(`Delete “${item[displayField]}”? This cannot be undone.`)) return
    try { await request({ action: 'delete', id: item.id }); setItems((current) => current.filter((entry) => entry.id !== item.id)); toast.success('Deleted') }
    catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to delete') }
  }

  const toggle = async (item: any) => {
    try { const saved = await request({ action: 'toggle', id: item.id }); setItems((current) => current.map((entry) => entry.id === saved.id ? saved : entry)) }
    catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to update status') }
  }

  const duplicate = async (item: any) => {
    try {
      const data = Object.fromEntries(fields.map((field) => [field.name, field.type === 'lines' && Array.isArray(item[field.name]) ? item[field.name].join('\n') : item[field.name]]))
      data[displayField] = `${data[displayField]} (Copy)`
      const saved = await request({ action: 'duplicate', data })
      setItems((current) => [...current, saved]); toast.success('Duplicated')
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to duplicate') }
  }

  const move = async (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= sorted.length) return
    const next = [...sorted]
    ;[next[index], next[nextIndex]] = [next[nextIndex], next[index]]
    setItems(next.map((item, position) => ({ ...item, [orderField]: position })))
    try { await request({ action: 'reorder', ids: next.map((item) => item.id) }) }
    catch { toast.error('Unable to save order'); setItems(initialItems) }
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div><h2 className="font-display text-2xl font-bold text-foreground">{title}</h2><p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p></div>
        <button onClick={() => open()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"><Plus className="h-4 w-4" />{createLabel || `Add ${singularTitle}`}</button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {sorted.length === 0 ? <div className="p-10 text-center text-sm text-muted-foreground">No content yet. Use the add button to create the first item.</div> :
          <div className="divide-y divide-border">{sorted.map((item, index) => (
            <div key={item.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1"><p className="truncate font-medium text-foreground">{item[displayField]}</p>{secondaryField && item[secondaryField] && <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{item[secondaryField]}</p>}</div>
              {statusField && <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium ${item[statusField] ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>{item[statusField] ? 'Active' : 'Inactive'}</span>}
              <div className="flex flex-wrap items-center gap-1">
                <button title="Move up" onClick={() => move(index, -1)} disabled={index === 0} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
                <button title="Move down" onClick={() => move(index, 1)} disabled={index === sorted.length - 1} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
                {statusField && <button title="Activate/deactivate" onClick={() => toggle(item)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"><Power className="h-4 w-4" /></button>}
                <button title="Duplicate" onClick={() => duplicate(item)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"><Copy className="h-4 w-4" /></button>
                <button title="Edit" onClick={() => open(item)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"><Pencil className="h-4 w-4" /></button>
                <button title="Delete" onClick={() => remove(item)} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}</div>}
      </div>

      <AdminModal open={editing !== null} onClose={() => setEditing(null)} title={`${editing?.id ? 'Edit' : 'Add'} ${singularTitle}`}>
        <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => <label key={field.name} className={field.wide || field.type === 'textarea' || field.type === 'lines' ? 'sm:col-span-2' : ''}>
            {field.type === 'checkbox' ? <span className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm"><input type="checkbox" checked={Boolean(form[field.name])} onChange={(event) => setForm({ ...form, [field.name]: event.target.checked })} />{field.label}</span> : <>
              <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">{field.label}{field.required ? ' *' : ''}</span>
              {field.type === 'textarea' || field.type === 'lines' ? <textarea rows={field.type === 'lines' ? 4 : 5} className={inputClass} required={field.required} placeholder={field.type === 'lines' ? 'One item per line' : field.placeholder} value={form[field.name] ?? ''} onChange={(event) => setForm({ ...form, [field.name]: event.target.value })} /> : field.type === 'select' ? <select className={inputClass} value={form[field.name] ?? ''} onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}><option value="">Select…</option>{field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select> : <input className={inputClass} type={field.type || 'text'} required={field.required} placeholder={field.placeholder} value={form[field.name] ?? ''} onChange={(event) => setForm({ ...form, [field.name]: event.target.value })} />}
            </>}
          </label>)}
          <div className="flex justify-end gap-2 border-t border-border pt-4 sm:col-span-2"><button type="button" onClick={() => setEditing(null)} className="rounded-xl border border-border px-4 py-2 text-sm">Cancel</button><button disabled={saving} className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">{saving ? 'Saving…' : 'Save'}</button></div>
        </form>
      </AdminModal>
    </section>
  )
}
