import type { Metadata } from 'next'
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/shared/ThemeProvider'
import { Toaster } from 'react-hot-toast'
import { prisma } from '@/lib/prisma'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500'],
})

export async function generateMetadata(): Promise<Metadata> {
  const profile = await prisma.profile
    .findFirst({
      where: { isPublished: true },
    })
    .catch(() => null)

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://georgemwangi.vercel.app'

  const name = profile?.name || 'George Mwangi'

  return {
    metadataBase: new URL(siteUrl),

    title: {
      default: `${name} | IT Professional • Cyber Security Specialist • Web Developer`,
      template: `%s | ${name}`,
    },

    description:
      profile?.summary ||
      'IT Professional, Cyber Security Specialist, and Full Stack Web Developer specializing in secure web applications, networking, cloud technologies, automation, and business software solutions.',

    keywords: [
      'George Mwangi',
      'IT Professional',
      'Cyber Security Specialist',
      'Ethical Hacker',
      'Web Developer',
      'Full Stack Developer',
      'React Developer',
      'Next.js Developer',
      'FastAPI',
      'Python Developer',
      'Cyber Security',
      'Penetration Testing',
      'Network Security',
      'Kenya',
      'Remote Developer',
      'Software Engineer',
      'IT Support',
    ],

    authors: [{ name }],

    creator: name,
    publisher: name,

    openGraph: {
      type: 'website',
      locale: 'en_KE',
      url: siteUrl,

      title: `${name} | IT Professional • Cyber Security Specialist • Web Developer`,

      description:
        profile?.summary ||
        'Portfolio showcasing software development, cyber security, networking, and IT infrastructure projects.',

      siteName: `${name} Portfolio`,
    },

    twitter: {
      card: 'summary_large_image',
      title: `${name} | IT Professional`,
      description:
        profile?.summary ||
        'Cyber Security Specialist, Web Developer, and IT Professional.',
    },

    robots: {
      index: true,
      follow: true,
    },

    icons: {
      icon: profile?.faviconUrl
        ? [{ url: profile.faviconUrl }]
        : [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/icon.svg', type: 'image/svg+xml' },
          ],

      apple: profile?.faviconUrl
        ? [{ url: profile.faviconUrl }]
        : [{ url: '/apple-touch-icon.png' }],
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}
    >
      <body className="antialiased min-h-screen bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}

          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}