'use client'

import { useState } from 'react'
import { ArrowDown, ArrowUp, Eye, EyeOff, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  SITE_SECTION_DEFINITIONS,
  type SiteSectionSetting,
} from '@/lib/siteSections'

export function AdminSectionsEditor({ initialSections }: { initialSections: SiteSectionSetting[] }) {
  const [sections, setSections] = useState(() => [...initialSections].sort((a, b) => a.order - b.order))
  const [isDirty, setIsDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const update = (next: SiteSectionSetting[]) => {
    setSections(next.map((section, order) => ({ ...section, order })))
    setIsDirty(true)
  }

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= sections.length) return
    const next = [...sections]
    ;[next[index], next[target]] = [next[target], next[index]]
    update(next)
  }

  const save = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/site-sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sections),
      })
      if (!response.ok) throw new Error('Failed to save section settings')
      const saved = await response.json()
      setSections(saved)
      setIsDirty(false)
      toast.success('Website sections updated')
    } catch {
      toast.error('Failed to update website sections')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-display font-bold text-foreground">Website Sections</h2>
          <p className="text-sm text-muted-foreground mt-1">Choose which features are public and arrange their homepage order.</p>
        </div>
        <button type="button" onClick={save} disabled={!isDirty || isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all">
          {isSaving ? <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      <div className="glass-card rounded-2xl border border-border/50 divide-y divide-border/60 overflow-hidden">
        {sections.map((section, index) => {
          const definition = SITE_SECTION_DEFINITIONS.find((item) => item.id === section.id)!
          return (
            <div key={section.id} className="flex items-center gap-3 p-4 sm:p-5">
              <div className="flex flex-col gap-1 shrink-0">
                <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Move ${definition.label} up`}
                  className="p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 disabled:opacity-25 disabled:pointer-events-none">
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => move(index, 1)} disabled={index === sections.length - 1} aria-label={`Move ${definition.label} down`}
                  className="p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 disabled:opacity-25 disabled:pointer-events-none">
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{definition.label}</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{definition.description}</p>
              </div>
              <button type="button" role="switch" aria-checked={section.enabled}
                onClick={() => update(sections.map((item) => item.id === section.id ? { ...item, enabled: !item.enabled } : item))}
                className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${section.enabled ? 'bg-primary' : 'bg-muted'}`}>
                <span className={`absolute left-1 top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${section.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                <span className="sr-only">{section.enabled ? 'Disable' : 'Enable'} {definition.label}</span>
              </button>
              <span className="hidden sm:inline-flex w-20 items-center gap-1.5 text-xs text-muted-foreground">
                {section.enabled ? <><Eye className="w-3.5 h-3.5 text-primary" /> Visible</> : <><EyeOff className="w-3.5 h-3.5" /> Hidden</>}
              </span>
            </div>
          )
        })}
      </div>
      <p className="text-xs text-muted-foreground mt-4">Hidden sections are removed from the homepage, navigation, and their public feature pages.</p>
    </div>
  )
}
