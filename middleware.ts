// app/middleware.ts
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

import { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Obtén el token de la solicitud para verificar la sesión
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Si no hay token (usuario no autenticado), redirige al inicio de sesión
  if (!token) {
    return NextResponse.redirect(new URL('/authentication/login', req.url));
  }

  // Verifica la ruta actual para determinar el rol requerido
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith('/students') && token.userRole !== 'student') {
    // Si la ruta es para estudiantes y el usuario no es un estudiante, redirige
    return NextResponse.redirect(new URL('/authentication/login', req.url));
  }

  if (pathname.startsWith('/employers') && token.userRole !== 'employer') {
    // Si la ruta es para empleadores y el usuario no es un empleador, redirige
    return NextResponse.redirect(new URL('/authentication/login', req.url));
  }

  // Si el usuario tiene la sesión y el rol correctos, permite el acceso
  return NextResponse.next();
}

// Configura las rutas que quieres proteger
export const config = {
  matcher: ['/students/:path*', '/employers/:path*'], // Aplica el middleware a estas rutas
};
