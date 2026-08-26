'use client'

import { motion } from 'motion/react'
import { Download, Eye, FileText } from 'lucide-react'

export function ResumeSection({cvUrl}:{cvUrl?:string|null}) {
  const download=async()=>{try{await fetch('/api/resume/download',{method:'POST'})}catch{} if(cvUrl)window.open(cvUrl,'_blank')}
  return <section id="resume" className="bg-muted/20 py-24" aria-label="Resume Download"><div className="section-container"><motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="mx-auto max-w-2xl text-center"><div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-primary/10"><FileText className="h-8 w-8 text-primary"/></div><span className="text-sm font-medium uppercase tracking-widest text-primary">Resume</span><h2 className="mt-2 font-display text-4xl font-bold">Download My CV</h2><p className="mb-8 mt-4 text-lg text-muted-foreground">View the active resume selected in the portfolio CMS.</p>{cvUrl?<div className="flex flex-col justify-center gap-4 sm:flex-row"><button onClick={download} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-medium text-primary-foreground"><Download className="h-5 w-5"/>Download PDF</button><a href={cvUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-8 py-4 text-lg font-medium"><Eye className="h-5 w-5"/>View online</a></div>:<p className="text-sm text-muted-foreground">A CV is not currently available for download.</p>}</motion.div></div></section>
}
