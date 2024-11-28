'use client'
import { useParams } from 'next/navigation';

export default function CandidatesPage() {
  const { id } = useParams();

    
  var candidates: any[] = [];
  async function fetchRankedJobs() {
    try {
        const response = await fetch('/api/student-job');
        if (response.ok) {
          const data = await response.json();
          const candidates = data;
        } else {
          const error = await response.json();
          console.log('Failed to fetch profile data:', error);
        }
      } catch (error) {
        console.log(error);
      }

  }
  
  

  fetchRankedJobs();
  

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
