'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { CheckCircle2, MapPin } from 'lucide-react'

export function AboutSection({ profile, about }: { profile: any; about?: any }) {
  const summary = about?.professionalSummary || profile?.professionalSummary || profile?.summary
  if (!summary && !about?.introduction && !about?.mission) return null
  const points = about?.points?.filter((point: any) => point.isActive) || []
  return <section id="about" className="relative py-24" aria-label="About"><div className="section-container grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start"><motion.div initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} className="glass-card rounded-3xl border border-primary/20 bg-primary/5 p-7"><span className="text-xs font-semibold uppercase tracking-widest text-primary">{about?.subtitle || 'Professional profile'}</span><h2 className="mt-3 font-display text-4xl font-bold">{about?.sectionTitle || 'About Me'}</h2>{profile?.location && <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4 text-primary"/>{profile.location}</p>}{about?.mission && <div className="mt-7 border-l-2 border-primary pl-4"><p className="text-xs font-semibold uppercase tracking-widest text-primary">Mission</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{about.mission}</p></div>}</motion.div><motion.div initial={{opacity:0,x:20}} whileInView={{opacity:1,x:0}} viewport={{once:true}}><div className="space-y-4 text-base leading-relaxed text-muted-foreground">{about?.introduction && <p className="text-lg text-foreground">{about.introduction}</p>}{summary && <p>{summary}</p>}</div>{points.length>0 && <div className="mt-7 grid gap-3 sm:grid-cols-2">{points.map((point:any)=><div key={point.id} className="flex gap-2 text-sm text-muted-foreground"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary"/>{point.text}</div>)}</div>}{about?.ctaText && about?.ctaUrl && <Link href={about.ctaUrl} className="mt-8 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">{about.ctaText}</Link>}</motion.div></div></section>
}
