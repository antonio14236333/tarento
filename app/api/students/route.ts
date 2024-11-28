import { NextRequest, NextResponse } from 'next/server';
import { NextApiRequest } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

interface Skill {
  name: string;
  level: string;
}

interface Experience {
  company: string;
  position: string;
  duration: string;
  description: string;
}

interface Education {
  institution: string;
  degree: string;
  field: string;
  graduationYear: string;
}

interface ProfileResponse {
  fullName: string;
  educationLevel: string;
  careerStatus: string;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  location?: string;
}



export async function GET(request: Request) {
  try {
    const session = await getSession({ req: { headers: Object.fromEntries(request.headers) } });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const userId = session.user.id;

    const user = await prisma.student.findUnique({
      where: {
        id: userId,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    
    const profileData: ProfileResponse = {
      fullName: user.fullName,
      educationLevel: user.educationLevel || '',
      careerStatus: user.careerStatus || '',
      location: user.location || undefined,
      skills: user.skills ? (JSON.parse(JSON.stringify(user.skills)) as Skill[]) : [],
      experience: user.experience ? (JSON.parse(JSON.stringify(user.experience)) as Experience[]) : [],
      education: JSON.parse(JSON.stringify(user.education)) as Education[],
    };

    
    return new NextResponse(JSON.stringify(profileData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
  } catch (error) {
    console.error('Error processing profile:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the profile' },
      { status: 500 }
    );
  }
}




export async function POST(req: NextRequest) {

  try {
    const body = await req.json(); 
    console.log("Received body:", body);

    const {
      email,
      passwordHash,
      fullName,
      educationLevel,
      careerStatus,
      skills,
      experience,
      education,
      location,
      profileStatus,
    } = body;

    const newStudent = await prisma.student.create({
      data: {
        email,
        passwordHash,
        fullName,
        educationLevel,
        careerStatus,
        skills: skills || null,
        experience: experience || null,
        education: education || null,
        location,
        profileStatus,
      },
    });

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json({ error: "Error creating student" }, { status: 500 });
  }
}


export async function PATCH(request: Request) {

  const session = await getSession({ req: { headers: Object.fromEntries(request.headers) } });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

  const userId = session.user.id;

  const body = await request.json();

  const updateUser = await prisma.student.update({
    where: {
      id: userId,
    },
    data: {
      fullName: body.fullName,      
      educationLevel: body.educationLevel,
      careerStatus: body.careerStatus,
      skills: JSON.parse(JSON.stringify(body.skills)),         
      experience: JSON.parse(JSON.stringify(body.experience)),            
      education: JSON.parse(JSON.stringify(body.education)),       
      location: body.location,      
      profileStatus: 'COMPLETE'   
    },
  })
  
  return NextResponse.json(updateUser, { status: 200 });
}