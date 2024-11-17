import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {

    
    const session = await getSession({ req: { headers: Object.fromEntries(request.headers) } });

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const userId = session.user.id;

    const user = await prisma.student.findUnique({
      where: {
        id: userId,
      },
      select: {
        fullName: true,
        educationLevel: true,
        careerStatus: true,
        skills: true,
        experience: true,
        education: true,
        location: true,
      },
    });



    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while fetching the profile' }, { status: 500 });
  }
}