import {  NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';
import OpenAI from "openai";

const prisma = new PrismaClient();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  

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

    const jobs = await prisma.job.findMany();


    const ranking = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: "Por favor, procesa el siguiente perfil de estudiante (en formato JSON) y la lista de trabajos disponibles (también en formato JSON). Ordena la lista de trabajos según el mejor ajuste con el perfil del estudiante. Es importante que solo me devuelvas el JSON de los trabajos ordenados y nada más, sin comentarios adicionales." },
          { role: 'user', content: JSON.stringify(profileData) },
          { role: 'user', content: JSON.stringify(jobs) },
        ]
      });

      const content = ranking.choices[0].message.content;
      if (!content) {
        throw new Error('OpenAI response content is null');
      }
      const resultRanking = JSON.parse(content); 
      
      console.log(resultRanking);
    
    return NextResponse.json(resultRanking);
    
  } catch (error) {
    console.error('Error processing profile:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the profile' },
      { status: 500 }
    );
  }
}

