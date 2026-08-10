export const SITE_SECTION_DEFINITIONS = [
  { id: 'hero', label: 'Hero', description: 'Professional introduction and primary calls to action.' },
  { id: 'about', label: 'About', description: 'Personal and professional overview.' },
  { id: 'skills', label: 'Skills', description: 'Core expertise and capabilities.' },
  { id: 'projects', label: 'Projects', description: 'Selected work and project evidence.' },
  { id: 'clients', label: 'Clients', description: 'Organisations and clients served.' },
  { id: 'testimonials', label: 'Testimonials', description: 'Published recommendations and social proof.' },
  { id: 'experience', label: 'Experience', description: 'Professional work history.' },
  { id: 'education', label: 'Education', description: 'Academic background.' },
  { id: 'certifications', label: 'Certifications', description: 'Professional qualifications and credentials.' },
  { id: 'tools', label: 'Tools', description: 'Technologies and tools used.' },
  { id: 'resume', label: 'Resume / CV', description: 'Resume viewing and download.' },
  { id: 'contact', label: 'Contact / Hire', description: 'Contact details and enquiry form.' },
] as const

export type SiteSectionId = (typeof SITE_SECTION_DEFINITIONS)[number]['id']

export interface SiteSectionSetting {
  id: SiteSectionId
  enabled: boolean
  order: number
}

export const SITE_SECTIONS_SETTING_KEY = 'website_sections'

export const DEFAULT_SITE_SECTIONS: SiteSectionSetting[] = SITE_SECTION_DEFINITIONS.map((section, order) => ({
  id: section.id,
  enabled: true,
  order,
}))

export function parseSiteSections(value?: string | null): SiteSectionSetting[] {
  if (!value) return DEFAULT_SITE_SECTIONS.map((section) => ({ ...section }))

  try {
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) throw new Error('Section setting must be an array')

    const configured = new Map<string, { enabled?: unknown; order?: unknown }>()
    for (const item of parsed) {
      if (item && typeof item === 'object' && typeof item.id === 'string') configured.set(item.id, item)
    }

    return DEFAULT_SITE_SECTIONS.map((section) => {
      const saved = configured.get(section.id)
      return {
        id: section.id,
        enabled: typeof saved?.enabled === 'boolean' ? saved.enabled : section.enabled,
        order: typeof saved?.order === 'number' && Number.isFinite(saved.order) ? saved.order : section.order,
      }
    }).sort((a, b) => a.order - b.order)
      .map((section, order) => ({ ...section, order }))
  } catch {
    return DEFAULT_SITE_SECTIONS.map((section) => ({ ...section }))
  }
}

export function isSiteSectionEnabled(sections: SiteSectionSetting[], id: SiteSectionId) {
  return sections.find((section) => section.id === id)?.enabled ?? true
}
