import OpenAI from "openai";
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function adaptConversationToJSON(conversation: string): Promise<string> {
  try {
    const systemPrompt = `
    
    "${conversation}"
    
    lee eso y adaptalo a esto, si no contiene la info dejalo en blanco
    {
  "fullName": "",
  "educationLevel": "",
  "careerStatus": "",
  "skills": [
    {
      "name": "",
      "level": ""
    }
  ],
  "experience": [
    {
      "company": "",
      "position": "",
      "duration": "",
      "description": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "graduationYear": ""
    }
  ],
  "location": ""
}    
    Devuelve solo el JSON adaptado.
    `;

    const chatMessages = [
      { role: "system" as const, content: systemPrompt },
      { role: "user" as const, content: conversation },
    ];

    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: chatMessages,
      temperature: 0, // Hace que el modelo sea más determinista
      max_tokens: 1000, // Limita la longitud de la respuesta
      top_p: 0.1, // Reduce la creatividad del modelo
      frequency_penalty: 0, // Evita que varíe su vocabulario
      presence_penalty: 0
    });

    const responseText = gptResponse.choices[0].message?.content || "";

    return responseText;
  } catch (error: any) {
    console.error("Error en el procesamiento:", error);
    throw new Error(error.message || "Error desconocido durante el procesamiento.");
  }
}

export async function POST(request: Request) {
  try {
    const conversation = await request.text();
    
    if (!conversation) {
      return NextResponse.json(
        { error: 'No se proporcionó contenido de conversación' },
        { status: 400 }
      );
    }

    const jsonResponse = await adaptConversationToJSON(conversation);
    
    return NextResponse.json(jsonResponse);
  } catch (error: any) {
    console.error('Error en el servidor:', error);
    return NextResponse.json(
      { error: 'Error al procesar la conversación', details: error.message },
      { status: 500 }
    );
  }
}