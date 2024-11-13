// src/app/api/chatgpt/route.ts
import { NextRequest, NextResponse } from 'next/server';
import FormData from 'form-data';
import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY no está configurada en las variables de entorno');
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio');

    if (!audioFile || !(audioFile instanceof Blob)) {
      return NextResponse.json(
        { error: 'Archivo de audio no proporcionado o formato incorrecto' }, 
        { status: 400 }
      );
    }
    
    const openAIFormData = new FormData();
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
    
    openAIFormData.append('file', audioBuffer, {
      filename: 'audio.wav',
      contentType: audioFile.type,
    });
    openAIFormData.append('model', 'whisper-1');

    
    const transcriptionResponse = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      openAIFormData,
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          ...openAIFormData.getHeaders(),
        },
      }
    );

    const transcribedText = transcriptionResponse.data.text;

    if (!transcribedText) {
      return NextResponse.json(
        { error: 'No se pudo transcribir el audio' },
        { status: 400 }
      );
    }

    
    const chatResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: transcribedText }],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const reply = chatResponse.data.choices[0].message.content;
    
    return NextResponse.json({ 
      response: reply,
      transcription: transcribedText 
    });

  } catch (error) {
    console.error('Error en la API de OpenAI:', error);
    
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.error?.message || 'Error al procesar la solicitud';
      
      return NextResponse.json(
        { error: errorMessage },
        { status: statusCode }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}