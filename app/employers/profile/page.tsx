// app/students/profile/page.tsx

'use client'

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);

  console.log('Session:', session);

  if (!session || session.user.role !== 'employer') {
    redirect('/authentication/login');
  }

  return (
    <div>
      <h1>Perfil del Estudiante</h1>
      <p>Bienvenido, {session.user.email}</p>
    </div>
    
  );
}
