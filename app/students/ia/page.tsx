'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Mic, Square, Play } from 'lucide-react';
import 'bulma/css/bulma.min.css';
import { compare } from 'bcryptjs';

interface StudentResponse {
  question: string;
  audioBlob: Blob;
  transcription?: string;
}

const preguntasPerfilEstudiante = [
  "Hola, soy Kero, voy a hacerte algunas preguntas para crear tu perfil. ¿Me podrías decir tu nombre completo?",
  "¿Cuál es tu dirección de correo electrónico?",
  "¿Cuál es tu nivel de educación? (Por ejemplo, secundaria, licenciatura, maestría), indica fecha de graduacion",
  "¿Cuál es tu situación profesional actual? (Por ejemplo, empleado, desempleado, estudiante)",
  "Enumera tus habilidades y para cada una indica tu nivel de dominio. (Por ejemplo, Python - Avanzado, Excel - Intermedio)",
  "¿Tienes experiencia laboral previa?, ",
  "¿Cuál es tu historial educativo?",
  "¿Dónde te encuentras ubicado actualmente?",
];

const OrbitControls = () => {
  const [orbitState, setOrbitState] = useState('normal');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  let historical: string = "";
  const [responses, setResponses] = useState<StudentResponse[]>([]);
  const [transcription, setTranscription] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const playTTS = async (text: string) => {
    
    try {
      
      setOrbitState('talking');

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Error en la síntesis de voz');
      }

      const arrayBuffer = await response.arrayBuffer();
      const audioBlob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      await new Promise((resolve, reject) => {
        audio.onended = () => {
          setOrbitState('normal');
          resolve(true);
        };
        audio.onerror = reject;
        audio.play().catch(reject);
      });

      URL.revokeObjectURL(audioUrl);
    } catch (err) {
      console.error('Error en la síntesis de voz:', err);
      setOrbitState('normal');
    }
  };

  const startRecording = useCallback(async () => {
    try {
      setError('');
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
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);
      setOrbitState('recording');
    } catch (err) {
      setError('Error al acceder al micrófono. Por favor, verifica los permisos.');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setOrbitState('normal');
    }
  }, [isRecording]);

  const processAudio = async (recordedAudio: Blob) => {
    try {
      setIsLoading(true);
      setError('');
  
      const audioFile = new File([recordedAudio], 'recording.wav', {
        type: 'audio/wav'
      });
  
      const formData = new FormData();
      formData.append('audio_file', audioFile);
  
      const response = await fetch('/api/stt', {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en el servidor');
      }
  
      const data = await response.json();
  
      if (data.error) {
        throw new Error(data.error);
      }
  
      setTranscription(data.text);
  
      // Guardar la respuesta actual
      const newResponse: StudentResponse = {
        question: preguntasPerfilEstudiante[currentQuestionIndex],
        audioBlob: recordedAudio,
        transcription: data.text
      };

      historical = historical + ' ' + data.text;

      console.log('Historial:', data.text);
  
      setResponses(prev => [...prev, newResponse]);

      console.log(currentQuestionIndex, newResponse);
  
      // Verificar si es la última pregunta
      if (currentQuestionIndex === preguntasPerfilEstudiante.length - 1) {
        setIsComplete(true);

        const conversation = historical;

        const response = await fetch('/api/speech', {
          method: 'POST',
          body: conversation,
        });

        console.log('response:', response);
        console.log('historical:', historical);
        
  
        if (!response.ok) {
          throw new Error('Error en el servidor');
        }

        const data = await response.json();

        console.log('Perfil del estudiante:', data);

        try {
            const updateStudentResponse: Response = await fetch('/api/students', {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: data,
            });
            console.log('updateStudent:', updateStudentResponse);
            if (updateStudentResponse.ok) {
              const updatedUser = await updateStudentResponse.json();
              console.log('Profile updated successfully:', updatedUser);
   
            } else {
              const error = await updateStudentResponse.json();
              console.error('Failed to update profile:', error);
            }
          } catch (error) {
            console.error('Error:', error);
          }
        
        

        await playTTS("Gracias por completar el cuestionario, presiona ver perfil para ver tus respuestas. Espera un momento por favor.");

        handleComplete();
      } else {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setTimeout(() => {
          const nextQuestion = preguntasPerfilEstudiante[nextIndex];
          playTTS(nextQuestion);
        }, 1000);
      }
  
    } catch (error) {
      console.error('Error en processAudio:', error);
      setError(error instanceof Error ? error.message : 'Error al procesar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  const playNextQuestion = async () => {
    const question = preguntasPerfilEstudiante[currentQuestionIndex];
    await playTTS(question);
  };

  const handleStart = async () => {
    setHasStarted(true);
    await playNextQuestion();
  };

  const handleComplete = () => {
    console.log('Respuestas completas:', responses);
  };

  return (
    <section className="section has-background-dark">
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-8">
            <div className="box has-background-black-bis">
              {/* Orbit Animation */}
              <div className="parent mb-5">
                {[...Array(5)].map((_, index) => (
                  <div 
                    key={index} 
                    className={`circle ${orbitState}`} 
                    style={{
                      animationDelay: `${-index * 0.8}s`
                    }} 
                  />
                ))}
              </div>

              {hasStarted && !isComplete && (
                <div className="box has-background-info-dark has-text-white mb-5">
                  <h2 className="title is-4 has-text-white">
                    Pregunta {currentQuestionIndex + 1} de {preguntasPerfilEstudiante.length}
                  </h2>
                  <p className="subtitle has-text-white">
                    {preguntasPerfilEstudiante[currentQuestionIndex]}
                  </p>
                  {transcription && (
                    <div className="mt-4 p-4 has-background-black-ter">
                      <p className="is-family-monospace">{transcription}</p>
                    </div>
                  )}
                </div>
              )}

              {isComplete && (
                <div className="box has-background-success-dark has-text-white mb-5">
                  <h2 className="title is-4 has-text-white">
                    ¡Cuestionario Completado!
                  </h2>
                  <p className="subtitle has-text-white">
                    Gracias por completar todas las preguntas.
                  </p>
                </div>
              )}

              {error && (
                <div className="notification is-danger">
                  {error}
                </div>
              )}

              <div className="buttons is-centered mb-5">
                {!hasStarted ? (
                  <button
                    onClick={handleStart}
                    className="button is-primary is-large has-text-weight-bold"
                  >
                    Comenzar Cuestionario
                  </button>
                ) : !isComplete && (
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isLoading}
                    className={`button ${isRecording ? 'is-danger is-outlined' : 'is-danger'} has-text-weight-bold`}
                  >
                    <span className="icon">
                      {isRecording ? <Square /> : <Mic />}
                    </span>
                    <span>{isRecording ? 'Detener Grabación' : 'Grabar Respuesta'}</span>
                  </button>
                )}
              </div>

              {hasStarted && !isComplete && (
                <progress 
                  className="progress is-info" 
                  value={currentQuestionIndex} 
                  max={preguntasPerfilEstudiante.length - 1}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .parent {
          position: relative;
          width: 400px;
          height: 400px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 auto;
        }

        .circle {
          width: 50px;
          height: 50px;
          background-color: #3fa9f5a8;
          border-radius: 50%;
          position: absolute;
          animation: spin 4s infinite linear;
          offset-path: circle(100px at center);
          transition: all 0.5s ease-in-out;
        }

        .circle.talking {
          offset-path: circle(150px at center);
          background-color: #3fa9f5a8;
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

        @media screen and (max-width: 768px) {
          .parent {
            width: 300px;
            height: 300px;
          }
          
          .circle {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </section>
  );
};

export default OrbitControls;