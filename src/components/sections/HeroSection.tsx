'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Download, Mail, ArrowRight, MapPin, Phone, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface Profile {
  name: string
  title: string[]
  summary: string
  email: string
  phone?: string | null
  location?: string | null
  profileImageUrl?: string | null
  cvUrl?: string | null
}

export function HeroSection({ profile }: { profile: Profile | null }) {
  const [titleIndex, setTitleIndex] = useState(0)

  const titles = profile?.title?.length
    ? profile.title
    : ['Procurement Officer', 'Sales Executive', 'Customer Service Professional', 'Logistics Specialist']

  useEffect(() => {
    const id = setInterval(() => setTitleIndex((i) => (i + 1) % titles.length), 3000)
    return () => clearInterval(id)
  }, [titles.length])

  const name = profile?.name || 'Joan Mwangi'

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      aria-label="Hero"
    >
      {/* Grid background */}
      <div className="absolute inset-0 hero-grid" aria-hidden="true" />

      {/* Radial glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 0%, hsl(162 69% 37% / 0.18) 0%, transparent 70%)',
        }}
      />

      <div className="section-container relative z-10 py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">

          {/* ── Left: Text ── */}
          <div className="text-center lg:text-left">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/8 text-primary text-sm font-medium mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse-slow" />
              Available for new opportunities
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-foreground leading-none mb-4"
            >
              {name}
            </motion.h1>

            {/* Animated title */}
            <div className="h-12 flex items-center justify-center lg:justify-start mb-6" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.span
                  key={titleIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="text-xl sm:text-2xl lg:text-3xl font-sans font-semibold gradient-text"
                >
                  {titles[titleIndex]}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Meta chips */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8"
            >
              {profile?.location && (
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  {profile.location}
                </span>
              )}
              {profile?.email && (
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary shrink-0" />
                  {profile.email}
                </span>
              )}
              {profile?.phone && (
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  {profile.phone}
                </span>
              )}
            </motion.div>

            {/* Summary */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0"
            >
              Certified Procurement &amp; Supply Professional (CPSP‑K) specialising in procurement
              planning, supplier management, and logistics coordination across Kenya.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-3 justify-center lg:justify-start"
            >
              {profile?.cvUrl ? (
                <a
                  href={profile.cvUrl}
                  download
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all hover:scale-105 active:scale-100 shadow-lg shadow-primary/20"
                >
                  <Download className="w-4 h-4" />
                  Download CV
                </a>
              ) : (
                <Link
                  href="#resume"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all hover:scale-105 active:scale-100 shadow-lg shadow-primary/20"
                >
                  <Download className="w-4 h-4" />
                  Download CV
                </Link>
              )}

              <Link
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card/60 backdrop-blur text-foreground font-medium hover:border-primary/40 hover:bg-card transition-all hover:scale-105 active:scale-100"
              >
                <Mail className="w-4 h-4" />
                Contact Me
              </Link>

              <Link
                href="#experience"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-primary/25 bg-primary/8 text-primary font-medium hover:bg-primary/15 transition-all hover:scale-105 active:scale-100"
              >
                Hire Me
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          {/* ── Right: Visual ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Spinning ring */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full animate-[spin_12s_linear_infinite]"
                style={{
                  background: 'conic-gradient(from 0deg, hsl(162 69% 37% / 0.5), transparent 40%, hsl(162 70% 60% / 0.3), transparent 80%, hsl(162 69% 37% / 0.5))',
                  transform: 'scale(1.12)',
                  borderRadius: '50%',
                }}
              />
              {/* Pulse ring */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full animate-pulse-ring"
                style={{ border: '1px solid hsl(162 69% 37% / 0.3)', transform: 'scale(1.06)' }}
              />

              {/* Avatar */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-2 border-primary/25 glass-card">
                {profile?.profileImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.profileImageUrl}
                    alt={`${name} profile photo`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, hsl(162 69% 37% / 0.15), hsl(162 70% 60% / 0.08))' }}
                  >
                    <Sparkles className="w-12 h-12 text-primary/30 mb-3" />
                    <span className="text-7xl sm:text-8xl font-display font-bold"
                      style={{ color: 'hsl(162 69% 37% / 0.4)' }}>
                      JM
                    </span>
                  </div>
                )}
              </div>

              {/* Float card: experience */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -left-6 top-1/4 glass-card rounded-2xl px-4 py-3 border border-primary/20 shadow-xl"
              >
                <p className="text-2xl font-display font-bold text-primary leading-none">5+</p>
                <p className="text-xs text-muted-foreground mt-0.5">Years Experience</p>
              </motion.div>

              {/* Float card: cert */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -right-4 bottom-1/4 glass-card rounded-2xl px-4 py-3 border border-primary/20 shadow-xl"
              >
                <p className="text-base font-display font-bold text-primary leading-none">CPSP‑K</p>
                <p className="text-xs text-muted-foreground mt-0.5">Certified</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          aria-hidden="true"
        >
          <span className="text-xs text-muted-foreground/60 tracking-wider uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="w-5 h-8 rounded-full border border-border/60 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-primary/60" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
