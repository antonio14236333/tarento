'use client'
import { useParams } from 'next/navigation';

export default function CandidatesPage() {
  const { id } = useParams();

  // Simula la obtención de candidatos para el trabajo
  const candidates = [
    { id: 1, name: 'Alice', experience: '3 years', skills: ['React', 'Node.js'] },
    { id: 2, name: 'Bob', experience: '5 years', skills: ['Python', 'Django'] },
  ];

  return (
    <div className="container">
      <h1 className="title">Candidates for Job {id}</h1>
      <ul className="list">
        {candidates.map((candidate) => (
          <li key={candidate.id} className="box mb-4">
            <h2 className="subtitle">{candidate.name}</h2>
            <p>Experience: {candidate.experience}</p>
            <p>Skills: {candidate.skills.join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
