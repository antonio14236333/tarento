'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Mic, Square } from 'lucide-react';

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

export default function AnimatedVoiceChat() {
  const [isRecording, setIsRecording] = useState(false);
  const [response, setResponse] = useState('');
  const [displayedResponse, setDisplayedResponse] = useState('');
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [animationState, setAnimationState] = useState('normal');
  const [profile, setProfile] = useState<StudentProfile>({});
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const typingSpeedRef = useRef(50);

  // Efecto de escritura
  useEffect(() => {
    if (response && !isTyping) {
      setIsTyping(true);
      setDisplayedResponse('');
      let currentIndex = 0;
      
      const typingInterval = setInterval(() => {
        if (currentIndex < response.length) {
          setDisplayedResponse(prev => prev + response[currentIndex]);
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, typingSpeedRef.current);

      return () => clearInterval(typingInterval);
    }
  }, [response]);

  const startInitialInteraction = () => {
    setHasStarted(true);
    const welcomeMessage = '¡Bienvenido! Soy Kira, tu asistente virtual inteligente. Estoy aquí para ayudarte y conversar contigo. ¿En qué puedo ayudarte hoy?';
    setResponse(welcomeMessage);
    playTTS(welcomeMessage);
  };

  const playTTS = async (text: string) => {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en la síntesis de voz');
      }
  
      const arrayBuffer = await response.arrayBuffer();
      const audioBlob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      await new Promise((resolve, reject) => {
        audio.onended = resolve;
        audio.onerror = reject;
        audio.play().catch(reject);
      });
  
      URL.revokeObjectURL(audioUrl);
    } catch (err) {
      console.log('Error en la síntesis de voz:', err);
    }
  };

  const startRecording = useCallback(async () => {
    if (!hasStarted) {
      startInitialInteraction();
      return;
    }

    try {
      setError('');
      setResponse('');
      setDisplayedResponse('');
      setTranscription('');
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
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
        const mp3Blob = new Blob([audioBlob], { type: 'audio/mp3' });
        await processAudio(mp3Blob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      setError('Error al acceder al micrófono. Por favor, verifica los permisos.');
    }
  }, [hasStarted]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const processAudio = async (recordedAudio: Blob) => {
    try {
      setIsLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('audio', recordedAudio);
      formData.append('profile', JSON.stringify(profile));
      formData.append('isFirstMessage', String(isFirstMessage));

      const response = await fetch('/api/speech/', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Error en el servidor');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setTranscription(data.transcription);
      setResponse(data.response);
      setIsFirstMessage(false);

      
      if (data.updatedProfile) {
        setProfile(data.updatedProfile);
      }

      
      const audioBuffer = new Uint8Array(data.audioBuffer);
      const audioBlob = new Blob([audioBuffer], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      await audio.play();

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al procesar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  const renderProfile = () => {
    if (Object.keys(profile).length === 0) return null;
    return (
      <div className="mt-4 p-4 bg-gray-700 rounded-lg text-white max-w-2xl w-full">
        <h2 className="font-semibold mb-2">Perfil actual:</h2>
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(profile, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center p-4">
      <div className="parent mb-8">
        {[...Array(5)].map((_, index) => (
          <div key={index} className={`circle ${animationState}`} style={{
            animationDelay: `${-index * 0.8}s`
          }} />
        ))}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-2xl w-full">
          <p>{error}</p>
        </div>
      )}
      
      <div className="flex gap-4 mb-8">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isLoading}
          className={`flex items-center gap-2 px-6 py-3 rounded-md text-white ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : isRecording 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          {isLoading 
            ? 'Procesando...' 
            : isRecording 
              ? 'Detener grabación' 
              : hasStarted 
                ? 'Presionar para hablar' 
                : 'Comenzar'}
        </button>
      </div>

      {renderProfile()}

      {transcription && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg text-white max-w-2xl w-full">
          <h2 className="font-semibold mb-2">Tu mensaje:</h2>
          <p>{transcription}</p>
        </div>
      )}

      {response && (
        <div className="mt-4 p-4 bg-blue-900 rounded-lg text-white max-w-2xl w-full">
          <h2 className="font-semibold mb-2">Respuesta:</h2>
          <p>
            {displayedResponse}
            {isTyping && <span className="animate-pulse">▋</span>}
          </p>
        </div>
      )}

      <style jsx>{`
        .parent {
          position: relative;
          width: 400px;
          height: 400px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .circle {
          width: 50px;
          height: 50px;
          background-color: #3fa9f5a8;
          border-radius: 50%;
          position: absolute;
          animation: spin 4s infinite linear;
          offset-path: circle(100px at center);
          transition: offset-path 0.5s ease-in-out;
        }

        .circle.talking {
          offset-path: circle(150px at center);
        }

        .circle.recording {
          offset-path: circle(50px at center);
          background-color: #f53f3fa8;
        }

        @keyframes spin {
          from {
            offset-distance: 0%;
          }
          to {
            offset-distance: 100%;
          }
        }
      `}</style>
    </div>
  );
}