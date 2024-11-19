'use client'
import React, { useState, useEffect, useRef } from 'react';
import { JSX } from 'react';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

type AnimationState = 'normal' | 'recording' | 'talking';

export default function InterviewPage(): JSX.Element {
  const [animationState, setAnimationState] = useState<AnimationState>('normal');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([{
    role: "system",
    content: "You are a helpful professional interviewer. Keep your responses concise and engaging."
  }]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    async function initializeRecorder(): Promise<void> {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.ondataavailable = (e: BlobEvent) => {
          chunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/mp3' });
          await handleAudioSubmission(audioBlob);
          chunksRef.current = [];
        };

        mediaRecorderRef.current = mediaRecorder;
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
    }

    initializeRecorder();
  }, []);

  const startRecording = (): void => {
    if (mediaRecorderRef.current?.state === 'inactive') {
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setAnimationState('recording');
    }
  };

  const stopRecording = (): void => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setAnimationState('normal');
    }
  };

  const handleAudioSubmission = async (audioBlob: Blob): Promise<void> => {
    const formData = new FormData();
    formData.append('audioFile', audioBlob);

    try {
      
      const transcriptionResponse = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData
      });
      const { text } = await transcriptionResponse.json();

      
      const chatResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user' as const, content: text }]
        })
      });
      const { response } = await chatResponse.json();
      
      setMessages(prev => [...prev, 
        { role: 'user' as const, content: text },
        response as Message
      ]);

      
      setAnimationState('talking');
      const ttsResponse = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: response.content })
      });

      const audioBlob = await ttsResponse.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setAnimationState('normal');
      };
      
      await audio.play();
    } catch (error) {
      console.error('Error processing audio:', error);
      setAnimationState('normal');
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center">
      <div className="parent">
        {[...Array(5)].map((_, index) => (
          <div 
            key={index} 
            className={`circle ${animationState}`} 
            style={{
              animationDelay: `${-index * 0.8}s`
            }} 
          />
        ))}
      </div>

      <div className="flex gap-4 mt-8">
        <button 
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-4 py-2 ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-green-500 hover:bg-green-600'
          } text-white rounded transition-colors`}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>


      <div className="mt-8 w-full max-w-2xl px-4 space-y-4 max-h-60 overflow-y-auto">
        {messages.slice(1).map((message, index) => (
          <div 
            key={index}
            className={`p-4 rounded-lg ${
              message.role === 'user' 
                ? 'bg-blue-500 ml-auto' 
                : 'bg-gray-700 mr-auto'
            } max-w-[80%] text-white`}
          >
            {message.content}
          </div>
        ))}
      </div>

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