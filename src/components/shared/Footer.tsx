import Link from 'next/link'
import { Mail, Phone, MapPin, Heart } from 'lucide-react'
import { isSiteSectionEnabled, type SiteSectionSetting } from '@/lib/siteSections'

interface Profile {
  name?: string; email?: string; phone?: string | null
  location?: string | null; linkedinUrl?: string | null
}

const FOOTER_LINKS = [
  { label: 'About', href: '/about', sections: ['about'] },
  { label: 'Skills', href: '/skills', sections: ['skills', 'tools'] },
  { label: 'Experience', href: '/experience', sections: ['experience'] },
  { label: 'Education', href: '/education', sections: ['education', 'certifications'] },
  { label: 'Projects', href: '/projects', sections: ['projects'] },
  { label: 'Contact', href: '/contact', sections: ['contact'] },
]

export function Footer({ profile, sections }: { profile: Profile | null; sections?: SiteSectionSetting[] }) {
  const year = new Date().getFullYear()
  const links = sections
    ? FOOTER_LINKS.filter((link) => link.sections.some((id) => isSiteSectionEnabled(sections, id as SiteSectionSetting['id'])))
      .map((link) => {
        if (link.href === '/skills' && !isSiteSectionEnabled(sections, 'skills')) return { ...link, label: 'Tools' }
        if (link.href === '/education' && !isSiteSectionEnabled(sections, 'education')) return { ...link, label: 'Certifications' }
        return link
      })
    : FOOTER_LINKS
  const contactEnabled = !sections || isSiteSectionEnabled(sections, 'contact')
  return (
    <footer className="border-t border-border bg-card/40 backdrop-blur" aria-label="Footer">
      <div className="section-container py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-8 h-8 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">GM</span>
              <span className="font-display font-bold text-foreground">George Mwangi</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              IT Professional, Cyber Security Specialist &amp;<br />Full Stack Web Developer, Network & Systems Administrator. <br /> Based in Nakuru, Kenya.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground list-none p-0 m-0">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          {contactEnabled && <div>
            <h3 className="font-semibold text-foreground text-sm mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground list-none p-0 m-0">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href={`mailto:${profile?.email || 'mwangig25@gmail.com'}`} className="hover:text-primary transition-colors truncate">
                  {profile?.email || 'mwangig25@gmail.com'}
                </a>
              </li>
              {profile?.phone && (
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <a href={`tel:${profile.phone}`} className="hover:text-primary transition-colors">{profile.phone}</a>
                </li>
              )}
              {profile?.location && (
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span>{profile.location}</span>
                </li>
              )}
            </ul>
          </div>}
        </div>
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {year} George Mwangi. All rights reserved.</p>
<a
  href="https://george-portfolio-alpha.vercel.app/"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-1.5 hover:text-primary transition-colors"
>
  Built with{" "}
  <Heart className="w-3 h-3 text-primary fill-primary" />{" "}
  in Kenya by George
</a>          <Link href="/admin/login" className="opacity-40 hover:opacity-100 hover:text-primary transition-all">Admin</Link>
        </div>
      </div>
    </footer>
  )
}
//
