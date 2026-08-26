'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { BarChart3, BadgeCheck, Briefcase, ChevronDown, FileText, FolderOpen, Image, LayoutDashboard, Link2, LogOut, Menu, MessageSquare, Navigation, Quote, Search, Settings, Sparkles, Star, User, Wrench, X } from 'lucide-react'
import { AdminCmsEditor, type CmsField } from './AdminCmsEditor'
import { AdminSingletonEditor } from './AdminSingletonEditor'
import { AdminEducationEditor } from './AdminEducationEditor'
import { AdminClientsEditor } from './AdminClientsEditor'
import { AdminTestimonialsEditor } from './AdminTestimonialsEditor'
import { AdminMessagesPanel } from './AdminMessagesPanel'
import { AdminMediaUploader } from './AdminMediaUploader'
import { AdminSectionsEditor } from './AdminSectionsEditor'
import type { SiteSectionSetting } from '@/lib/siteSections'
import { cn } from '@/lib/utils'

type Tab = 'overview'|'profile'|'hero'|'about'|'achievements'|'services'|'skills'|'experience'|'projects'|'certifications'|'testimonials'|'education'|'clients'|'navigation'|'social'|'contact'|'seo'|'media'|'messages'|'settings'
const groups: { label: string; items: { id: Tab; label: string; icon: React.ElementType }[] }[] = [
  { label: '', items: [{ id: 'overview', label: 'Dashboard', icon: LayoutDashboard }] },
  { label: 'Portfolio', items: [
    { id: 'profile', label: 'Profile', icon: User }, { id: 'hero', label: 'Hero', icon: Sparkles },
    { id: 'about', label: 'About', icon: FileText }, { id: 'achievements', label: 'Achievements', icon: BarChart3 },
    { id: 'services', label: 'Services', icon: Wrench }, { id: 'skills', label: 'Skills', icon: Star },
    { id: 'experience', label: 'Experience', icon: Briefcase }, { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'certifications', label: 'Certifications', icon: BadgeCheck }, { id: 'testimonials', label: 'Testimonials', icon: Quote },
    { id: 'education', label: 'Education', icon: FileText }, { id: 'clients', label: 'Clients', icon: User },
  ]},
  { label: 'Website', items: [
    { id: 'navigation', label: 'Navigation', icon: Navigation }, { id: 'social', label: 'Social Links', icon: Link2 },
    { id: 'contact', label: 'Contact', icon: MessageSquare }, { id: 'seo', label: 'SEO', icon: Search },
  ]},
  { label: 'Media', items: [{ id: 'media', label: 'Media Library', icon: Image }] },
  { label: 'Operations', items: [{ id: 'messages', label: 'Messages', icon: MessageSquare }, { id: 'settings', label: 'Site Settings', icon: Settings }] },
]

const yesNo = (name: string, label: string): CmsField => ({ name, label, type: 'checkbox' })
const line = (name: string, label: string): CmsField => ({ name, label, type: 'lines', wide: true })

