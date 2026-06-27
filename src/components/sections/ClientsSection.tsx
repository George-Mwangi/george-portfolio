'use client'
export const dynamic = 'force-dynamic'


import { motion } from 'motion/react'
import { Building2, Globe, ExternalLink } from 'lucide-react'

interface Client {
  id: string
  name: string
  industry?: string | null
  logoUrl?: string | null
  websiteUrl?: string | null
  description?: string | null
}

export function ClientsSection({ clients }: { clients: Client[] }) {
  if (clients.length === 0) return null
  return (
    <section id="clients" className="py-24 bg-muted/20" aria-label="Clients">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="text-primary text-xs font-semibold tracking-widest uppercase">Trusted By</span>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-foreground mt-2 mb-4">Clients & Partners</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Organisations I have worked with and delivered value for.</p>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {clients.map((client, i) => (
            <motion.div key={client.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="glass-card rounded-2xl p-5 border border-border/50 hover:border-primary/30 transition-all flex flex-col items-center text-center gap-3 group">
              {client.logoUrl ? (
                <img src={client.logoUrl} alt={client.name} className="h-12 w-auto object-contain" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
              )}
              <div>
                <p className="font-semibold text-foreground text-sm">{client.name}</p>
                {client.industry && <p className="text-xs text-muted-foreground mt-0.5">{client.industry}</p>}
              </div>
              {client.websiteUrl && (
                <a href={client.websiteUrl} target="_blank" rel="noopener noreferrer"
                  className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 text-xs text-primary">
                  <Globe className="w-3 h-3" /> Visit
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
