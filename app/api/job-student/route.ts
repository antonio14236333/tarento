import {  NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';
import OpenAI from "openai";

const prisma = new PrismaClient();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  



export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    const jobId = (id);

    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      }
    });

    if (!job) {
      return NextResponse.json({ error: 'job not found' }, { status: 404 });
    }

    const estudiantes = await prisma.student.findMany();



    const ranking = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: "Por favor, procesa el siguiente perfil de trabajo (en formato JSON) y la lista de candidatos disponibles (también en formato JSON). Ordena la lista de candidatos según el mejor ajuste con el perfil del trabajo. Es importante que solo me devuelvas el JSON de los candidatos ordenados y nada más, sin comentarios adicionales." },
          { role: 'user', content: JSON.stringify(job) },
          { role: 'user', content: JSON.stringify(estudiantes) },
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

