// app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { userAgent } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          // Esto en algun punto alguien tendra que cambiarlo por un hash y no sere yo
          // se debe usar bcrypt para comparar pero la contraseña debe ser hasheada
          // good look kiddo
          
          const student = await prisma.student.findUnique({
            where: { email: credentials.email },
          });

          if (student && credentials.password === student.passwordHash) {
            return {
              id: student.id,
              email: student.email,
              name: student.fullName,
              role: 'student'
            };
          }

          const employer = await prisma.employer.findUnique({
            where: { email: credentials.email },
          });

          if (employer && credentials.password === employer.passwordHash) {
            return {
              id: employer.id,
              email: employer.email,
              name: employer.companyName,
              role: 'employer'
            };
          }

          return null;
        } catch (error) {
          console.error('Error during authentication:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    async jwt({ token, user }: { token: any, user?: any }) {
      if (user) {
        token.userRole = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.userRole;
      }
      return session;
    },
  },
};


const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
