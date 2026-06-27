// import NextAuth from 'next-auth'
// import Credentials from 'next-auth/providers/credentials'
// import { PrismaAdapter } from '@auth/prisma-adapter'
// import { prisma } from '@/lib/prisma'
// import bcrypt from 'bcryptjs'
// import { z } from 'zod'

// const loginSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(8),
// })

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   adapter: PrismaAdapter(prisma),
//   session: { strategy: 'jwt', maxAge: 24 * 60 * 60 }, // 24 hours
//   pages: {
//     signIn: '/admin/login',
//     error: '/admin/login',
//   },
//   providers: [
//     Credentials({
//       name: 'credentials',
//       credentials: {
//         email: { label: 'Email', type: 'email' },
//         password: { label: 'Password', type: 'password' },
//       },
//      async authorize(credentials) {
//       try{
//   const parsed = loginSchema.safeParse(credentials)

//   if (!parsed.success) return null

//   const user = await prisma.user.findUnique({
//     where: {
//       email: parsed.data.email,
//     },
//   })

//   if (!user) return null

//   const isValid = await bcrypt.compare(
//     parsed.data.password,
//     user.password
//   )

//   if (!isValid) return null

//   return {
//     id: user.id,
//     email: user.email,
//     name: user.name,
//     role: user.role,
//   }
// } catch (error) {
//   console.error("Authentcation error:")
//   return null
// }
// },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id
//         token.role = (user as { role?: string }).role
//       }
//       return token
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id as string
//         ;(session.user as { role?: string }).role = token.role as string
//       }
//       return session
//     },
//   },
// })


import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { authConfig } from '@/auth.config'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const parsed = loginSchema.safeParse(credentials)

          if (!parsed.success) return null

          const user = await prisma.user.findUnique({
            where: {
              email: parsed.data.email,
            },
          })

          if (!user) return null

          const isValid = await bcrypt.compare(
            parsed.data.password,
            user.password
          )

          if (!isValid) return null

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      },
    }),
  ],
})