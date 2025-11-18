

// // app/api/auth/[...nextauth]/route.ts
// import NextAuth, { type NextAuthOptions, type Profile } from 'next-auth'
// import CredentialsProvider from 'next-auth/providers/credentials'
// import GoogleProvider from 'next-auth/providers/google'
// import { PrismaAdapter } from '@next-auth/prisma-adapter'
// import db from '@/lib/prisma'
// import bcrypt from 'bcryptjs'

// // Extend next-auth types to include our custom properties
// declare module 'next-auth' {
//   interface User {
//     id: string
//     plan?: string
//     image?: string | null
//   }
  
//   interface Session {
//     user: {
//       id: string
//       email: string
//       name?: string | null
//       image?: string | null
//       plan: string
//     }
//   }
// }

// declare module 'next-auth/jwt' {
//   interface JWT {
//     id: string
//     plan: string
//     image?: string | null
//   }
// }

// // Extend the Profile type to include picture
// interface GoogleProfile extends Profile {
//   picture?: string
// }

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(db),
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         email: { label: 'Email', type: 'email' },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) return null

//         const user = await db.user.findUnique({
//           where: { email: credentials.email },
//         })

//         if (!user || !user.password) return null

//         const isValid = await bcrypt.compare(credentials.password, user.password)
//         if (!isValid) return null

//         return {
//           id: user.id,
//           email: user.email,
//           name: user.name,
//           image: user.image,
//           plan: user.plan || 'free',
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async signIn({ user, account, profile }) {
//       console.log('SignIn callback - User:', user);
//       console.log('SignIn callback - Profile:', profile);
      
//       // Only handle Google OAuth sign-ins
//       if (account?.provider === 'google' && profile?.email) {
//         const googleProfile = profile as GoogleProfile;
        
//         // Check if a user already exists with this Google email
//         const existingUser = await db.user.findUnique({
//           where: { email: profile.email },
//           include: { accounts: true }
//         });

//         if (existingUser) {
//           console.log('Found existing user with Google email:', profile.email);
          
//           // Check if Google account is already linked
//           const existingGoogleAccount = existingUser.accounts.find(
//             (acc: any) => acc.provider === 'google'
//           );

//           if (!existingGoogleAccount) {
//             console.log('Linking Google account to existing user');
//             // Link Google account to existing user
//             await db.account.create({
//               data: {
//                 userId: existingUser.id,
//                 type: account.type!,
//                 provider: account.provider,
//                 providerAccountId: account.providerAccountId!,
//               },
//             });
//           }

//           // Update the user object to use the existing user
//           user.id = existingUser.id;
//           user.email = existingUser.email;
//           user.name = existingUser.name || profile.name;
//           user.image = existingUser.image || googleProfile.picture;
//           (user as any).plan = existingUser.plan;
//         }
//         // If no existing user found, PrismaAdapter will create one
//       }
//       return true;
//     },
//     async jwt({ token, user, account }) {
//       if (user) {
//         token.id = (user as any).id
//         token.plan = (user as any).plan || 'free'
//         token.image = user.image
//       }
//       return token
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id as string
//         session.user.plan = token.plan as string
//         session.user.image = token.image as string | null
//       }
//       return session
//     },
//   },
//   pages: {
//     signIn: '/login',
//   },
//   session: {
//     strategy: 'jwt',
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// }

// const handler = NextAuth(authOptions)

// export { handler as GET, handler as POST }



// app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions, type Profile } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import db from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Extend next-auth types to include our custom properties
declare module 'next-auth' {
  interface User {
    id: string
    plan?: string
    image?: string | null
  }
  
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      plan?: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    plan?: string
    image?: string | null
  }
}

// Extend the Profile type to include picture
interface GoogleProfile extends Profile {
  picture?: string
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) return null

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          plan: user.plan || 'free',
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('SignIn callback - User:', user);
      console.log('SignIn callback - Profile:', profile);
      
      // Only handle Google OAuth sign-ins
      if (account?.provider === 'google' && profile?.email) {
        const googleProfile = profile as GoogleProfile;
        
        // Check if a user already exists with this Google email
        const existingUser = await db.user.findUnique({
          where: { email: profile.email },
          include: { accounts: true }
        });

        if (existingUser) {
          console.log('Found existing user with Google email:', profile.email);
          
          // Check if Google account is already linked
          const existingGoogleAccount = existingUser.accounts.find(
            (acc: any) => acc.provider === 'google'
          );

          if (!existingGoogleAccount) {
            console.log('Linking Google account to existing user');
            // Link Google account to existing user
            await db.account.create({
              data: {
                userId: existingUser.id,
                type: account.type!,
                provider: account.provider,
                providerAccountId: account.providerAccountId!,
              },
            });
          }

          // Update the user object to use the existing user
          user.id = existingUser.id;
          user.email = existingUser.email;
          user.name = existingUser.name || profile.name;
          user.image = existingUser.image || googleProfile.picture;
          (user as any).plan = existingUser.plan;
        }
        // If no existing user found, PrismaAdapter will create one
      }
      return true;
    },
    async jwt({ token, user, account, profile }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.plan = (user as any).plan || 'free'
        token.image = user.image
      }
      
      // Update token with latest user data on each request
      if (token.id) {
        const dbUser = await db.user.findUnique({
          where: { id: token.id as string },
        })
        
        if (dbUser) {
          token.plan = dbUser.plan || 'free'
          token.image = dbUser.image
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.plan = token.plan as string
        session.user.image = token.image as string | null
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }