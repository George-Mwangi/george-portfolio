// import Credentials from 'next-auth/providers/credentials'
// import type { NextAuthConfig } from 'next-auth'

// export default {
//   providers: [
//     Credentials({
//       name: 'credentials',
//       credentials: {
//         email: { label: 'Email', type: 'email' },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize() {
//         return null
//       },
//     }),
//   ],

//   pages: {
//     signIn: '/admin/login',
//     error: '/admin/login',
//   },

//   session: {
//     strategy: 'jwt',
//     maxAge: 24 * 60 * 60,
//   },
// } satisfies NextAuthConfig

import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        ;(session.user as { role?: string }).role = token.role as string
      }

      return session
    },
  },
  providers: [],
} satisfies NextAuthConfig