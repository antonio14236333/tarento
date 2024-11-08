// types/next-auth.d.ts
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string; // Añade el campo `role`
      email: string;
    };
  }

  interface JWT {
    userRole: string; // Añade `userRole` al token JWT
    id: string;       // Añade `id` al token JWT
  }
}
