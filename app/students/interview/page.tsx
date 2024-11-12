'use client'
import React, { useState } from 'react';

export default function InterviewPage() {
  const [animationState, setAnimationState] = useState('normal');

  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center">
      <div className="parent">
        {[...Array(5)].map((_, index) => (
          <div key={index} className={`circle ${animationState}`} style={{
            animationDelay: `${-index * 0.8}s`
          }} />
        ))}
      </div>

      <div className="flex gap-4 mt-8">
        <button 
          onClick={() => setAnimationState('recording')}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Recording
        </button>
        <button 
          onClick={() => setAnimationState('normal')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Normal
        </button>
        <button 
          onClick={() => setAnimationState('talking')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Talking
        </button>
      </div>

      <style jsx>{`
        .parent {
          position: relative;
          width: 400px;  /* Ancho fijo igual que la altura */
          height: 400px; /* Altura fija igual que el ancho */
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

        /* Aseguramos que los botones estén centrados */
        .flex {
          justify-content: center;
        }
      `}</style>
    </div>
  );
}