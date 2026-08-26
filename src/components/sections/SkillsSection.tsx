'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Search, Code2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SkillsSection({ skills }: { skills: any[] }) {
  const [search,setSearch]=useState(''); const [active,setActive]=useState('All')
  const groupName=(skill:any)=>skill.skillGroup?.name || skill.category?.replaceAll('_',' ') || 'Skills'
  const categories=['All',...Array.from(new Set(skills.map(groupName)))]
  const filtered=skills.filter((skill)=>skill.name.toLowerCase().includes(search.toLowerCase())&&(active==='All'||groupName(skill)===active))
  return <section id="skills" className="py-24" aria-label="Skills"><div className="section-container"><div className="mb-12 text-center"><span className="text-xs font-semibold uppercase tracking-widest text-primary">Evidence-based expertise</span><h2 className="mt-2 font-display text-4xl font-bold lg:text-5xl">Skills & Technologies</h2><p className="mx-auto mt-3 max-w-2xl text-muted-foreground">Capabilities are grouped by discipline and connected to practical experience and project evidence.</p></div><div className="mb-8 flex flex-col gap-3 sm:flex-row"><label className="relative max-w-sm flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search skills…" className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary"/></label><div className="flex flex-wrap gap-2">{categories.map(category=><button key={category} onClick={()=>setActive(category)} className={cn('rounded-xl border px-3 py-2 text-sm',active===category?'border-primary bg-primary text-primary-foreground':'border-border bg-card text-muted-foreground')}>{category}</button>)}</div></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filtered.map((skill,index)=><motion.article key={skill.id} initial={{opacity:0,y:15}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:index*.03}} className="glass-card rounded-2xl border border-border/50 p-5"><div className="mb-4 flex items-center gap-3">{skill.iconUrl?<img src={skill.iconUrl} alt="" className="h-9 w-9 object-contain"/>:<span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10"><Code2 className="h-4 w-4 text-primary"/></span>}<div><h3 className="font-semibold">{skill.name}</h3><p className="text-xs text-primary">{groupName(skill)}</p></div></div>{skill.evidence&&<p className="text-sm leading-relaxed text-muted-foreground">{skill.evidence}</p>}</motion.article>)}</div></div></section>
}
