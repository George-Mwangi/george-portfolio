'use client'

import { useState } from 'react'
import { Plus, Trash2, Save, X, Building2, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDateRange } from '@/lib/utils'

const empty = {
  role: '',
  company: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  description: '',
}

export function AdminExperienceEditor({ experiences: init }: { experiences: any[] }) {
  const [experiences, setExperiences] = useState(init)
  const [form, setForm] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const save = async () => {
    if (!form.role?.trim() || !form.company?.trim()) {
      toast.error('Role and company required')
      return
    }

    setSaving(true)

    try {
      const isEdit = !!form.id

      const res = await fetch(
        isEdit
          ? `/api/admin/experience/${form.id}`
          : '/api/admin/experience',
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      )

      if (!res.ok) throw new Error()

      const saved = await res.json()

      setExperiences((prev) =>
        isEdit
          ? prev.map((e) => (e.id === saved.id ? saved : e))
          : [...prev, saved]
      )

      toast.success(isEdit ? 'Updated' : 'Added')
      setForm(null)
    } catch {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this experience entry?')) return

    setDeleting(id)

    try {
      await fetch(`/api/admin/experience/${id}`, {
        method: 'DELETE',
      })

      setExperiences((prev) => prev.filter((e) => e.id !== id))
      toast.success('Deleted')
    } catch {
      toast.error('Failed to delete')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="max-w-3xl">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-foreground">
          Work Experience
        </h2>

        <button
          onClick={() => setForm({ ...empty })}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>

      {/* FORM */}
      {form && (
        <div className="glass-card rounded-2xl p-5 border border-primary/20 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">
              {form.id ? 'Edit' : 'New'} Experience
            </h3>

            <button onClick={() => setForm(null)}>
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {[
              ['role', 'Role *'],
              ['company', 'Company *'],
              ['description', 'Description'],
            ].map(([f, l]) => (
              <div key={f}>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  {l}
                </label>

                <input
                  value={form[f] || ''}
                  onChange={(e) =>
                    setForm({ ...form, [f]: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:border-primary/50 focus:outline-none"
                />
              </div>
            ))}

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Start Date *
              </label>

              <input
                type="date"
                value={form.startDate || ''}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm focus:border-primary/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                End Date
              </label>

              <input
                type="date"
                value={form.endDate || ''}
                disabled={form.isCurrent}
                onChange={(e) =>
                  setForm({ ...form, endDate: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground text-sm disabled:opacity-50"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={form.isCurrent}
              onChange={(e) =>
                setForm({
                  ...form,
                  isCurrent: e.target.checked,
                  endDate: '',
                })
              }
            />
            Currently working here
          </label>

          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      )}

      {/* LIST */}
      <div className="space-y-3">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="glass-card rounded-2xl p-5 border border-border/50 flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-primary" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">{exp.role}</p>
              <p className="text-primary text-sm">{exp.company}</p>

              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Calendar className="w-3 h-3" />
                {formatDateRange(
                  new Date(exp.startDate),
                  exp.endDate ? new Date(exp.endDate) : null,
                  exp.isCurrent
                )}
              </p>
            </div>

            <div className="flex gap-1 shrink-0">
              <button
                onClick={() =>
                  setForm({
                    ...exp,
                    startDate: exp.startDate?.slice(0, 10) || '',
                    endDate: exp.endDate?.slice(0, 10) || '',
                  })
                }
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <Save className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => remove(exp.id)}
                disabled={deleting === exp.id}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {experiences.length === 0 && (
          <p className="text-center py-12 text-muted-foreground">
            No experience entries yet.
          </p>
        )}
      </div>
    </div>
  )
}