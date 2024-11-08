'use client'; // Esto convierte al componente en un Client Component

import '@/app/ui/global.css';
import { montserrat } from '@/app/ui/fonts';
import Header from '@/app/ui/header';
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Tarento</title>
      </head>
      <body className={`${montserrat.className} antialiased has-navbar-fixed-top`}>
        <SessionProvider>
          <Header />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
