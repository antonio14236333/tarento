// app/middleware.ts
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

import { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  
  if (!token) {
    return NextResponse.redirect(new URL('/authentication/login', req.url));
  }

  
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith('/students') && token.userRole !== 'student') {
    
    return NextResponse.redirect(new URL('/authentication/login', req.url));
  }

  if (pathname.startsWith('/employers') && token.userRole !== 'employer') {
    
    return NextResponse.redirect(new URL('/authentication/login', req.url));
  }

  
  return NextResponse.next();
}


export const config = {
  matcher: ['/students/:path*', '/employers/:path*'],
};
