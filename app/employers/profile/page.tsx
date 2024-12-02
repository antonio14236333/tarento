'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Employer {
  id: string;
  email: string;
  companyName: string;
  industry: string | null;
  companySize: string | null;
  companyDescription: string | null;
  location: string | null;
  verified: boolean;
  createdAt: string;
  lastActive: string;
  jobs: Job[];
}

interface Job {
  id: string;
  title: string;
  description: string;
  jobType: string;
  location: string;
}

export default function UpdateEmployerProfile() {
  const [employerData, setEmployerData] = useState<Employer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    jobType: '',
    location: '',
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  async function fetchProfileData() {
    try {
      const response = await fetch('/api/employers');
      if (response.ok) {
        const data = await response.json();
        setEmployerData(data);
      } else {
        const error = await response.json();
        console.log('Failed to fetch profile data:', error);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function createJob(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          title: '',
          description: '',
          jobType: '',
          location: '',
        });
        setIsModalOpen(false);
        fetchProfileData();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error creating job:', error);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!employerData) return null;

  return (
    <div className="custom-background">
      <div className="section">
        <div className="container">
          {/* Header Section */}
          <div className="header-section mb-6">
            <div className="level">
              <div className="level-left">
                <div className="level-item">
                  <div>
                    <h1 className="title is-2 has-text-white">
                      {employerData.companyName}
                      {employerData.verified && (
                        <span className="tag is-info is-light ml-2">
                          <span className="icon">
                            <i className="fas fa-shield-check"></i>
                          </span>
                          <span>Verified</span>
                        </span>
                      )}
                    </h1>
                    <p className="subtitle is-5 has-text-grey-lighter">
                      <span className="icon-text">
                        <span className="icon">
                          <i className="fas fa-building"></i>
                        </span>
                        <span>{employerData.industry || 'Technology'}</span>
                      </span>
                      <span className="mx-2">•</span>
                      <span className="icon-text">
                        <span className="icon">
                          <i className="fas fa-location-dot"></i>
                        </span>
                        <span>{employerData.location || 'Remote'}</span>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="level-right">
                <div className="level-item">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="button is-primary is-medium custom-button"
                  >
                    <span className="icon">
                      <i className="fas fa-plus-circle"></i>
                    </span>
                    <span>Post a Job</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div className="custom-box mb-6">
            <h2 className="title is-4 has-text-white mb-4">
              <span className="icon-text">
                <span className="icon">
                  <i className="fas fa-info-circle"></i>
                </span>
                <span>About the Company</span>
              </span>
            </h2>
            <p className="mb-5 has-text-grey-lighter">
              {employerData.companyDescription || 
               'We are a dynamic company focused on innovation and growth.'}
            </p>
            <div className="columns is-multiline">
              <div className="column is-4">
                <div className="info-card">
                  <span className="icon has-text-info mr-3">
                    <i className="fas fa-users fa-lg"></i>
                  </span>
                  <div>
                    <p className="is-size-7 has-text-grey-light">Company Size</p>
                    <p className="is-size-6 has-text-white">{employerData.companySize || 'Not specified'}</p>
                  </div>
                </div>
              </div>
              <div className="column is-4">
                <div className="info-card">
                  <span className="icon has-text-info mr-3">
                    <i className="fas fa-map-marker-alt fa-lg"></i>
                  </span>
                  <div>
                    <p className="is-size-7 has-text-grey-light">Location</p>
                    <p className="is-size-6 has-text-white">{employerData.location || 'Not specified'}</p>
                  </div>
                </div>
              </div>
              <div className="column is-4">
                <div className="info-card">
                  <span className="icon has-text-info mr-3">
                    <i className="fas fa-calendar-alt fa-lg"></i>
                  </span>
                  <div>
                    <p className="is-size-7 has-text-grey-light">Member Since</p>
                    <p className="is-size-6 has-text-white">
                      {new Date(employerData.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="custom-box">
            <h2 className="title is-3 has-text-white mb-5">
              <span className="icon-text">
                <span className="icon">
                  <i className="fas fa-briefcase"></i>
                </span>
                <span>Open Positions ({employerData.jobs.length})</span>
              </span>
            </h2>
            
            {employerData.jobs.length === 0 ? (
              <div className="has-text-centered py-6 empty-state">
                <span className="icon is-large has-text-grey-light">
                  <i className="fas fa-briefcase fa-3x"></i>
                </span>
                <h3 className="title is-4 has-text-white mt-4 mb-2">No open positions</h3>
                <p className="subtitle is-6 has-text-grey-lighter mb-4">Share your first job opportunity with potential candidates</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="button is-primary custom-button"
                >
                  Post a Job
                </button>
              </div>
            ) : (
              <div className="columns is-multiline">
                {employerData.jobs.map((job) => (
                  <div key={job.id} className="column is-12">
                    <div className="job-card">
                      <div className="is-flex is-justify-content-space-between is-align-items-start">
                        <div>
                          <h3 className="title is-4 has-text-white mb-2">
                            {job.title}
                          </h3>
                          <div className="is-flex is-align-items-center mb-4">
                            <span className="icon-text mr-4">
                              <span className="icon has-text-info">
                                <i className="fas fa-briefcase"></i>
                              </span>
                              <span className="has-text-grey-lighter">{job.jobType}</span>
                            </span>
                            <span className="icon-text">
                              <span className="icon has-text-info">
                                <i className="fas fa-location-dot"></i>
                              </span>
                              <span className="has-text-grey-lighter">{job.location}</span>
                            </span>
                          </div>
                          <p className="has-text-grey-light">{job.description}</p>
                        </div>
                        <Link
                          href={`/employers/profile/${job.id}`}
                          className="button is-info is-outlined custom-button-outline"
                        >
                          <span className="icon">
                            <i className="fas fa-users"></i>
                          </span>
                          <span>View Candidates</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal - Style updated */}
      <div className={`modal ${isModalOpen ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={() => setIsModalOpen(false)}></div>
        <div className="modal-card">
          <header className="modal-card-head">
          <p className="modal-card-title has-text-white">Create New Position</p>
            <button 
              className="delete" 
              aria-label="close"
              onClick={() => setIsModalOpen(false)}
            ></button>
          </header>
          <section className="modal-card-body">
            <form onSubmit={createJob}>
              <div className="field">
                <label className="label">Position Title</label>
                <div className="control has-icons-left">
                  <input
                    className="input is-medium"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Senior Software Engineer"
                    required
                  />
                  <span className="icon is-left">
                    <i className="fas fa-briefcase"></i>
                  </span>
                </div>
              </div>

              <div className="field">
                <label className="label">Description</label>
                <div className="control">
                  <textarea
                    className="textarea"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the role and responsibilities"
                    rows={5}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="columns">
                <div className="column">
                  <div className="field">
                    <label className="label">Job Type</label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="text"
                        name="jobType"
                        value={formData.jobType}
                        onChange={handleInputChange}
                        placeholder="e.g. Full-time"
                        required
                      />
                      <span className="icon is-left">
                        <i className="fas fa-clock"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="column">
                  <div className="field">
                    <label className="label">Location</label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g. New York, NY"
                        required
                      />
                      <span className="icon is-left">
                        <i className="fas fa-map-marker-alt"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </section>
          <footer className="modal-card-foot">
            <button className="button is-primary" onClick={createJob}>
              Create Position
            </button>
            <button className="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
          </footer>
        </div>
      </div>

      <style jsx>{`
        .custom-background {
          background: linear-gradient(135deg, #1a1c2c 0%, #0f1623 100%);
          min-height: 100vh;
        }

        .header-section {
          background: rgba(255, 255, 255, 0.05);
          padding: 2rem;
          border-radius: 8px;
          backdrop-filter: blur(10px);
        }

        .custom-box {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 2rem;
          backdrop-filter: blur(10px);
        }

        .info-card {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .info-card:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.08);
        }

        .job-card {
          background: rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
          border: 1px solid transparent;
        }

        .job-card:hover {
          transform: translateY(-2px);
          border-color: #3273dc;
          background: rgba(255, 255, 255, 0.08);
        }

        .custom-button {
          background: #3273dc;
          border: none;
          transition: all 0.3s ease;
        }

        .custom-button:hover {
          background: #2366d1;
          transform: translateY(-1px);
        }

        .custom-button-outline {
          border: 2px solid #3273dc;
          transition: all 0.3s ease;
        }

        .custom-button-outline:hover {
          background: #3273dc;
          transform: translateY(-1px);
        }

        .custom-modal {
          background: #1a1c2c;
        }

        .modal-card-head {
          background: #0f1623;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .modal-card-foot {
          background: #0f1623;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .empty-state {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          padding: 3rem;
        }
      `}</style>
    </div>
  );
}