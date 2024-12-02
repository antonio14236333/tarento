import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Asegúrate de configurar tu API key.
});

export async function processAudioAndQuestion(audioFile: Blob | null, question: string, prevAnswer: string): Promise<string> {
  try {
    let esAmbi = true;
    let transcribedText = "";

    if (audioFile) {
      const transcriptionResponse = await openai.audio.transcriptions.create({
        model: "whisper-1", 
        file: new File([audioFile], "audio.wav", { type: audioFile.type, lastModified: Date.now() }),
        response_format: "text",
      });

      transcribedText = transcriptionResponse;
    }

    const systemPrompt = `
    Eres un asistente diseñado para garantizar que las respuestas del usuario sean completamente claras y sin ambigüedad. 
    Tu tarea es formular preguntas adicionales o solicitar detalles específicos si la respuesta es vaga, incompleta o ambigua. 
    
    Haz esta pregunta: "${question}". Evalúa la respuesta del usuario. Si la respuesta es:
    1. Clara y específica: Indica que no es ambigua regresando un "false".
    2. Ambigua, vaga o incompleta: Pide más detalles de manera educada y útil, sugiriendo ejemplos concretos o contexto adicional.
    
    Cuando determines que la respuesta del usuario es suficiente y no ambigua, responde "false" para terminar el ciclo de preguntas. 
    Tu objetivo es obtener una respuesta completa que no deje espacio para interpretaciones ambiguas.
    `;
    

    const chatMessages = [
      { role: "system" as const, content: systemPrompt },
      { role: "user" as const, content: prevAnswer },
      { role: "user" as const, content: transcribedText },
    ];

    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: chatMessages,
    });

    const responseText = gptResponse.choices[0].message?.content || "";

    if (responseText.includes("false")) {
      esAmbi = false;
    }

    return JSON.stringify({
      ambiguous: esAmbi,
      responseText: responseText,
      transcribedText: transcribedText
    });
  } catch (error: any) {
    console.error("Error en el procesamiento:", error);
    throw new Error(error.message || "Error desconocido durante el procesamiento.");
  }
}
