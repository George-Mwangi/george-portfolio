'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { User, Briefcase, GraduationCap, Wrench, BadgeCheck, MessageSquare,
  LogOut, LayoutDashboard, Star, FolderOpen, Building2, Image, Settings,
  Mail, Download, ChevronRight, Menu, X, Users, Quote } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AdminProfileEditor }      from './AdminProfileEditor'
import { AdminExperienceEditor }   from './AdminExperienceEditor'
import { AdminEducationEditor }    from './AdminEducationEditor'
import { AdminSkillsEditor }       from './AdminSkillsEditor'
import { AdminToolsEditor }        from './AdminToolsEditor'
import { AdminCertificationsEditor } from './AdminCertificationsEditor'
import { AdminProjectsEditor }     from './AdminProjectsEditor'
import { AdminClientsEditor }      from './AdminClientsEditor'
import { AdminTestimonialsEditor } from './AdminTestimonialsEditor'
import { AdminMessagesPanel }      from './AdminMessagesPanel'
import { AdminMediaUploader }      from './AdminMediaUploader'

type Tab = 'overview'|'profile'|'experience'|'education'|'skills'|'tools'|'certifications'|'projects'|'clients'|'testimonials'|'messages'|'media'

const NAV: { id: Tab; label: string; icon: React.ElementType; badge?: number }[] = [
  { id: 'overview',       label: 'Overview',        icon: LayoutDashboard },
  { id: 'profile',        label: 'Profile',         icon: User },
  { id: 'media',          label: 'Media & Branding',icon: Image },
  { id: 'experience',     label: 'Experience',      icon: Briefcase },
  { id: 'education',      label: 'Education',       icon: GraduationCap },
  { id: 'skills',         label: 'Skills',          icon: Star },
  { id: 'tools',          label: 'Tools',           icon: Wrench },
  { id: 'certifications', label: 'Certifications',  icon: BadgeCheck },
  { id: 'projects',       label: 'Projects',        icon: FolderOpen },
  { id: 'clients',        label: 'Clients',         icon: Building2 },
  { id: 'testimonials',   label: 'Testimonials',    icon: Quote },
  { id: 'messages',       label: 'Messages',        icon: MessageSquare },
]

interface Props {
  user: { name?: string|null; email?: string|null; id?: string }
  initialData: {
    profile: any; experiences: any[]; education: any[]; skills: any[]; tools: any[]
    certifications: any[]; projects: any[]; clients: any[]
    messages: any[]; testimonials: any[]
    stats: { totalMessages: number; unreadMessages: number; totalDownloads: number; pendingTestimonials: number }
  }
}

export function AdminDashboardClient({ user, initialData }: Props) {
  const [tab, setTab]             = useState<Tab>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { stats } = initialData

  const badgeFor = (id: Tab) => {
    if (id === 'messages' && stats.unreadMessages > 0)      return stats.unreadMessages
    if (id === 'testimonials' && stats.pendingTestimonials > 0) return stats.pendingTestimonials
    return undefined
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* ── Sidebar ── */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="h-16 flex items-center justify-between px-5 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">GM</span>
            <span className="font-display font-bold text-sm text-foreground">Admin Panel</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {NAV.map(({ id, label, icon: Icon }) => {
            const badge = badgeFor(id)
            return (
              <button key={id} onClick={() => { setTab(id); setSidebarOpen(false) }}
                className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  tab === id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/60')}>
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 text-left">{label}</span>
                {badge != null && (
                  <span className={cn('w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold',
                    tab === id ? 'bg-primary-foreground text-primary' : 'bg-destructive text-destructive-foreground')}>
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="p-3 border-t border-border shrink-0">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
              {user.name?.[0]?.toUpperCase() || 'J'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all">
            <LogOut className="w-4 h-4" />Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ── Main ── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/50 backdrop-blur sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted-foreground hover:text-foreground">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-semibold text-foreground">
              {NAV.find((n) => n.id === tab)?.label || 'Dashboard'}
            </h1>
          </div>
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors">
            View site <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {tab === 'overview'       && <AdminOverview stats={stats} setTab={setTab} initialData={initialData} />}
          {tab === 'profile'        && <AdminProfileEditor      profile={initialData.profile} />}
          {tab === 'media'          && <AdminMediaUploader       profile={initialData.profile} />}
          {tab === 'experience'     && <AdminExperienceEditor    experiences={initialData.experiences} />}
          {tab === 'education'      && <AdminEducationEditor     education={initialData.education} />}
          {tab === 'skills'         && <AdminSkillsEditor        skills={initialData.skills} />}
          {tab === 'tools'          && <AdminToolsEditor         tools={initialData.tools} />}
          {tab === 'certifications' && <AdminCertificationsEditor certifications={initialData.certifications} />}
          {tab === 'projects'       && <AdminProjectsEditor      projects={initialData.projects} />}
          {tab === 'clients'        && <AdminClientsEditor       clients={initialData.clients} />}
          {tab === 'testimonials'   && <AdminTestimonialsEditor  testimonials={initialData.testimonials} />}
          {tab === 'messages'       && <AdminMessagesPanel       messages={initialData.messages} />}
        </main>
      </div>
    </div>
  )
}

function AdminOverview({ stats, setTab, initialData }: any) {
  const cards = [
    { label: 'Unread Messages',       value: stats.unreadMessages,      total: stats.totalMessages,      icon: Mail,       action: () => setTab('messages'),      urgent: stats.unreadMessages > 0 },
    { label: 'Pending Testimonials',  value: stats.pendingTestimonials, total: null,                     icon: Quote,      action: () => setTab('testimonials'),  urgent: stats.pendingTestimonials > 0 },
    { label: 'CV Downloads',          value: stats.totalDownloads,      total: null,                     icon: Download,   action: null,                          urgent: false },
  ]
  const quickActions = [
    { label: 'Edit Profile',         tab: 'profile',        icon: User },
    { label: 'Add Project',          tab: 'projects',       icon: FolderOpen },
    { label: 'Add Client',           tab: 'clients',        icon: Building2 },
    { label: 'Manage Testimonials',  tab: 'testimonials',   icon: Quote },
    { label: 'Upload Media',         tab: 'media',          icon: Image },
    { label: 'View Messages',        tab: 'messages',       icon: MessageSquare },
  ]
  return (
    <div>
      <h2 className="text-xl font-display font-bold text-foreground mb-6">Dashboard Overview</h2>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => (
          <button key={c.label} onClick={c.action || undefined}
            className={cn('glass-card rounded-2xl p-5 border text-left transition-all', c.urgent ? 'border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50' : 'border-border/50 hover:border-primary/30', c.action ? 'cursor-pointer' : 'cursor-default')}>
            <div className="flex items-center gap-3 mb-2">
              <c.icon className={cn('w-5 h-5', c.urgent ? 'text-amber-500' : 'text-primary')} />
              <p className="text-sm text-muted-foreground">{c.label}</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{c.value}</p>
            {c.total != null && <p className="text-xs text-muted-foreground mt-1">{c.total} total</p>}
          </button>
        ))}
      </div>
      <div className="glass-card rounded-2xl p-5 border border-border/50">
        <h3 className="font-semibold text-foreground mb-4 text-sm">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {quickActions.map((a) => (
            <button key={a.tab} onClick={() => setTab(a.tab as Tab)}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all text-sm font-medium text-muted-foreground">
              <a.icon className="w-4 h-4 shrink-0" />{a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
// EOSX
// echo "AdminDashboardClient done"