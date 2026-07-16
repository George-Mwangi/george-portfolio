'use client'
export const dynamic = 'force-dynamic'

import { motion } from 'motion/react'
import { GraduationCap, Calendar } from 'lucide-react'
import { formatDateRange } from '@/lib/utils'

interface Education {
  id: string
  institution: string
  degree: string
  field?: string | null
  startDate: Date
  endDate?: Date | null
  isCurrent: boolean
  grade?: string | null
  description?: string | null
}

export function EducationSection({ education }: { education: Education[] }) {
  return (
    <section id="education" className="py-24 bg-muted/20" aria-label="Education">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium tracking-widest uppercase">Academic</span>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-foreground mt-2 mb-4">
            Education
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Academic foundations in Computer Science, backed by professional certification.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto grid gap-6">
          {education.map((edu, i) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all flex gap-5"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                  <h3 className="font-display font-semibold text-foreground text-lg">{edu.degree}</h3>
                  <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground flex-shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDateRange(new Date(edu.startDate), edu.endDate ? new Date(edu.endDate) : null, edu.isCurrent)}
                  </span>
                </div>
                <p className="text-primary font-medium text-sm">{edu.institution}</p>
                {edu.field && (
                  <p className="text-muted-foreground text-sm mt-0.5">{edu.field}</p>
                )}
                {edu.grade && (
                  <span className="inline-block mt-2 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                    Grade: {edu.grade}
                  </span>
                )}
                {edu.description && (
                  <p className="text-muted-foreground text-sm mt-3">{edu.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
