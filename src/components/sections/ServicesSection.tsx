'use client'

import { motion } from 'motion/react'
import { Wrench } from 'lucide-react'

export function ServicesSection({ services }: { services: any[] }) {
  if (!services.length) return null
  return <section id="services" className="py-24" aria-label="Services"><div className="section-container"><div className="mb-12 text-center"><span className="text-xs font-semibold uppercase tracking-widest text-primary">Capabilities</span><h2 className="mt-2 font-display text-4xl font-bold lg:text-5xl">How I can help</h2></div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{services.map((service,index)=><motion.article key={service.id} initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:index*.06}} className="glass-card rounded-2xl border border-border/50 p-6"><div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-primary/10">{service.iconUrl ? <img src={service.iconUrl} alt="" className="h-6 w-6 object-contain"/> : <Wrench className="h-5 w-5 text-primary"/>}</div><h3 className="font-display text-xl font-semibold">{service.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.description}</p></motion.article>)}</div></div></section>
}