export function AdminDashboardClient({ user, initialData: d }: { user: any; initialData: any & { siteSections: SiteSectionSetting[] } }) {
  const [tab, setTab] = useState<Tab>('overview')
  const [open, setOpen] = useState(false)
  const go = (id: Tab) => { setTab(id); setOpen(false) }
  const item = groups.flatMap((group) => group.items).find((entry) => entry.id === tab)
  const ActiveIcon = item?.icon || LayoutDashboard

  const content = () => {
    if (tab === 'overview') return <div className="space-y-6"><div><h1 className="font-display text-3xl font-bold">Portfolio CMS</h1><p className="mt-1 text-muted-foreground">Manage every public section without editing code.</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[
      ['Projects', d.projects.length], ['Skills', d.skills.length], ['Experience', d.experiences.length], ['Unread messages', d.stats.unreadMessages],
    ].map(([label, value]) => <div key={String(label)} className="rounded-2xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-bold text-primary">{value}</p></div>)}</div><div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm text-muted-foreground"><strong className="text-foreground">Quick start:</strong> choose a section in the sidebar, create or edit content, then publish it. Public pages read directly from these records.</div></div>
    if (tab === 'profile') return <div className="space-y-10"><div className="flex flex-col gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold text-foreground">Looking for the “5+ Years Experience” card?</p><p className="text-muted-foreground">Homepage statistics are managed separately under Portfolio → Achievements.</p></div><button onClick={() => setTab('achievements')} className="shrink-0 rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground">Manage achievements</button></div><AdminSingletonEditor title="Profile" description="Your professional identity, summary, contact details, availability, profile image and active CV. Contact and professional-summary changes are synchronized to their public sections." resource="profile" value={d.profile} fields={[
      { name:'name',label:'Full name',required:true }, { name:'mainTitle',label:'Main title' }, { name:'professionalSummary',label:'Professional summary',type:'textarea',wide:true },
      { name:'email',label:'Email',type:'email',required:true }, { name:'phone',label:'Phone' }, { name:'location',label:'Location' }, { name:'whatsappNumber',label:'WhatsApp' },
      { name:'linkedinUrl',label:'LinkedIn',type:'url' }, { name:'githubUrl',label:'GitHub',type:'url' }, { name:'websiteUrl',label:'Website',type:'url' },
      { name:'availabilityText',label:'Availability badge' }, yesNo('availabilityActive','Show availability badge'), { name:'profileImageUrl',label:'Profile image URL',type:'url' },
      { name:'cvUrl',label:'Active CV URL',type:'url' }, { name:'cvFileName',label:'CV filename' }, yesNo('isPublished','Publish profile'),
    ]}/><AdminCmsEditor title="Secondary Titles" description="Add, edit, reorder and activate the titles rotated on the homepage." resource="profileTitle" items={d.profileTitles} displayField="title" statusField="isActive" fields={[{name:'title',label:'Title',required:true},yesNo('isPrimary','Primary title'),yesNo('isActive','Active')]}/></div>
    if (tab === 'hero') return <AdminSingletonEditor title="Hero" description="Control the homepage headline, description, calls to action, availability and image." resource="profile" value={d.profile} fields={[
      {name:'mainTitle',label:'Main title',required:true},{name:'heroDescription',label:'Hero description',type:'textarea',wide:true},{name:'availabilityText',label:'Availability text'},yesNo('availabilityActive','Show availability'),
      {name:'primaryCtaText',label:'Primary CTA text'},{name:'primaryCtaUrl',label:'Primary CTA URL'},{name:'secondaryCtaText',label:'Secondary CTA text'},{name:'secondaryCtaUrl',label:'Secondary CTA URL'},
      {name:'heroImageUrl',label:'Hero image URL',type:'url',wide:true},yesNo('isPublished','Show hero'),
    ]}/>
    if (tab === 'about') return <div className="space-y-10"><AdminSingletonEditor title="About" description="Edit the section copy, mission and call to action." resource="aboutContent" value={d.aboutContent} fields={[
      {name:'sectionTitle',label:'Section title',required:true},{name:'subtitle',label:'Subtitle'},{name:'introduction',label:'Introduction',type:'textarea',wide:true},{name:'professionalSummary',label:'Professional summary',type:'textarea',wide:true},{name:'mission',label:'Mission',type:'textarea',wide:true},{name:'ctaText',label:'CTA text'},{name:'ctaUrl',label:'CTA URL'},yesNo('isPublished','Publish section'),
    ]}/><AdminCmsEditor title="Key Points" description="Add, remove and reorder supporting points." resource="aboutPoint" items={d.aboutContent?.points || []} displayField="text" statusField="isActive" fields={[{name:'text',label:'Key point',type:'textarea',required:true,wide:true},yesNo('isActive','Active')]}/></div>
    if (tab === 'achievements') return <AdminCmsEditor title="Achievements" description="Manage measurable homepage outcomes. Prefix and suffix are optional." resource="achievement" items={d.achievements} displayField="label" secondaryField="description" statusField="isPublished" fields={[{name:'value',label:'Value',required:true},{name:'prefix',label:'Prefix'},{name:'suffix',label:'Suffix'},{name:'label',label:'Label',required:true},{name:'description',label:'Description',type:'textarea',wide:true},{name:'icon',label:'Icon name'},yesNo('isPublished','Active')]}/>
    if (tab === 'services') return <AdminCmsEditor title="Services" description="Create and arrange the capabilities offered on the public site." resource="service" items={d.services} displayField="title" secondaryField="description" statusField="isActive" fields={[{name:'title',label:'Title',required:true},{name:'icon',label:'Icon name'},{name:'description',label:'Description',type:'textarea',required:true,wide:true},{name:'iconUrl',label:'Custom icon URL',type:'url'},yesNo('isActive','Active')]}/>
    if (tab === 'skills') return <div className="space-y-10"><AdminCmsEditor title="Skill Categories" description="Create and reorder your own skill categories." resource="skillGroup" items={d.skillGroups} displayField="name" secondaryField="description" statusField="isActive" fields={[{name:'name',label:'Name',required:true},{name:'description',label:'Description',type:'textarea',wide:true},yesNo('isActive','Active')]}/><AdminCmsEditor title="Skills" description="Manage technologies and evidence. Proficiency is optional and is not displayed publicly." resource="skill" items={d.skills} displayField="name" secondaryField="evidence" statusField="isPublished" fields={[{name:'name',label:'Skill',required:true},{name:'skillGroupId',label:'Category',type:'select',options:d.skillGroups.map((g:any)=>({label:g.name,value:g.id}))},{name:'iconUrl',label:'Icon URL',type:'url'},{name:'evidence',label:'Experience / evidence',type:'textarea',wide:true},{name:'proficiency',label:'Optional proficiency',type:'number'},yesNo('isPublished','Active')]}/></div>
    if (tab === 'experience') return <AdminCmsEditor title="Experience" description="Manage jobs, responsibilities and outcome-focused achievements as editable records." resource="experience" items={d.experiences} displayField="role" secondaryField="company" statusField="isPublished" fields={[{name:'role',label:'Job title',required:true},{name:'company',label:'Company',required:true},{name:'location',label:'Location'},{name:'employmentType',label:'Employment type'},{name:'startDate',label:'Start date',type:'date',required:true},{name:'endDate',label:'End date',type:'date'},yesNo('isCurrent','Current position'),{name:'description',label:'Summary',type:'textarea',wide:true},line('responsibilities','Responsibilities'),line('experienceAchievements','Achievements'),line('technologies','Technologies'),line('systems','Systems'),yesNo('isFeatured','Featured'),yesNo('isPublished','Published')]}/>
    if (tab === 'projects') return <AdminCmsEditor title="Projects" description="Create case studies with gallery URLs, technologies, features, results and publishing controls. Upload assets in Media Library, then reuse their URLs here." resource="project" items={d.projects} displayField="title" secondaryField="description" statusField="isPublished" fields={[{name:'title',label:'Project name',required:true},{name:'category',label:'Category'},{name:'client',label:'Client'},{name:'description',label:'Short description',type:'textarea',required:true,wide:true},{name:'problem',label:'Problem',type:'textarea',wide:true},{name:'solution',label:'Solution',type:'textarea',wide:true},{name:'role',label:'My role',type:'textarea',wide:true},line('features','Features'),line('results','Results'),line('technologyNames','Technologies'),{name:'imageUrl',label:'Legacy/featured image URL',type:'url',wide:true},line('imageList','Gallery: one URL|alt text per line'),{name:'projectUrl',label:'Live URL',type:'url'},{name:'githubUrl',label:'GitHub URL',type:'url'},yesNo('isFeatured','Featured'),yesNo('isPublished','Published')]}/>
    if (tab === 'certifications') return <AdminCmsEditor title="Certifications" description="Manage credentials, certificate files, feature status and publication." resource="certification" items={d.certifications} displayField="name" secondaryField="issuer" statusField="isPublished" fields={[{name:'name',label:'Certification',required:true},{name:'issuer',label:'Issuing organization',required:true},{name:'issueDate',label:'Issue date',type:'date'},{name:'expiryDate',label:'Expiry date',type:'date'},{name:'credentialId',label:'Credential ID'},{name:'credentialUrl',label:'Credential URL',type:'url'},{name:'certificateFileUrl',label:'Certificate file URL',type:'url'},{name:'imageUrl',label:'Preview image URL',type:'url'},yesNo('isFeatured','Featured'),yesNo('isPublished','Active')]}/>
    if (tab === 'navigation') return <AdminCmsEditor title="Navigation" description="Control public menu labels, URLs, order and visibility." resource="navigationItem" items={d.navigationItems} displayField="label" secondaryField="url" statusField="isVisible" fields={[{name:'label',label:'Label',required:true},{name:'url',label:'URL',required:true},yesNo('newTab','Open in new tab'),yesNo('isVisible','Visible')]}/>
    if (tab === 'social') return <AdminCmsEditor title="Social Links" description="Add any platform and control its URL, icon and display order." resource="socialLink" items={d.socialLinks} displayField="platform" secondaryField="url" statusField="isActive" fields={[{name:'platform',label:'Platform',required:true},{name:'url',label:'URL',type:'url',required:true},{name:'icon',label:'Icon name'},yesNo('isActive','Active')]}/>
    if (tab === 'contact') return <AdminSingletonEditor title="Contact" description="Manage contact copy, details and call to action." resource="contactContent" value={d.contactContent} fields={[{name:'heading',label:'Heading',required:true},{name:'description',label:'Description',type:'textarea',wide:true},{name:'email',label:'Email',type:'email'},{name:'phone',label:'Phone'},{name:'location',label:'Location'},{name:'ctaText',label:'CTA text'},{name:'ctaUrl',label:'CTA URL'},yesNo('isPublished','Publish contact section')]}/>
    if (tab === 'seo') return <AdminSingletonEditor title="SEO" description="Edit search and social sharing metadata." resource="seoSettings" value={d.seoSettings} fields={[{name:'siteTitle',label:'Site title',required:true},{name:'metaDescription',label:'Meta description',type:'textarea',required:true,wide:true},line('keywords','Keywords'),{name:'openGraphTitle',label:'OpenGraph title'},{name:'openGraphDescription',label:'OpenGraph description',type:'textarea',wide:true},{name:'openGraphImage',label:'OpenGraph image URL',type:'url'},{name:'faviconUrl',label:'Favicon URL',type:'url'},{name:'canonicalUrl',label:'Canonical URL',type:'url'}]}/>
    if (tab === 'media') return <div className="space-y-10"><AdminMediaUploader profile={d.profile} assets={d.mediaAssets}/><AdminCmsEditor title="CV Versions" description="Upload documents above, then add the URL here. Activate the CV the public download button should use." resource="resume" items={d.resumes} displayField="version" secondaryField="fileName" statusField="isActive" orderField="createdAt" fields={[{name:'version',label:'Version name',required:true},{name:'fileUrl',label:'File URL',type:'url',required:true},{name:'fileName',label:'Download filename',required:true},yesNo('isActive','Active CV')]}/></div>
    if (tab === 'testimonials') return <AdminTestimonialsEditor testimonials={d.testimonials}/>
    if (tab === 'education') return <AdminEducationEditor education={d.education}/>
    if (tab === 'clients') return <AdminClientsEditor clients={d.clients}/>
    if (tab === 'messages') return <AdminMessagesPanel messages={d.messages}/>
    return <AdminSectionsEditor initialSections={d.siteSections}/>
  }

  return <div className="min-h-screen bg-background lg:pl-72">
    <aside className={cn('fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card transition-transform lg:translate-x-0', open ? 'translate-x-0' : '-translate-x-full')}>
      <div className="flex h-16 items-center justify-between border-b border-border px-5"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-xs font-bold text-primary-foreground">GM</span><div><p className="text-sm font-bold">Portfolio CMS</p><p className="text-[11px] text-muted-foreground">Content management</p></div></div><button onClick={()=>setOpen(false)} className="lg:hidden"><X className="h-5 w-5"/></button></div>
      <nav className="flex-1 overflow-y-auto p-3">{groups.map((group) => <div key={group.label || 'main'} className="mb-4">{group.label && <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">{group.label}</p>}{group.items.map(({id,label,icon:Icon}) => <button key={id} onClick={()=>go(id)} className={cn('mb-0.5 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors',tab===id?'bg-primary text-primary-foreground':'text-muted-foreground hover:bg-muted hover:text-foreground')}><Icon className="h-4 w-4"/><span>{label}</span></button>)}</div>)}</nav>
      <div className="border-t border-border p-3"><div className="mb-2 px-3 text-xs text-muted-foreground truncate">{user.email}</div><button onClick={()=>signOut({callbackUrl:'/admin/login'})} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"><LogOut className="h-4 w-4"/>Sign out</button></div>
    </aside>
    {open && <button aria-label="Close sidebar" onClick={()=>setOpen(false)} className="fixed inset-0 z-40 bg-black/50 lg:hidden"/>}
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur lg:px-8"><button onClick={()=>setOpen(true)} className="rounded-lg p-2 lg:hidden"><Menu className="h-5 w-5"/></button><ActiveIcon className="h-4 w-4 text-primary"/><span className="font-semibold">{item?.label}</span><ChevronDown className="ml-auto h-4 w-4 text-muted-foreground lg:hidden"/></header>
    <main className="mx-auto max-w-6xl p-4 py-8 sm:p-6 lg:p-8">{content()}</main>
  </div>
}
