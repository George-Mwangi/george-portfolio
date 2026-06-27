'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Users, Briefcase, KanbanSquare, MessageSquare, BarChart3 } from 'lucide-react'
import { cn, TOOL_CATEGORY_LABELS } from '@/lib/utils'

interface Tool {
  id: string
  name: string
  category: string
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  CRM_SUPPORT: Users,
  PRODUCTIVITY: Briefcase,
  PROJECT_MANAGEMENT: KanbanSquare,
  COMMUNICATION: MessageSquare,
  ERP_ACCOUNTING: BarChart3,
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  CRM_SUPPORT: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  PRODUCTIVITY: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20' },
  PROJECT_MANAGEMENT: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  COMMUNICATION: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  ERP_ACCOUNTING: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
}

export function ToolsSection({ tools }: { tools: Tool[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = Array.from(new Set(tools.map((t) => t.category)))
  const filteredTools = activeCategory ? tools.filter((t) => t.category === activeCategory) : tools

  const grouped = categories.reduce<Record<string, Tool[]>>((acc, cat) => {
    acc[cat] = filteredTools.filter((t) => t.category === cat)
    return acc
  }, {})

  return (
    <section id="tools" className="py-24 bg-muted/20" aria-label="Tools and Technologies">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium tracking-widest uppercase">Stack</span>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-foreground mt-2 mb-4">
            Tools & Technologies
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Proficient across enterprise platforms, productivity suites, and communication tools.
          </p>
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium border transition-all',
              !activeCategory
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
            )}
          >
            All Tools
          </button>
          {categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat]
            const colors = CATEGORY_COLORS[cat]
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all',
                  activeCategory === cat
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                )}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {TOOL_CATEGORY_LABELS[cat] || cat}
              </button>
            )
          })}
        </motion.div>

        {/* Tools by category */}
        <div className="space-y-8">
          {categories
            .filter((cat) => !activeCategory || cat === activeCategory)
            .map((cat) => {
              const catTools = grouped[cat]
              if (!catTools || catTools.length === 0) return null
              const Icon = CATEGORY_ICONS[cat]
              const colors = CATEGORY_COLORS[cat] || { bg: 'bg-muted', text: 'text-foreground', border: 'border-border' }

              return (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-2.5 mb-4">
                    {Icon && (
                      <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', colors.bg)}>
                        <Icon className={cn('w-4 h-4', colors.text)} />
                      </div>
                    )}
                    <h3 className="font-semibold text-foreground">
                      {TOOL_CATEGORY_LABELS[cat] || cat}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {catTools.map((tool, i) => (
                      <motion.span
                        key={tool.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className={cn(
                          'inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium border',
                          colors.bg,
                          colors.text,
                          colors.border,
                          'hover:scale-105 transition-transform cursor-default'
                        )}
                      >
                        {tool.name}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )
            })}
        </div>
      </div>
    </section>
  )
}
