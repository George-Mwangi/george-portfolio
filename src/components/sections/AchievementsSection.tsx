'use client'

import { motion } from 'motion/react'
import { Award } from 'lucide-react'

export function AchievementsSection({ achievements }: { achievements: any[] }) {
  if (!achievements.length) return null
  return <section id="achievements" className="py-20" aria-label="Achievements"><div className="section-container"><div className="mb-10 text-center"><span className="text-xs font-semibold uppercase tracking-widest text-primary">Measured impact</span><h2 className="mt-2 font-display text-4xl font-bold">Results that matter</h2></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{achievements.map((achievement, index) => <motion.article key={achievement.id} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:index*.06}} className="glass-card rounded-2xl border border-border/50 p-5"><Award className="mb-4 h-5 w-5 text-primary"/><p className="font-display text-3xl font-bold text-foreground">{achievement.prefix}{achievement.value || achievement.title}{achievement.suffix}</p><h3 className="mt-2 font-semibold text-foreground">{achievement.label || achievement.title}</h3>{achievement.description && <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{achievement.description}</p>}</motion.article>)}</div></div></section>
}
