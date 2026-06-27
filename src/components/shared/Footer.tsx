import Link from 'next/link'
import { Mail, Phone, MapPin, Heart } from 'lucide-react'

interface Profile {
  name?: string; email?: string; phone?: string | null
  location?: string | null; linkedinUrl?: string | null
}

export function Footer({ profile }: { profile: Profile | null }) {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-border bg-card/40 backdrop-blur" aria-label="Footer">
      <div className="section-container py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-8 h-8 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">JM</span>
              <span className="font-display font-bold text-foreground">Joan Mwangi</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Procurement Officer &amp; Supply Chain Professional.<br />CPSP‑K Certified. Based in Nakuru, Kenya.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground list-none p-0 m-0">
              {['About', 'Skills', 'Experience', 'Education', 'Contact'].map((l) => (
                <li key={l}>
                  <Link href={`#${l.toLowerCase()}`} className="hover:text-primary transition-colors">{l}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground list-none p-0 m-0">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href={`mailto:${profile?.email || 'joanivymwangi@gmail.com'}`} className="hover:text-primary transition-colors truncate">
                  {profile?.email || 'joanivymwangi@gmail.com'}
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
          </div>
        </div>
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {year} Joan Mwangi. All rights reserved.</p>
<a
  href="https://george-mwangi.github.io/Portfolio/"
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
