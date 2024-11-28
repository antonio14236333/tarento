// app/middleware.ts
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

import { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  
 

  
  const pathname = req.nextUrl.pathname;

  if (pathname === '/students/register') {
    return NextResponse.next();
  }

  if (pathname === '/employers/register') {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // ira mike, se me acabo el tiempo, esto ya es pa sacarlo adelante, pero te toca chambearlo

  if (pathname === '/students/job-search') {
    if (!token || token.userRole !== 'student') {
      return NextResponse.redirect(new URL('/authentication/login', req.url));
    } else {
      
      const baseUrl = req.nextUrl.origin;
      const profile = await fetch(`${baseUrl}/api/students`);
      const data = await profile.json();

      if (data.profileStatus === 'incomplete') {
        return NextResponse.redirect(new URL('/students/profile', req.url));
      }
    }
    return NextResponse.next();
  }
  
  if (!token) {
    return NextResponse.redirect(new URL('/authentication/login', req.url));
  }

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
