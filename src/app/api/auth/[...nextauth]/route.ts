import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "dummy",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;
      
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email }
      });

      if (!dbUser) {
        // We do not save them directly to DB here if we want them to go through onboarding to select Jamaat.
        // Wait, if we save them here, how do we know if they finished onboarding?
        // Let's create the user here without Jamaat.
        await prisma.user.create({
          data: {
            googleId: account?.providerAccountId || user.id,
            email: user.email,
            name: user.name,
            profilePhoto: user.image,
          }
        });
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && session.user.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email }
        });
        if (dbUser) {
          session.user = {
            ...session.user,
            id: dbUser.id,
            jamaat: dbUser.jamaat,
            name: dbUser.name,
          } as any;
        }
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    newUser: '/onboarding',
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET || "my-super-secret-key-for-mvp-only",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
