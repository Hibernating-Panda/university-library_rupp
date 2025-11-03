import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) return null;
        const ok = await verifyPassword(credentials.password, user.password);
        if (!ok) return null;
        // Promote specific email to ADMIN if not already
        const emailLc = user.email.toLowerCase();
        if (emailLc === "sengsengly3@gmail.com" && user.role !== "ADMIN") {
          const updated = await prisma.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });
          return { id: updated.id, name: updated.name, email: updated.email, role: updated.role };
        }
        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      // If signing in, persist role from user
      if (user?.role) {
        token.role = user.role;
      }
      // Always refresh role from DB by email if available (covers OAuth sessions)
      if (!token.role && token?.email) {
        const dbUser = await prisma.user.findUnique({ where: { email: token.email } });
        if (dbUser) token.role = dbUser.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
