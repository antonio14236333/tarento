// app/students/profile/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <div>
        <h1>Perfil del Estudiante</h1>
        <p>Bienvenido, {session.user.email}</p>
      </div>
    </div>
  );
}
