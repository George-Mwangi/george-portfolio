'use client'
export const dynamic = 'force-dynamic'

import { useState, useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Skill { id: string; name: string; category: string; proficiency: number }

const CATEGORY_LABELS: Record<string, string> = {
  CORE: 'Core Skills', TECHNICAL: 'Technical', SOFT: 'Soft Skills', LANGUAGE: 'Languages',
}
const CATEGORY_ACCENT: Record<string, { pill: string; bar: string }> = {
  CORE:      { pill: 'bg-primary/10 text-primary border-primary/20',             bar: 'from-primary to-teal-300' },
  TECHNICAL: { pill: 'bg-blue-500/10 text-blue-400 border-blue-500/20',          bar: 'from-blue-500 to-blue-300' },
  SOFT:      { pill: 'bg-purple-500/10 text-purple-400 border-purple-500/20',    bar: 'from-purple-500 to-purple-300' },
  LANGUAGE:  { pill: 'bg-amber-500/10 text-amber-400 border-amber-500/20',       bar: 'from-amber-500 to-amber-300' },
}

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const accent = CATEGORY_ACCENT[skill.category] || CATEGORY_ACCENT.CORE

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="glass-card rounded-2xl p-5 border border-border/50 hover:border-primary/30 hover:scale-[1.02] transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-foreground text-sm leading-snug pr-2">{skill.name}</h3>
        <span className="text-xs font-mono font-semibold text-primary shrink-0">{skill.proficiency}%</span>
      </div>

      <div className="skill-bar mb-3">
        <motion.div
          className={cn('skill-bar-fill bg-gradient-to-r', accent.bar)}
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.proficiency}%` } : { width: 0 }}
          transition={{ duration: 1.1, delay: 0.3 + index * 0.04, ease: 'easeOut' }}
        />
      </div>

      <span className={cn('inline-block text-xs px-2.5 py-0.5 rounded-full border font-medium', accent.pill)}>
        {CATEGORY_LABELS[skill.category] || skill.category}
      </span>
    </motion.div>
  )
}

export function SkillsSection({ skills }: { skills: Skill[] }) {
  const [search, setSearch] = useState('')
  const [active, setActive] = useState<string | null>(null)
  const categories = Array.from(new Set(skills.map((s) => s.category)))

  const filtered = skills.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) &&
    (active ? s.category === active : true)
  )

  return (
    <section id="skills" className="py-24 relative" aria-label="Skills">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-primary text-xs font-semibold tracking-widest uppercase">Capabilities</span>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-foreground mt-2 mb-4">
            Skills & Expertise
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A comprehensive skillset built across Web Development, Cyber Security and System Administration.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-3 mb-10"
        >
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text" placeholder="Search skills…"
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none text-sm transition-all"
              suppressHydrationWarning
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setActive(null)}
              className={cn('px-4 py-2 rounded-xl text-sm font-medium border transition-all',
                !active ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground')}>
              All
            </button>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActive(cat === active ? null : cat)}
                className={cn('px-4 py-2 rounded-xl text-sm font-medium border transition-all',
                  active === cat ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground')}>
                {CATEGORY_LABELS[cat] || cat}
              </button>
            ))}
          </div>
        </motion.div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((s, i) => <SkillCard key={s.id} skill={s} index={i} />)}
          </div>
        ) : (
          <p className="text-center py-16 text-muted-foreground">No skills match your search.</p>
        )}
      </div>
    </section>
  )
}
