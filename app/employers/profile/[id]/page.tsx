'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function CandidatesPage() {
  const { id } = useParams();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRankedJobs() {
      try {
        const response = await fetch('/api/job-student', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
          });
        if (response.ok) {
          const data = await response.json();
          setCandidates(Array.isArray(data) ? data : [data]);
        } else {
          setError('Failed to fetch candidates');
        }
      } catch (err) {
        setError(`Error: ${err}`);
      } finally {
        setLoading(false);
      }
    }
    fetchRankedJobs();
  }, []);

  if (loading) {
    return (
      <div className="hero is-fullheight">
        <div className="hero-body">
          <div className="container has-text-centered">
            <div className="button is-loading is-large is-white"></div>
            <p className="mt-4 has-text-grey">Loading candidates...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hero is-fullheight">
        <div className="hero-body">
          <div className="container has-text-centered">
            <div className="box has-background-danger-light p-6">
              <span className="icon has-text-danger is-large">
                <i className="fas fa-exclamation-triangle fa-2x"></i>
              </span>
              <p className="has-text-danger mt-4 is-size-5">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <div className="has-text-centered mb-6">
          <h1 className="title is-2">Candidates for Position</h1>
          <p className="subtitle is-4">
            Job ID: <span className="has-text-info">#{id}</span>
          </p>
        </div>

        <div className="columns is-multiline">
          {candidates.map((candidate, index) => (
            <div key={index} className="column is-4">
              <div className="card hover-card">
                <div className="card-content">
                  {/* Header */}
                  <div className="media">
                    <div className="media-left">
                      <span className="icon is-large has-background-info has-text-white p-3" style={{borderRadius: '50%'}}>
                        <i className="fas fa-user fa-lg"></i>
                      </span>
                    </div>
                    <div className="media-content">
                      <p className="title is-4">{candidate.fullName}</p>
                      <p className="subtitle is-6 has-text-info">{candidate.careerStatus}</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="mb-4 is-flex is-align-items-center">
                    <span className="icon has-text-grey mr-2">
                      <i className="fas fa-map-marker-alt"></i>
                    </span>
                    <span className="has-text-grey">{candidate.location}</span>
                  </div>

                  {/* Education */}
                  <div className="mb-5">
                    <p className="is-size-6 has-text-weight-semibold has-text-grey-dark mb-2">
                      <span className="icon-text">
                        <span className="icon has-text-info">
                          <i className="fas fa-graduation-cap"></i>
                        </span>
                        <span>Education</span>
                      </span>
                    </p>
                    {candidate.education?.map((edu: any, idx: number) => (
                      <div key={idx} className="mb-2">
                        <p className="has-text-weight-medium">{edu.degree}</p>
                        <p className="is-size-7 has-text-grey">{edu.institution}</p>
                      </div>
                    ))}
                  </div>

                  {/* Skills */}
                  <div className="mb-5">
                    <p className="is-size-6 has-text-weight-semibold has-text-grey-dark mb-2">
                      <span className="icon-text">
                        <span className="icon has-text-info">
                          <i className="fas fa-code"></i>
                        </span>
                        <span>Skills</span>
                      </span>
                    </p>
                    <div className="tags">
                      {candidate.skills?.map((skill: any, idx: number) => (
                        <span key={idx} className="tag is-info is-light">
                          {skill.name} • {skill.level}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <p className="is-size-6 has-text-weight-semibold has-text-grey-dark mb-2">
                      <span className="icon-text">
                        <span className="icon has-text-info">
                          <i className="fas fa-briefcase"></i>
                        </span>
                        <span>Experience</span>
                      </span>
                    </p>
                    {candidate.experience?.map((exp: any, idx: number) => (
                      <div key={idx} className="experience-item">
                        <p className="has-text-weight-medium">{exp.position}</p>
                        <p className="has-text-grey">{exp.company}</p>
                        <p className="is-size-7 has-text-grey-light">{exp.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .hover-card {
          transition: all 0.3s ease;
          border: 1px solid #dbdbdb;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(10, 10, 10, 0.1);
        }
        .experience-item {
          padding: 1rem 0;
          border-left: 2px solid #dbdbdb;
          padding-left: 1rem;
          margin-left: 0.5rem;
          position: relative;
        }
        .experience-item::before {
          content: '';
          position: absolute;
          width: 12px;
          height: 12px;
          background: white;
          border: 2px solid #3298dc;
          border-radius: 50%;
          left: -7px;
          top: 1.5rem;
        }
        .experience-item:not(:last-child) {
          border-bottom: none;
        }
      `}</style>
    </div>
  );
}