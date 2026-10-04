import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      jamaat?: string | null
      role?: string | null
    } & DefaultSession["user"]
  }
}
