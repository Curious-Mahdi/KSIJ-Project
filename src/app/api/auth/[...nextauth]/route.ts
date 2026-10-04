import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

// Emails listed in ADMIN_EMAILS are automatically granted the ADMIN role on first sign-in.
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "dummy",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy",
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Demo / Dev Login",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        const email = credentials.email.trim().toLowerCase();
        const isAdmin = ADMIN_EMAILS.includes(email);

        let dbUser = await prisma.user.findUnique({
          where: { email },
        });

        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              googleId: "cred_" + Date.now(),
              email,
              name: email.split("@")[0],
              role: isAdmin ? "ADMIN" : "USER",
              isAdmin,
              jamaat: "Mumbai",
            },
          });
        } else if (isAdmin && (!dbUser.isAdmin || dbUser.role !== "ADMIN")) {
          dbUser = await prisma.user.update({
            where: { id: dbUser.id },
            data: { role: "ADMIN", isAdmin: true },
          });
        }

        return {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          image: dbUser.profilePhoto,
          role: dbUser.role || (isAdmin ? "ADMIN" : "USER"),
          isAdmin: dbUser.isAdmin || isAdmin,
          jamaat: dbUser.jamaat || "Mumbai",
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;
      if (account?.provider === "credentials") return true;
      
      try {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email }
        });

        const isAdmin = ADMIN_EMAILS.includes(user.email.toLowerCase());

        if (!dbUser) {
          await prisma.user.create({
            data: {
              googleId: account?.providerAccountId || user.id,
              email: user.email,
              name: user.name,
              profilePhoto: user.image,
              role: isAdmin ? "ADMIN" : "USER",
              isAdmin: isAdmin,
              jamaat: "Mumbai",
            }
          });
        } else if (isAdmin && (!dbUser.isAdmin || dbUser.role !== "ADMIN")) {
          // Auto-promote existing user if they appear in ADMIN_EMAILS
          await prisma.user.update({
            where: { id: dbUser.id },
            data: { role: "ADMIN", isAdmin: true },
          });
        }
      } catch (err) {
        console.error("signIn callback error (non-fatal):", err);
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.isAdmin = (user as any).isAdmin;
        token.jamaat = (user as any).jamaat;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token?.id) (session.user as any).id = token.id;
        if (token?.role) (session.user as any).role = token.role;
        if (token?.isAdmin !== undefined) (session.user as any).isAdmin = token.isAdmin;
        if (token?.jamaat) (session.user as any).jamaat = token.jamaat;

        if (session.user.email) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { email: session.user.email }
            });
            if (dbUser) {
              session.user = {
                ...session.user,
                id: dbUser.id,
                jamaat: dbUser.jamaat || "Mumbai",
                name: dbUser.name || session.user.name,
                role: dbUser.role === "ADMIN" || dbUser.isAdmin ? "ADMIN" : "USER",
                isAdmin: dbUser.isAdmin || dbUser.role === "ADMIN",
              } as any;
            }
          } catch (err) {
            console.error("session callback error (non-fatal):", err);
          }
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

const authHandler = NextAuth(authOptions);

async function handler(req: any, context: any) {
  if (context?.params && typeof context.params.then === "function") {
    const resolvedParams = await context.params;
    return authHandler(req, { ...context, params: resolvedParams });
  }
  return authHandler(req, context);
}

export { handler as GET, handler as POST };

