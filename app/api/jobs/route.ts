// app/api/employers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {

    const session = await getSession({ req: { headers: Object.fromEntries(req.headers) } });
  
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const employerId = session.user.id;




    
    const body = await req.json();

    const {
        title,
        description,
        jobType,
        location
    } = body;

    const newJob = await prisma.job.create({
      data: {
        title,
        description,
        jobType,
        location: location || null,
        employer: { connect: { id: employerId } }
      },
    });

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error("Error creating employer:", error);
    return NextResponse.json({ error: "Error creating employer" }, { status: 500 });
  }
}

