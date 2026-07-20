import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user) {
            console.error("Auth failed: User not found for email:", credentials.email);
            return null;
          }

          if (!user.password) {
            console.error("Auth failed: Account has no password (sign in with Google instead):", credentials.email);
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            console.error("Auth failed: Invalid password for email:", credentials.email);
            // Log details for debugging (safe to log lengths/types)
            console.error(`Password debug - Input length: ${credentials.password.length}, Hash length: ${user.password.length}`);
            return null;
          }

          console.log("Auth successful for user:", user.email, "Role:", user.role);

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // If it's an admin trying to access admin routes, allow it
      if (url.startsWith('/admin')) {
        return url;
      }
      // Otherwise, use the default redirect behavior
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async signIn({ user, account }) {
      // Credentials sign-in already validated the user in `authorize`.
      if (account?.provider === "credentials") {
        return true;
      }

      // OAuth providers (Google, etc.) don't have a row in our own User
      // table by default - find or create one keyed by email.
      if (!user.email) {
        return false;
      }

      const existing = await prisma.user.findUnique({ where: { email: user.email } });
      if (!existing) {
        await prisma.user.create({
          data: {
            email: user.email,
            name: user.name ?? user.email.split("@")[0],
            password: null,
            role: "USER",
          },
        });
      }

      return true;
    },
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role as string;
      }
      console.log('Session callback - token role:', token.role, 'session user role:', session.user?.role);
      return session;
    },
    async jwt({ token, user }) {
      // Always resolve the real internal User row by email on sign-in, since
      // OAuth providers hand back their own profile id (not ours) in `user.id`.
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
        if (dbUser) {
          token.id = dbUser.id.toString();
          token.role = dbUser.role;
          token.name = dbUser.name;
        }
      }
      return token;
    },
  },
};
