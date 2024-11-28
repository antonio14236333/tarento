// app/api/speech/route.ts

// Qpdo papi, esta madre no sale en un mes y medio
// Yoshi te manda saludos, tienes la bendicion del yoshi

import OpenAI from "openai";
import { NextResponse } from "next/server";
import { Prisma, PrismaClient } from '@prisma/client';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const history: { transcription: string; responseText: string; }[] = [];


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
Eres Kero, un asistente de IA especializado en entrevistas laborales. Tu objetivo es crear un perfil profesional completo y preciso en formato JSON basado en las respuestas del entrevistado. Realiza preguntas claras, específicas y solo una vez, siguiendo un orden lógico y natural. No repitas preguntas ni insistas, pero verifica si alguna respuesta no es clara o está incompleta para pedir detalles adicionales. Usa siempre un tono amigable y profesional. Todas las preguntas, respuestas y el JSON deben ser exclusivamente en español. Al finalizar, genera el JSON sin comentarios ni explicaciones adicionales.

Formato JSON esperado:
json
Copiar código
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
Estrategia de entrevista:
Haz las preguntas siguiendo un flujo natural, como si fuera una conversación laboral.
Pregunta una sola vez cada tema, evitando repeticiones innecesarias.
Si una respuesta es ambigua o incompleta, solicita únicamente las aclaraciones necesarias.
Genera el JSON con la información recopilada al final de la entrevista, sin agregar texto adicional.
Preguntas (en español):
Inicio: "Hola, gracias por estar aquí. Para comenzar, ¿me podrías decir tu nombre completo?"
Educación: "¿Cuál es tu nivel educativo más alto? Por ejemplo: Primaria, Secundaria, Preparatoria o Universidad."
Situación profesional: "¿Cuál es tu situación profesional actual? ¿Estás empleado, buscando trabajo o eres estudiante?"
Habilidades: "Hablemos ahora de tus habilidades. ¿Qué habilidades destacadas tienes y cómo calificarías tu nivel en cada una? Por ejemplo: 'Liderazgo - Intermedio' o 'Programación - Avanzado'."
Experiencia laboral: "¿Puedes contarme sobre tu experiencia laboral? Incluye el nombre de la empresa, tu cargo, la duración y una breve descripción de tus actividades."
Historial educativo: "Sobre tu formación académica, ¿podrías darme más detalles? Como el nombre de la institución, el grado académico, el campo de estudio y el año de graduación."
Residencia: "Por último, ¿en dónde resides actualmente? Por favor, indica ciudad y país."
Ejemplo de JSON final:
json
Copiar código
{
  "fullName": "Antonio González",
  "educationLevel": "Universidad (en curso)",
  "careerStatus": "Empleado",
  "skills": [
    {
      "name": "Liderazgo",
      "level": "Intermedio"
    },
    {
      "name": "Programación",
      "level": "Avanzado"
    }
  ],
  "experience": [
    {
      "company": "ABC Corp",
      "position": "Desarrollador de Software",
      "duration": "2 años",
      "description": "Diseño y desarrollo de aplicaciones web"
    }
  ],
  "education": [
    {
      "institution": "Universidad Nacional",
      "degree": "Licenciatura",
      "field": "Ingeniería en Sistemas",
      "graduationYear": "2023"
    }
  ],
  "location": "Ciudad de México, México"
}
Reglas finales:
Realiza las preguntas una sola vez, en orden, con un tono amigable y natural.
Si es necesario, aclara únicamente los puntos que no sean claros o estén incompletos.
Al finalizar, genera el JSON en el formato exacto, sin texto adicional.
No agradezcas ni cierres la conversación, solo imprime el JSON.
 `;


    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'assistant', content: "¡Bienvenido! Soy Kira, tu asistente virtual inteligente. Estoy aquí para ayudarte y conversar contigo para realizar tu perfil como talento. ¿Estás listo para comenzar?" },
        { role: 'user', content: transcription },
        ...history.flatMap(({ transcription, responseText }) => [
          { role: 'user' as const, content: transcription },
          { role: 'assistant' as const, content: responseText }
        ])
      ]
    });

    
for (const entry of history) {
  console.log(`{role: 'user', content: ${entry.transcription}}`);
  console.log(`{role: 'assistant', content: ${entry.responseText}}`);
}


    const responseText = completion.choices[0].message.content;

//       const responseText = `
//       {
//   "fullName": "No proporcionado",
//   "educationLevel": "Universidad (en curso)",
//   "careerStatus": "Practicante profesional",
//   "skills": [
//     {
//       "name": "Desarrollo web",
//       "level": "Avanzado"
//     },
//     {
//       "name": "Django",
//       "level": "Avanzado"
//     },
//     {
//       "name": "Byte",
//       "level": "Avanzado"
//     },
//     {
//       "name": "Next.js",
//       "level": "Avanzado"
//     },
//     {
//       "name": "Frontera",
//       "level": "Avanzado"
//     },
//     {
//       "name": "Balcón",
//       "level": "Avanzado"
//     }
//   ],
//   "experience": [
//     {
//       "company": "Justia",
//       "position": "Practicante",
//       "duration": "Desde septiembre de 2022",
//       "description": "Creación de Landing Pages."
//     }
//   ],
//   "education": [
//     {
//       "institution": "Universidad Autónoma de Zacatecas",
//       "degree": "Ingeniería de Software",
//       "field": "Software",
//       "graduationYear": "2026"
//     }
//   ],
//   "location": "Osaka, Japón"
// }
//       `;
      
//        const transcription = '';

    if (responseText && responseText.trim().startsWith('{')) {
      // Intentar parsear la respuesta como JSON
      try {

        console.log(JSON.parse(responseText));
        const updatedProfile = JSON.parse(responseText);

        console.log("Aqui estoy subiendo la data a la db");


        const response = await fetch(`/api/students`);
        const profile = await response.json();



        const updateProfile = await fetch(`/api/students`, {
          method: 'PATCH',
          body: JSON.parse(responseText),
        });

        console.log("Aqui estoy subiendo la data a la db");


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