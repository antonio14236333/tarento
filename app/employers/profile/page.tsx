'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function UpdateEmployerProfile() {
  const [employerData, setEmployerData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requiredSkills: '',
    requirements: '',
    jobType: '',
    location: '',
    salaryRange: '',
    startDate: '',
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
        alert('Job created successfully!');
        setFormData({
          title: '',
          description: '',
          requiredSkills: '',
          requirements: '',
          jobType: '',
          location: '',
          salaryRange: '',
          startDate: '',
        });
        setIsModalOpen(false);
        fetchProfileData();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error creating job:', error);
      alert('An unexpected error occurred.');
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="hero is-fullheight is-light">
      {employerData && (
        <div className="container is-max-desktop py-6 px-4">
          <div className="box">
            {/* Header */}
            <div className="has-background-primary p-5">
              <h2 className="title is-3 has-text-white">{employerData.companyName}</h2>
            </div>

            {/* Company Info */}
            <div className="columns is-multiline m-2">
              <div className="column is-4">
                <div className="box">
                  <p className="is-size-7 has-text-grey">Industry</p>
                  <p className="is-size-6 has-text-weight-medium">{employerData.industry}</p>
                </div>
              </div>
              <div className="column is-4">
                <div className="box">
                  <p className="is-size-7 has-text-grey">Company Size</p>
                  <p className="is-size-6 has-text-weight-medium">{employerData.companySize}</p>
                </div>
              </div>
              <div className="column is-4">
                <div className="box">
                  <p className="is-size-7 has-text-grey">Location</p>
                  <p className="is-size-6 has-text-weight-medium">{employerData.location}</p>
                </div>
              </div>
            </div>

            {/* Job Listings */}
            <div className="p-4">
              <div className="level mb-5">
                <div className="level-left">
                  <h3 className="title is-4">Job Listings</h3>
                </div>
                <div className="level-right">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="button is-primary"
                  >
                    + Create Job
                  </button>
                </div>
              </div>

             
            {employerData.jobs?.map((job: any, index: number) => (
              <div key={index} className="box mb-4 hover-shadow">
                <div className="is-flex is-justify-content-space-between">
                  <div>
                    <h4 className="title is-5 mb-2">{job.title}</h4>
                    <p className="subtitle is-6 has-text-grey">
                      {job.jobType} • {job.location}
                    </p>
                  </div>
                  <div className="is-flex is-align-items-start gap-2">
                    <span className="tag is-info is-light">New</span>
                    {/* Botón que redirige a la página de candidatos */}
                    <Link 
                      href={`/employers/profile/${job.id}`} 
                      className="button is-small is-primary is-outlined"
                    >
                      View Candidates
                    </Link>
                  </div>
                </div>
                <p className="has-text-grey mt-3">{job.description}</p>
              </div>
            ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <div className={`modal ${isModalOpen ? 'is-active' : ''}`}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head has-background-primary">
            <p className="modal-card-title has-text-white">Create a New Job</p>
            <button 
              className="delete" 
              aria-label="close" 
              onClick={() => setIsModalOpen(false)}
            ></button>
          </header>
          
          <section className="modal-card-body">
            <form onSubmit={createJob}>
              <div className="field">
                <label className="label">Job Title</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
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
                    required
                  ></textarea>
                </div>
              </div>

              <div className="columns">
                <div className="column">
                  <div className="field">
                    <label className="label">Job Type</label>
                    <div className="control">
                      <input
                        className="input"
                        type="text"
                        name="jobType"
                        value={formData.jobType}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="column">
                  <div className="field">
                    <label className="label">Location</label>
                    <div className="control">
                      <input
                        className="input"
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </section>

          <footer className="modal-card-foot">
            <button 
              className="button is-primary" 
              onClick={createJob}
            >
              Create Job
            </button>
            <button 
              className="button" 
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}