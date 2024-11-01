import '@/app/ui/global.css';
import { montserrat } from '@/app/ui/fonts';
import Header from '@/app/ui/header'

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
      <body className={`${montserrat.className} antialiased`}>
        
        <Header/>
        {children}
        
      </body>
    </html>
  );
}
