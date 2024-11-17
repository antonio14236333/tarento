// app/api/speech/route.ts

// Qpdo papi, esta madre no sale en un mes y medio
// Yoshi te manda saludos, tienes la bendicion del yoshi

import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


interface StudentProfile {
  fullName?: string;
  educationLevel?: string;
  careerStatus?: string;
  skills?: string[];
  experience?: {
    company: string;
    position: string;
    duration: string;
    description: string;
  }[];
  education?: {
    institution: string;
    degree: string;
    field: string;
    graduationYear: string;
  }[];
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
    const currentProfile = formData.get('profile');
    const isFirstMessage = formData.get('isFirstMessage') === 'true';

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

    let systemPrompt = `Eres Kero, un asistente de IA especializado en entrevistas laborales. Tu objetivo es completar el perfil del candidato haciendo preguntas específicas y relevantes.

Reglas:
1. Sé amigable y profesional
2. Haz una pregunta a la vez
3. Extrae información relevante de las respuestas
4. No preguntes información que ya tengas
5. Mantén las preguntas concisas
6. Si detectas que una respuesta es muy general, pide más detalles específicos

Formato del perfil:
- fullName: Nombre completo
- educationLevel: Nivel de educación (Bachillerato, Técnico, Universidad, Postgrado)
- careerStatus: Estado profesional actual (Estudiante, Buscando trabajo, Empleado)
- skills: Habilidades técnicas y blandas
- experience: Experiencia laboral (empresa, puesto, duración, descripción)
- education: Educación formal (institución, título, campo, año)
- location: Ubicación actual

Estado actual del perfil:
${currentProfile ? JSON.stringify(JSON.parse(currentProfile as string), null, 2) : "Perfil vacío"}`;

    if (isFirstMessage) {
      systemPrompt += '\nEste es el primer mensaje. Da la bienvenida y comienza la entrevista.';
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: transcription }
      ]
    });

    const responseText = completion.choices[0].message.content;

    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: responseText || ''
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    return NextResponse.json({
      transcription,
      response: responseText,
      audioBuffer: Array.from(buffer)
    });

  } catch (error) {
    console.error('Error detallado:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido en el servidor' },
      { status: 500 }
    );
  }
}