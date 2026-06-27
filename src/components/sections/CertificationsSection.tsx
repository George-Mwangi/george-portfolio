'use client'
export const dynamic = 'force-dynamic'


import { motion } from 'motion/react'
import { BadgeCheck, ExternalLink, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Certification {
  id: string
  name: string
  issuer: string
  issueDate?: Date | null
  expiryDate?: Date | null
  credentialId?: string | null
  credentialUrl?: string | null
}

export function CertificationsSection({ certifications }: { certifications: Certification[] }) {
  return (
    <section id="certifications" className="py-24" aria-label="Certifications">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium tracking-widest uppercase">Credentials</span>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-foreground mt-2 mb-4">
            Certifications
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-6">
          {certifications.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <BadgeCheck className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground leading-snug">{cert.name}</h3>
                  <p className="text-primary text-sm font-medium mt-1">{cert.issuer}</p>

                  {cert.issueDate && (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground mt-2">
                      <Calendar className="w-3 h-3" />
                      Issued {formatDate(new Date(cert.issueDate), { year: 'numeric', month: 'long' })}
                    </span>
                  )}

                  {cert.credentialId && (
                    <p className="text-xs text-muted-foreground mt-1">
                      ID: <span className="font-mono">{cert.credentialId}</span>
                    </p>
                  )}

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Verify credential
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
