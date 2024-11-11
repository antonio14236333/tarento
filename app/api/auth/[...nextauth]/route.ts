// app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

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

        
        if (credentials.email === 'antonio.gonzalez@justia.com' && credentials.password === 'testeo') {
          return {
            id: '12345',
            email: 'antonio.gonzalez@justia.com',
            name: 'Antonio González',
            role: 'student', // Puedes cambiar el rol si lo necesitas
          };
        }

        // Si las credenciales no coinciden, retorna null para rechazar la autenticación
        return null;
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

// Crea el handler de NextAuth
const handler = NextAuth(authOptions);

// Exporta el handler para manejar los métodos GET y POST
export { handler as GET, handler as POST };
