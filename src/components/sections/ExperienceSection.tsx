'use client'
export const dynamic = 'force-dynamic'


import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { Briefcase, MapPin, Calendar, CheckCircle2 } from 'lucide-react'
import { formatDateRange } from '@/lib/utils'

interface Experience {
  id: string; company: string; role: string; startDate: Date
  endDate?: Date | null; isCurrent: boolean; location?: string | null
  description?: string | null; achievements: string[]
}

function ExpCard({ exp, index }: { exp: Experience; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <div ref={ref} className="relative flex gap-6 pb-12 last:pb-0">
      {/* Timeline column */}
      <div className="flex flex-col items-center shrink-0 w-5" aria-hidden="true">
        <motion.div
          initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.35, delay: 0.15 }}
          className={`w-4 h-4 rounded-full border-2 z-10 mt-5 shrink-0 ${
            exp.isCurrent
              ? 'bg-primary border-primary shadow-[0_0_10px_hsl(162_69%_37%/0.6)]'
              : 'bg-card border-primary/50'
          }`}
        />
        <div className="w-px flex-1 mt-2" style={{ background: 'linear-gradient(to bottom, hsl(var(--primary)/0.25), transparent)' }} />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: -18 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="flex-1 glass-card rounded-2xl p-6 border border-border/50 hover:border-primary/25 transition-all"
      >
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Briefcase className="w-4 h-4 text-primary shrink-0" />
              <h3 className="font-display font-semibold text-foreground text-lg leading-snug">{exp.role}</h3>
            </div>
            <p className="text-primary font-medium text-sm">{exp.company}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            {exp.isCurrent && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-slow" /> Current
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {formatDateRange(new Date(exp.startDate), exp.endDate ? new Date(exp.endDate) : null, exp.isCurrent)}
            </span>
            {exp.location && (
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />{exp.location}
              </span>
            )}
          </div>
        </div>

        {exp.description && (
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">{exp.description}</p>
        )}

        {exp.achievements?.length > 0 && (
          <>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Key Responsibilities
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {exp.achievements.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.25 + i * 0.04 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                  {item}
                </motion.div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}

export function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  return (
    <section id="experience" className="py-24 relative" aria-label="Work Experience">
      <div className="absolute right-0 top-1/3 w-80 h-80 rounded-full pointer-events-none" aria-hidden="true"
        style={{ background: 'radial-gradient(circle, hsl(var(--primary)/0.06), transparent)', filter: 'blur(60px)' }} />
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-primary text-xs font-semibold tracking-widest uppercase">Career</span>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-foreground mt-2 mb-4">Work Experience</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A track record of delivering results in Web Development, Cyber Security and System Administration roles.
          </p>
        </motion.div>
        <div className="max-w-3xl mx-auto">
          {experiences.map((exp, i) => <ExpCard key={exp.id} exp={exp} index={i} />)}
        </div>
      </div>
    </section>
  )
}
