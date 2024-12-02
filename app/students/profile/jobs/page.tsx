'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Job {
  id: string;
  title: string;
  description: string;
  requiredSkills: any;
  requirements: any;
  jobType: string | null;
  location: string | null;
  salaryRange: string | null;
  startDate: string | null;
  status: string;
  postedAt: string;
  employer: {
    companyName: string;
    industry: string | null;
    location: string | null;
    verified: boolean;
  };
}

export default function AvailableJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch('/api/student-job');
        if (response.ok) {
          const data = await response.json();
          const availableJobs = data.filter((job: Job) => job.status === 'OPEN');
          setJobs(availableJobs);
        } else {
          const errorData = await response.json();
          setError('Failed to fetch jobs: ' + errorData.message);
        }
      } catch (err) {
        setError('An error occurred: ' + err);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="hero is-fullheight">
        <div className="hero-body">
          <div className="container has-text-centered">
            <div className="button is-loading is-large is-white"></div>
            <p className="mt-4 is-size-5 has-text-grey">Loading available positions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hero is-fullheight">
        <div className="hero-body">
          <div className="container">
            <div className="notification is-danger is-light">
              <button className="delete"></button>
              {error}
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
          <h1 className="title is-2">Available Positions</h1>
          <p className="subtitle is-5 has-text-grey">
            {jobs.length} open positions matching your profile
          </p>
        </div>

        <div className="columns is-multiline">
          {jobs.map((job) => (
            <div key={job.id} className="column is-4">
              <div className="card job-card">
                {/* Job Header */}
                <header className="card-header">
                  <p className="card-header-title">
                    <span className="icon-text">
                      <span className="icon has-text-info">
                        <i className="fas fa-briefcase"></i>
                      </span>
                      <span>{job.title}</span>
                    </span>
                  </p>
                </header>

                <div className="card-content">
               

                  {/* Job Details */}
                  <div className="content">
                    <div className="tags mb-3">
                      {job.jobType && (
                        <span className="tag is-info is-light">
                          <span className="icon">
                            <i className="fas fa-clock"></i>
                          </span>
                          <span>{job.jobType}</span>
                        </span>
                      )}
                      {job.location && (
                        <span className="tag is-info is-light">
                          <span className="icon">
                            <i className="fas fa-map-marker-alt"></i>
                          </span>
                          <span>{job.location}</span>
                        </span>
                      )}
                      {job.salaryRange && (
                        <span className="tag is-success is-light">
                          <span className="icon">
                            <i className="fas fa-money-bill-wave"></i>
                          </span>
                          <span>{job.salaryRange}</span>
                        </span>
                      )}
                    </div>

                    <p className="mb-4">
                      {job.description.length > 150 
                        ? `${job.description.substring(0, 150)}...` 
                        : job.description}
                    </p>

                    {/* Required Skills */}
                    {job.requiredSkills && (
                      <div className="mb-4">
                        <p className="has-text-weight-semibold mb-2">Required Skills:</p>
                        <div className="tags">
                          {Object.entries(job.requiredSkills).map(([skill, level]) => (
                            <span key={skill} className="tag is-primary is-light">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Posted Date */}
                    <p className="has-text-grey is-size-7">
                      <span className="icon-text">
                        <span className="icon">
                          <i className="far fa-calendar-alt"></i>
                        </span>
                        <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>
                      </span>
                    </p>
                  </div>
                </div>

                <footer className="card-footer">
                  <a href={`/jobs/${job.id}`} className="card-footer-item has-text-primary">
                    <span className="icon-text">
                      <span className="icon">
                        <i className="fas fa-info-circle"></i>
                      </span>
                      <span>View Details</span>
                    </span>
                  </a>
                  <a href={`/jobs/${job.id}/apply`} className="card-footer-item has-text-info">
                    <span className="icon-text">
                      <span className="icon">
                        <i className="fas fa-paper-plane"></i>
                      </span>
                      <span>Apply Now</span>
                    </span>
                  </a>
                </footer>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .job-card {
          height: 100%;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
        }

        .job-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(10, 10, 10, 0.1);
        }

        .card-content {
          flex-grow: 1;
        }

        .card-footer {
          border-top: 1px solid #e1e4e8;
          background-color: #fafafa;
        }

        .card-footer-item {
          transition: all 0.2s ease;
        }

        .card-footer-item:hover {
          background-color: #f5f5f5;
        }
      `}</style>
    </div>
  );
}