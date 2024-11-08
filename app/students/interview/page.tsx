'use client'
import React from 'react';

export default function InterviewPage() {
  return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <style jsx>{`
.parent {
  position: relative;
  width: 80px;
  height: 80px;
  margin: auto;
}

.parent {
  height: 70vh;
  display: flex;
}
.parent .circle {
  width: 50px;
  height: 50px;
  offset-path: circle(5px at center);
  animation: spin 4s infinite linear, expandCircle 2s infinite alternate ease-out;
  animation-composition: accumulate, replace;
  position: absolute;
  inset: 0;
  margin: auto;
}

@keyframes spin {
  0% {
    offset-distance: 0;
  }
  100% {
    offset-distance: 100%;
  }
}

@keyframes expandCircle {
  0% {
     offset-path: circle(5px at center);
  }
  100% {
     offset-path: circle(100px at center);
  }
}

.circle:nth-child(1) {
  offset-distance: 20%;
}

.circle:nth-child(2) {
  offset-distance: 40%;
}

.circle:nth-child(3) {
  offset-distance: 60%;
}

.circle:nth-child(4) {
  offset-distance: 80%;
}

.circle{
  background-color: #3fa9f5a8;
  
  border-radius: 50%;
  }

      `}</style>
      
      <div className="parent">
        
        
        <div className='circle'/>
        <div className='circle'/>
        <div className='circle'/>
        <div className='circle'/>
        <div className='circle'/>
      </div>
    </div>
  );
}