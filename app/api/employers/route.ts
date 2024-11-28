// app/api/employers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Received body:", body);

    const {
      email,
      passwordHash,
      companyName,
      industry,
      companySize,
      companyDescription,
      location,
    } = body;

    const newEmployer = await prisma.employer.create({
      data: {
        email,
        passwordHash,
        companyName,
        industry: industry || null,
        companySize: companySize || null,
        companyDescription: companyDescription || null,
        location: location || null,
      },
    });

    return NextResponse.json(newEmployer, { status: 201 });
  } catch (error) {
    console.error("Error creating employer:", error);
    return NextResponse.json({ error: "Error creating employer" }, { status: 500 });
  }
}


export async function GET(request: Request) {
    try {
      // Obtener la sesión del usuario
      const session = await getSession({ req: { headers: Object.fromEntries(request.headers) } });
  
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
      }
  
      const employerId = session.user.id;
  
      // Buscar al employer en la base de datos
      const employer = await prisma.employer.findUnique({
        where: {
          id: employerId,
        },
        include: {
          jobs: true, // Incluir los trabajos asociados
        },
      });
  
      if (!employer) {
        return NextResponse.json({ error: 'Employer not found' }, { status: 404 });
      }
  
      // Construir el perfil del employer con los trabajos
      const profileData = {
        companyName: employer.companyName,
        industry: employer.industry || '',
        companySize: employer.companySize || '',
        location: employer.location || '',
        verified: employer.verified,
        jobs: employer.jobs.map((job) => ({
          id: job.id,
          title: job.title,
          description: job.description,
          requiredSkills: job.requiredSkills ? JSON.parse(JSON.stringify(job.requiredSkills)) : [],
          requirements: job.requirements ? JSON.parse(JSON.stringify(job.requirements)) : [],
          jobType: job.jobType || '',
          location: job.location || '',
          salaryRange: job.salaryRange || '',
          status: job.status,
          postedAt: job.postedAt,
          updatedAt: job.updatedAt,
        })),
      };
  
      return new NextResponse(JSON.stringify(profileData), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error processing employer profile:', error);
      return NextResponse.json(
        { error: 'An error occurred while fetching the employer profile' },
        { status: 500 }
      );
    }
  }