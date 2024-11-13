// src/app/voice-chat/page.tsx
'use client';

import { useState, useRef, useCallback } from 'react';

export default function VoiceChat() {
  const [isRecording, setIsRecording] = useState(false);
  const [response, setResponse] = useState('');
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      setError('');
      setResponse('');
      setTranscription('');
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });
      
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await sendAudioToAPI(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      setError('Error al acceder al micrófono. Por favor, verifica los permisos.');
      console.error('Error accessing microphone:', err);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const sendAudioToAPI = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob);

    try {
      setIsLoading(true);
      setError('');
      
      const res = await fetch('/api/chatgpt', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al procesar el audio');
      }

      const data = await res.json();
      setResponse(data.response);
      setTranscription(data.transcription);
      speakResponse(data.response);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al procesar la solicitud');
      console.error('Error al enviar audio a la API:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const speakResponse = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chat por voz con ChatGPT</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isLoading}
        className={`px-4 py-2 rounded-md ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white disabled:opacity-50`}
      >
        {isLoading ? 'Procesando...' : isRecording ? 'Detener grabación' : 'Iniciar grabación'}
      </button>

      {isRecording && (
        <p className="mt-2 text-sm text-gray-600">Grabando... Hable ahora</p>
      )}

      {transcription && (
        <div className="mt-4">
          <h2 className="font-semibold">Tu mensaje:</h2>
          <p className="text-gray-700">{transcription}</p>
        </div>
      )}

      {response && (
        <div className="mt-4">
          <h2 className="font-semibold">Respuesta de ChatGPT:</h2>
          <p className="text-gray-700">{response}</p>
        </div>
      )}
    </div>
  );
}