// import { auth } from '@/lib/auth'
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export default auth((req) => {
//   const { pathname } = req.nextUrl

//   // Protect admin routes (except login)
//   if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
//     if (!req.auth) {
//       const loginUrl = new URL('/admin/login', req.url)
//       loginUrl.searchParams.set('callbackUrl', pathname)
//       return NextResponse.redirect(loginUrl)
//     }
//   }

//   // Protect admin API routes
//   if (pathname.startsWith('/api/admin')) {
//     if (!req.auth) {
//       return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
//     }
//   }

//   return NextResponse.next()
// })

// export const config = {
//   matcher: ['/admin/:path*', '/api/admin/:path*'],
// }


import NextAuth from 'next-auth'
import authConfig from '@/lib/auth.config'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!req.auth) {
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)

      return NextResponse.redirect(loginUrl)
    }
  }

  if (pathname.startsWith('/api/admin')) {
    if (!req.auth) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}