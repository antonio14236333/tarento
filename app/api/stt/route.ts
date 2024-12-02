import OpenAI from "openai";
import { NextResponse } from 'next/server';
import { text } from "stream/consumers";

const openai = new OpenAI();

export async function POST(request: Request) {
  try {
    // Verifica y parsea el contenido del request
    const formData = await request.formData();
    const audioFile = formData.get('audio_file') as File;

    if (!audioFile || !(audioFile instanceof File)) {
      return NextResponse.json(
        { error: 'El archivo de audio es requerido y debe ser un archivo válido.' },
        { status: 400 }
      );
    }

    // Llama a la API de OpenAI para la transcripción
    const transcription = await openai.audio.transcriptions.create({
      model: "whisper-1", // Reemplaza "tts-1" con "whisper-1" si es más adecuado
      file: audioFile,
      response_format: "text",
    });
    
    return NextResponse.json({ text: transcription });

  } catch (error: any) {
    console.error('Error en el servidor:', error);
    return NextResponse.json(
      { error: 'Error en la transcripción de audio', details: error.message },
      { status: 500 }
    );
  }
}
