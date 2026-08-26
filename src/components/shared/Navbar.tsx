'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useScroll, useMotionValueEvent } from 'motion/react'
import { Menu, X, Moon, Sun, Download, ChevronDown } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import type { SiteSectionSetting } from '@/lib/siteSections'

export function Navbar({ profileName, logoUrl, sections, items = [] }: { profileName: string; logoUrl?: string | null; sections?: SiteSectionSetting[]; items?: { id: string; label: string; url: string; newTab: boolean }[] }) {
  const [isOpen,   setIsOpen]   = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted,  setMounted]  = useState(false)
  const [managedItems, setManagedItems] = useState(items)
  const { theme, setTheme } = useTheme()
  const { scrollY } = useScroll()
  const pathname = usePathname()
  const managedLinks = managedItems.map((item) => ({ href: item.url, label: item.label, exact: item.url === '/', newTab: item.newTab }))
  const navLinks: { href: string; label: string; exact?: boolean; newTab?: boolean }[] = managedLinks

  useEffect(() => { setMounted(true); if (!items.length) fetch('/api/site-chrome').then((response)=>response.json()).then((data)=>setManagedItems(data.navigation || [])).catch(()=>{}) }, [items.length])
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 20))

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/')

  const initials = profileName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-background/85 backdrop-blur-xl border-b border-border/60 shadow-lg shadow-black/10' : 'bg-transparent'
      )}
    >
      <nav className="section-container h-16 flex items-center justify-between gap-4" aria-label="Main navigation">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-display font-bold text-foreground hover:text-primary transition-colors shrink-0">
          {logoUrl ? (
            <img src={logoUrl} alt={`${profileName} logo`} className="h-11 w-auto max-w-[190px] rounded-md object-contain" />
          ) : (
            <>
              <span className="w-8 h-8 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">{initials}</span>
              <span className="hidden sm:inline text-sm font-semibold">{profileName}</span>
            </>
          )}
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-0.5 list-none m-0 p-0">
          {navLinks.map(({ href, label, exact, newTab }) => (
            <li key={href}>
              <Link href={href} target={newTab ? '_blank' : undefined} rel={newTab ? 'noopener noreferrer' : undefined}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  isActive(href, exact)
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                )}>
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          {mounted && (
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
              aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
          <button onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
            aria-label={isOpen ? 'Close menu' : 'Open menu'} aria-expanded={isOpen}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          className="lg:hidden bg-background/95 backdrop-blur-xl border-b border-border">
          <ul className="px-4 py-4 flex flex-col gap-1 list-none m-0 p-0 pb-4 px-4">
            {navLinks.map(({ href, label, exact, newTab }) => (
              <li key={href}>
                <Link href={href} target={newTab ? '_blank' : undefined} rel={newTab ? 'noopener noreferrer' : undefined} onClick={() => setIsOpen(false)}
                  className={cn('block px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                    isActive(href, exact) ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted/60')}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.header>
  )
}
