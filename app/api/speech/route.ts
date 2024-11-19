// app/api/speech/route.ts

// Qpdo papi, esta madre no sale en un mes y medio
// Yoshi te manda saludos, tienes la bendicion del yoshi

import OpenAI from "openai";
import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const history: { transcription: string; responseText: string; }[] = [];

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

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key no configurada' },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio');
    const isFirstMessage = formData.get('isFirstMessage') === 'true';

    const currentProfile = JSON.parse(formData.get('profile') as string) as ProfileResponse;
 
    console.log(formData.get('profile'));
    console.log(currentProfile);
    console.log(currentProfile.fullName);

    if (!audioFile || !(audioFile instanceof Blob)) {
      return NextResponse.json(
        { error: 'No se proporcionó un archivo de audio válido' },
        { status: 400 }
      );
    }

    const file = new File([audioFile], 'audio.mp3', { 
      type: 'audio/mp3'
    });
    
    const transcription = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      response_format: 'text'
    });

    const systemPrompt = `
 Eres Kero, un asistente de IA especializado en entrevistas laborales. Tu objetivo es crear un perfil profesional preciso en formato JSON basándote en las respuestas del entrevistado. Realiza preguntas detalladas para obtener la información necesaria y completa el siguiente JSON:

{
  "fullName": "string",
  "educationLevel": "string",
  "careerStatus": "string",
  "skills": [{"name": "string", "level": "string"}],
  "experience": [{
    "company": "string",
    "position": "string",
    "duration": "string",
    "description": "string"
  }],
  "education": [{
    "institution": "string",
    "degree": "string",
    "field": "string",
    "graduationYear": "string"
  }],
  "location": "string"
}



Cuando termines de recopilar toda la información, genera un JSON con los datos proporcionados. No añadas comentarios ni explicaciones al final, solo devuelve el JSON completo con los datos recopilados.
estes es un ejemplo de como se veria el json final:




{
  "fullName": "Antonio Gonzalez",
  "educationLevel": "Universidad (en curso)",
  "careerStatus": "Intern de Justicia",
  "skills": [
    {
      "name": "Liderazgo",
      "level": "Experto"
    }
  ],
  "experience": [
    {
      "company": "Justicia",
      "position": "Intern",
      "duration": "Actualidad",
      "description": "Trabajo como intern en el departamento de Justicia"
    }
  ],
  "education": [
    {
      "institution": "Universidad Autónoma de Zacatecas",
      "degree": "Ingeniería de Software",
      "field": "Software",
      "graduationYear": "En curso"
    }
  ],
  "location": "Osaka, Japón"
}
para cerrar la conversacoin solo imprime el json sin decir nada y sin agradecer
    `;

console.log(history);


    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'assistant', content: "¡Bienvenido! Soy Kira, tu asistente virtual inteligente. Estoy aquí para ayudarte y conversar contigo para realizar tu perfil como talento. ¿Estás listo para comenzar?" },
        ...history.flatMap(({ transcription, responseText }) => [
          { role: 'user' as const, content: transcription },
          { role: 'assistant' as const, content: responseText }
        ])
      ]
    });

    const responseText = completion.choices[0].message.content;


    if (responseText && responseText.trim().startsWith('{')) {
      // Intentar parsear la respuesta como JSON
      try {

        console.log(JSON.parse(responseText));
        const updatedProfile = JSON.parse(responseText) as ProfileResponse;

        console.log("Aqui estoy subiendo la data a la db");

        const prisma = new PrismaClient();

        const response = await fetch(`/api/user`);
        const profile = await response.json();

        // await prisma.student.update({
        //   where: { id: profile.id },
        //   data: { 
        //     fullName: updatedProfile.fullName,      
        //     educationLevel: updatedProfile.educationLevel,
        //     careerStatus: updatedProfile.careerStatus,
        //     skills: updatedProfile.skills,                
        //     experience: updatedProfile.experience,             
        //     education: updatedProfile.education,
        //     location: updatedProfile.location,      
        //     profileStatus: 'COMPLETE'   
        //   },

        // });


        // Actualizar la base de datos con updatedProfile
        // Por ejemplo, si usas Prisma:
        // const prisma = new PrismaClient();
        // await prisma.user.update({
        //   where: { id: userId },
        //   data: { profile: updatedProfile },
        // });

        // También puedes actualizar currentProfile localmente
        // currentProfile = updatedProfile;

        // Generar una respuesta al usuario
        const finalResponse = 'Tu perfil ha sido actualizado exitosamente. En unos segnudos te mostraremos el mejor trabajo para ti.';

        // Generar el audio de respuesta
        const mp3 = await openai.audio.speech.create({
          model: 'tts-1',
          voice: 'nova',
          input: finalResponse
        });

        const buffer = Buffer.from(await mp3.arrayBuffer());

        return NextResponse.json({
          transcription,
          response: finalResponse,
          audioBuffer: Array.from(buffer),
          updatedProfile 
          
        });

      } catch (error) {
        
        console.error('Error al parsear el JSON:', error);

        
        const errorResponse = 'Hubo un problema al actualizar tu perfil. Por favor, intenta nuevamente.';

        const mp3 = await openai.audio.speech.create({
          model: 'tts-1',
          voice: 'nova',
          input: errorResponse
        });

        const buffer = Buffer.from(await mp3.arrayBuffer());

        return NextResponse.json({
          transcription,
          response: errorResponse,
          audioBuffer: Array.from(buffer)
        });
      }
    } else {

    history.push({ transcription, responseText: responseText || '' });

    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'nova',
      input: responseText || ''
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    return NextResponse.json({
      transcription,
      response: responseText,
      audioBuffer: Array.from(buffer)
    });

  }
      } catch (error) {
      console.error('Error detallado:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Error desconocido en el servidor' },
        { status: 500 }
      );
    }
}