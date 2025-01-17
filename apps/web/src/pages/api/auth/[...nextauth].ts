import { PrismaAdapter } from '@next-auth/prisma-adapter'
import jwt from 'jsonwebtoken'
import NextAuth, { NextAuthOptions } from 'next-auth'
import { encode, JWT } from 'next-auth/jwt'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from '@penx/db'

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
      httpOptions: {
        timeout: 10 * 1000,
      },
    }),
    // ...add more providers here
  ],

  session: {
    strategy: 'jwt',
  },

  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: `/login`,
    verifyRequest: `/login`,
    error: '/login', // Error code passed in query string as ?error=
  },
  // jwt: {
  //   maxAge: 30 * 24 * 30 * 60,
  //   decode: async ({ token, secret }) => {
  //     console.log('============dencode token', token, 'secret', secret)
  //     const result = jwt.verify(token!, secret)
  //     console.log('========result:', result)

  //     return result
  //   },

  //   encode: async ({ token, secret }) => {
  //     console.log('encode token', token, 'secret', secret)
  //     const encoded = jwt.sign(token!, secret, { algorithm: 'HS256' })
  //     console.log('========encoded:', encoded)

  //     return encoded
  //   },
  // },

  callbacks: {
    async signIn({ user, account, profile }) {
      // console.log('============user:', user, 'account:', account)
      // await initSpace(user.id, user.name!)
      return true
    },

    async jwt({ token, account, user, profile }) {
      if (user) {
        token.uid = user.id
      }
      return token
    },
    async session({ session, token, user, ...rest }) {
      // Send properties to the client, like an access_token from a provider.

      session.userId = token.uid as string
      ;(session.user as any).id = token.uid

      return session
    },
  },
}

export default NextAuth(authOptions)
