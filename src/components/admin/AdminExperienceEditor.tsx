'use client'

import { Briefcase, Calendar, Plus, Save, Trash2, X, Edit3 } from 'lucide-react'
import { useAdminForm } from '@/hooks/useAdminForm'
import { formatDateRange } from '@/lib/utils'

const EMPTY = {
  company: '',
  role: '',
  location: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  description: '',
  achievements: '',
  order: 0,
  isPublished: true,
}

export function AdminExperienceEditor({ experiences }: { experiences: any[] }) {
  const {
    items,
    form,
    setForm,
    openNew,
    openEdit,
    closeForm,
    save,
    remove,
    saving,
    deleting,
  } = useAdminForm({
    initialItems: experiences,
    apiBase: '/api/admin/experience',
    dateFields: ['startDate', 'endDate'],
    emptyForm: EMPTY,

    validate: (f) =>
      !f.company?.trim()
        ? 'Company is required'
        : !f.role?.trim()
        ? 'Role is required'
        : !f.startDate
        ? 'Start date is required'
        : null,

    transform: (f: any) => ({
      ...f,
      endDate: f.isCurrent ? null : f.endDate || null,
      achievements:
        typeof f.achievements === 'string'
          ? f.achievements
              .split('\n')
              .map((a: string) => a.trim())
              .filter(Boolean)
          : f.achievements ?? [],
    }),
  })

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-foreground">
          Work Experience
        </h2>

        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>

      {form && (
        <div className="glass-card rounded-2xl p-5 border border-primary/20 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">
              {(form as any).id ? 'Edit' : 'New'} Experience
            </h3>

            <button onClick={closeForm}>
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Company *
              </label>
              <input
                value={(form as any).company || ''}
                onChange={(e) =>
                  setForm({ ...form, company: e.target.value } as any)
                }
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Role *
              </label>
              <input
                value={(form as any).role || ''}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value } as any)
                }
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Location
              </label>
              <input
                value={(form as any).location || ''}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value } as any)
                }
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Display Order
              </label>
              <input
                type="number"
                value={(form as any).order ?? 0}
                onChange={(e) =>
                  setForm({
                    ...form,
                    order: Number(e.target.value),
                  } as any)
                }
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Start Date *
              </label>

              <input
                type="date"
                value={(form as any).startDate || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    startDate: e.target.value,
                  } as any)
                }
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                End Date
              </label>

              <input
                type="date"
                value={(form as any).endDate || ''}
                disabled={(form as any).isCurrent}
                onChange={(e) =>
                  setForm({
                    ...form,
                    endDate: e.target.value,
                  } as any)
                }
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm disabled:opacity-40"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={(form as any).isCurrent || false}
              onChange={(e) =>
                setForm({
                  ...form,
                  isCurrent: e.target.checked,
                  endDate: '',
                } as any)
              }
            />
            I currently work here
          </label>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Description
            </label>

            <textarea
              rows={4}
              value={(form as any).description || ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                } as any)
              }
              className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Achievements
            </label>

            <textarea
              rows={5}
              placeholder="One achievement per line"
              value={(form as any).achievements || ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  achievements: e.target.value,
                } as any)
              }
              className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm resize-none"
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={(form as any).isPublished ?? true}
              onChange={(e) =>
                setForm({
                  ...form,
                  isPublished: e.target.checked,
                } as any)
              }
            />
            Published
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

      <div className="space-y-3">
        {items.map((exp) => (
          <div
            key={exp.id}
            className="glass-card rounded-2xl p-5 border border-border/50 flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">
                {exp.role}
              </p>

              <p className="text-primary text-sm">
                {exp.company}
              </p>

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
                onClick={() => openEdit(exp)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <Edit3 className="w-3.5 h-3.5" />
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

        {items.length === 0 && (
          <p className="text-center py-12 text-muted-foreground">
            No work experience entries yet.
          </p>
        )}
      </div>
    </div>
  )
}