'use client'
export const dynamic = 'force-dynamic'


import { motion } from 'motion/react'
import { Download, FileText, Eye } from 'lucide-react'

export function ResumeSection({ cvUrl }: { cvUrl?: string | null }) {
  const handleDownload = async () => {
    try {
      await fetch('/api/resume/download', { method: 'POST' })
    } catch {
      // analytics failure is non-critical
    }
    if (cvUrl) {
      window.open(cvUrl, '_blank')
    }
  }

  return (
    <section id="resume" className="py-24 bg-muted/20" aria-label="Resume Download">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-primary" />
          </div>

          <span className="text-primary text-sm font-medium tracking-widest uppercase">Resume</span>
          <h2 className="text-4xl font-display font-bold text-foreground mt-2 mb-4">
            Download My CV
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Get a comprehensive overview of my qualifications, experience, and skills in a clean, professional format.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {cvUrl ? (
              <>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-medium text-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-100"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-border bg-card text-foreground font-medium text-lg hover:border-primary/50 hover:bg-card/80 transition-all hover:scale-105 active:scale-100"
                >
                  <Eye className="w-5 h-5" />
                  View Online
                </a>
              </>
            ) : (
              <a
                href="mailto:mwangig25@gmail.com?subject=CV%20Request&body=Hi%20George%2C%20I%20would%20like%20to%20request%20a%20copy%20of%20your%20CV."
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-medium text-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-100"
              >
                <Download className="w-5 h-5" />
                Request CV via Email
              </a>
            )}
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            Last updated: 2026 · PDF format · Optimized for ATS
          </p>
        </motion.div>
      </div>
    </section>
  )
}
