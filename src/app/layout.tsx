import type { Metadata } from 'next'
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/shared/ThemeProvider'
import { Toaster } from 'react-hot-toast'
import { prisma } from '@/lib/prisma'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap', weight: ['300','400','500','600','700'] })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-display', display: 'swap', weight: ['400','500','600','700'] })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap', weight: ['400','500'] })

export async function generateMetadata(): Promise<Metadata> {
  const [profile,seo]=await Promise.all([prisma.profile.findFirst({where:{isPublished:true}}).catch(()=>null),prisma.seoSettings.findFirst().catch(()=>null)])
  const base=seo?.canonicalUrl||process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000'
  const name=profile?.name||'Portfolio'
  const title=seo?.siteTitle||profile?.mainTitle||name
  const description=seo?.metaDescription||profile?.summary||''
  const favicon=seo?.faviconUrl||profile?.faviconUrl
  return { metadataBase:new URL(base), title:{default:title,template:`%s | ${name}`}, description, keywords:seo?.keywords||[], authors:[{name}], creator:name, publisher:name, alternates:{canonical:seo?.canonicalUrl||undefined}, openGraph:{type:'website',locale:'en_KE',url:base,title:seo?.openGraphTitle||title,description:seo?.openGraphDescription||description,siteName:name,images:seo?.openGraphImage?[{url:seo.openGraphImage}]:undefined}, twitter:{card:'summary_large_image',title:seo?.openGraphTitle||title,description:seo?.openGraphDescription||description,images:seo?.openGraphImage?[seo.openGraphImage]:undefined}, robots:{index:true,follow:true}, icons:{icon:favicon?[{url:favicon}]:[{url:'/favicon.ico',sizes:'any'},{url:'/icon.svg',type:'image/svg+xml'}],apple:favicon?[{url:favicon}]:[{url:'/apple-touch-icon.png'}]} }
}

export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}><body className="min-h-screen bg-background text-foreground antialiased"><ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>{children}<Toaster position="bottom-right" toastOptions={{duration:4000,style:{background:'hsl(var(--card))',color:'hsl(var(--foreground))',border:'1px solid hsl(var(--border))'}}}/></ThemeProvider></body></html> }
