'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';

export default function ProfilePage() {
  console.log('ProfilePage');
  if (typeof window !== 'undefined') {
    console.log(localStorage.getItem('token'));
  }

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      console.log(localStorage.getItem('token'));
      console.log(token);

      if (!token) {
        router.push('/authentication/login');
        return;
      }

    }
  }, [router]);

  return (
    <div>
      <h1>Student Profile</h1>
      {/* Contenido de la página */}
    </div>
  );
}
