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
  const profile = await prisma.profile.findFirst({ where: { isPublished: true } }).catch(() => null)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://georgemwangi.vercel.app'

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${profile?.name || 'George Mwangi'} | Procurement Officer & Supply Chain Professional Kenya`,
      template: `%s | ${profile?.name || 'George Mwangi'}`,
    },
    description: 'Certified Procurement and Supply Professional (CPSP-K) with expertise in supply chain logistics, sales, and customer service. Based in Nakuru, Kenya.',
    keywords: ['Procurement Officer Kenya','CPSP-K Kenya','Logistics Professional Kenya','Customer Service Kenya','Sales Executive Kenya','George Mwangi'],
    authors: [{ name: profile?.name || 'George Mwangi' }],
    openGraph: {
      type: 'website', locale: 'en_KE', url: siteUrl,
      title: `${profile?.name || 'George Mwangi'} | Procurement Officer`,
      description: 'CPSP-K certified. Supply chain, logistics, sales. Based in Nakuru, Kenya.',
      siteName: `${profile?.name || 'George Mwangi'} Portfolio`,
    },
    twitter: { card: 'summary_large_image' },
    robots: { index: true, follow: true },
    icons: {
      icon: profile?.faviconUrl
        ? [{ url: profile.faviconUrl }]
        : [{ url: '/favicon.ico', sizes: 'any' }, { url: '/icon.svg', type: 'image/svg+xml' }],
      apple: profile?.faviconUrl ? [{ url: profile.faviconUrl }] : [{ url: '/apple-touch-icon.png' }],
    },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}>
      <body className="antialiased min-h-screen bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
              },
              duration: 4000,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
