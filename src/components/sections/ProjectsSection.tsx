'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { motion } from 'motion/react'
import { ExternalLink, FolderOpen, Star, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Project {
  id: string
  title: string
  description: string
  category?: string | null
  imageUrl?: string | null
  projectUrl?: string | null
  tags: string[]
  client?: string | null
  isFeatured: boolean
}

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))] as string[]
  const [active, setActive] = useState('All')

  const filtered = active === 'All' ? projects : projects.filter((p) => p.category === active)
  const featured = filtered.filter((p) => p.isFeatured)
  const rest = filtered.filter((p) => !p.isFeatured)
  const display = [...featured, ...rest]

  if (projects.length === 0) {
    return (
      <section id="projects" className="py-24" aria-label="Projects">
        <div className="section-container text-center py-16">
          <FolderOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No projects added yet.</p>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-24" aria-label="Projects">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="text-primary text-xs font-semibold tracking-widest uppercase">Portfolio</span>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-foreground mt-2 mb-4">Projects</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Highlighted work and key deliverables across procurement, logistics, and sales projects.</p>
        </motion.div>

        {categories.length > 2 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActive(cat)}
                className={cn('px-4 py-2 rounded-xl text-sm font-medium border transition-all',
                  active === cat ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground')}>
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {display.map((project, i) => (
            <motion.div key={project.id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="glass-card rounded-2xl border border-border/50 hover:border-primary/30 transition-all overflow-hidden group flex flex-col"
            >
              {/* Image or placeholder */}
              <div className="h-44 bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden">
                {project.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FolderOpen className="w-12 h-12 text-primary/20" />
                  </div>
                )}
                {project.isFeatured && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
                    <Star className="w-3 h-3 fill-current" /> Featured
                  </div>
                )}
                {project.category && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur text-xs font-medium text-foreground border border-border/50">
                    {project.category}
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-display font-semibold text-foreground text-lg mb-1 leading-snug">{project.title}</h3>
                {project.client && (
                  <p className="text-primary text-xs font-medium mb-2">Client: {project.client}</p>
                )}
                <p className="text-muted-foreground text-sm leading-relaxed flex-1 line-clamp-3">{project.description}</p>

                {project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/8 text-primary border border-primary/15">
                        <Tag className="w-2.5 h-2.5" />{tag}
                      </span>
                    ))}
                  </div>
                )}

                {project.projectUrl && (
                  <a href={project.projectUrl} target="_blank" rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium">
                    <ExternalLink className="w-3.5 h-3.5" /> View Project
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
