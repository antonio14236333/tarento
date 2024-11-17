// app/api/tts/route.ts

// Esta madre puede ser optimizada usando la api de completion con audio incluido
// pero ta densa la cosa, si te la quieres rifar ya sabes
// teoricamente harias las consultas mas rapidas y maybe diria el rafa reduces la complejidad

import OpenAI from "openai";
import { NextResponse } from 'next/server';

const openai = new OpenAI();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { text } = data;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Se requiere un texto válido' }, 
        { status: 400 }
      );
    }

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: text,
    });

    const audioData = await mp3.arrayBuffer();
    
    return new NextResponse(audioData, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioData.byteLength.toString(),
      },
    });

  } catch (error: any) {
    console.error('Error en el servidor:', error);
    return NextResponse.json(
      { error: 'Error en la síntesis de voz', details: error.message },
      { status: 500 }
    );
  }
}