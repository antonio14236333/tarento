import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/authentication/login', req.url));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/authentication/login', req.url));
  }
}

// Especifica las rutas protegidas
export const config = {
  matcher: ['/students/profile/:path*', '/employers/:path*'], // Rutas que deseas proteger
};
