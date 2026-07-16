'use client'
export const dynamic = 'force-dynamic'


import { motion } from 'motion/react'
import { Award, Users, TrendingUp, Star, Building2 } from 'lucide-react'

interface Profile { name: string; summary: string; location?: string | null }

const STATS = [
  {
    icon: Award,
    label: 'Cyber Security',
    value: '2021',
  },
  {
    icon: TrendingUp,
    label: 'Years Experience',
    value: '5+',
  },
  {
    icon: Users,
    label: 'Projects Built',
    value: '20+',
  },
  {
    icon: Star,
    label: 'Technologies',
    value: '15+',
  },
]

export function AboutSection({ profile }: { profile: Profile | null }) {
  const summary =
  profile?.summary ||
  "I'm an IT Professional, Cyber Security Specialist, and Full Stack Web Developer with experience designing secure, scalable applications and supporting business technology infrastructure. I enjoy solving complex technical challenges through software development, networking, cloud technologies, automation, and cyber security."

  const sentences = summary.match(/[^.!?]+[.!?]+/g) || [summary]
  const mid = Math.ceil(sentences.length / 2)
  const p1 = sentences.slice(0, mid).join(' ')
  const p2 = sentences.slice(mid).join(' ')

  return (
    <section id="about" className="py-24 relative" aria-label="About">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Stats grid */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-2 gap-4 mb-5">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-card rounded-2xl p-5 border border-border/50 hover:border-primary/30 transition-all text-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <s.icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-2xl font-display font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Current role pill */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="glass-card rounded-2xl p-4 border border-primary/20 bg-primary/5 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4 text-primary" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-primary">
                    Available for Remote & On-site Opportunities
                  </p>

                  <p className="text-xs text-muted-foreground">
                    IT • Cyber Security • Full Stack Development • Network & System Administration
                  </p>
                </div>

                <span className="ml-auto w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
              </motion.div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary text-xs font-semibold tracking-widest uppercase">
              About Me
            </span>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-foreground mt-2 mb-6">
              Building Secure<br />Digital Solutions
            </h2>

            <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
              {p1 && <p>{p1}</p>}
              {p2 && <p>{p2}</p>}
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {[
                'Cyber Security',
                'Penetration Testing',
                'Python',
                'React',
                'Next.js',
                'TypeScript',
                'FastAPI',
                'PostgreSQL',
                'Network Administration',
                'Cloud Computing',
                'Linux',
                'Git',
              ].map((tag) => (
                <span key={tag}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
