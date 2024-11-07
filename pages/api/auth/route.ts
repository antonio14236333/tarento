// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { PrismaClient } from '@prisma/client';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: 'student-login',
      name: "Student Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        userType: { label: "UserType", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciales requeridas")
        }

        // Verificar si es estudiante o empleador
        if (credentials.userType === 'student') {
          const student = await prisma.student.findUnique({
            where: { email: credentials.email }
          })

          if (!student) {
            throw new Error("Usuario no encontrado")
          }

          const isValid = await compare(credentials.password, student.passwordHash)

          if (!isValid) {
            throw new Error("Contraseña incorrecta")
          }

          return {
            id: student.id,
            email: student.email,
            name: student.fullName,
            role: "STUDENT",
            userType: "student"
          }
        } else if (credentials.userType === 'employer') {
          const employer = await prisma.employer.findUnique({
            where: { email: credentials.email }
          })

          if (!employer) {
            throw new Error("Usuario no encontrado")
          }

          const isValid = await compare(credentials.password, employer.passwordHash)

          if (!isValid) {
            throw new Error("Contraseña incorrecta")
          }

          return {
            id: employer.id,
            email: employer.email,
            name: employer.companyName,
            role: "EMPLOYER",
            userType: "employer"
          }
        }

        throw new Error("Tipo de usuario inválido")
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.userType = user.userType
        token.uid = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid as string
        session.user.role = token.role as string
        session.user.userType = token.userType as string
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/auth/error'
  }
})

export { handler as GET, handler as POST }

// middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/login')
    const isEmployerRoute = req.nextUrl.pathname.startsWith('/employer')
    const isStudentRoute = req.nextUrl.pathname.startsWith('/student')

    if (isAuthPage) {
      if (isAuth) {
        // Redirigir a la dashboard correspondiente según el tipo de usuario
        const redirectUrl = token?.userType === 'employer' 
          ? '/employer/dashboard' 
          : '/student/dashboard'
        return NextResponse.redirect(new URL(redirectUrl, req.url))
      }
      return null
    }

    // Proteger rutas específicas por tipo de usuario
    if (isEmployerRoute && token?.userType !== 'employer') {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    if (isStudentRoute && token?.userType !== 'student') {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: [
    '/student/:path*',
    '/employer/:path*',
    '/login'
  ]
}