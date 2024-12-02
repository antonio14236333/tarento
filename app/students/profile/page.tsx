'use client'
import React, { useEffect, useState } from 'react';

const UpdateProfilePage: React.FC = () => {
  const [profileData, setProfileData] = useState<any>(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);


  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (profileData) {
      checkProfileCompletion();
    }
  }, [profileData]);

  async function fetchProfileData() {
    try {
      const response = await fetch('/api/students');
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      } else {
        const error = await response.json();
        console.error('Failed to fetch profile data:', error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  function checkProfileCompletion() {
    const hasEducation = profileData?.education?.length > 0;
    const hasSkills = profileData?.skills?.length > 0;
    const hasExperience = profileData?.experience?.length > 0;

    setIsProfileComplete(hasEducation && hasSkills && hasExperience);
  }

  // async function updateProfile() {
  //   const formData =     {
  //       "fullName": "No proporcionado",
  //       "educationLevel": "Universidad (en curso)",
  //       "careerStatus": "Practicante profesional",
  //       "skills": [
  //         {
  //           "name": "Desarrollo web",
  //           "level": "Avanzado"
  //         },
  //         {
  //           "name": "Django",
  //           "level": "Avanzado"
  //         },
  //         {
  //           "name": "Byte",
  //           "level": "Avanzado"
  //         },
  //         {
  //           "name": "Next.js",
  //           "level": "Avanzado"
  //         },
  //         {
  //           "name": "Frontera",
  //           "level": "Avanzado"
  //         },
  //         {
  //           "name": "Balcón",
  //           "level": "Avanzado"
  //         }
  //       ],
  //       "experience": [
  //         {
  //           "company": "Justia",
  //           "position": "Practicante",
  //           "duration": "Desde septiembre de 2022",
  //           "description": "Creación de Landing Pages."
  //         }
  //       ],
  //       "education": [
  //         {
  //           "institution": "Universidad Autónoma de Zacatecas",
  //           "degree": "Ingeniería de Software",
  //           "field": "Software",
  //           "graduationYear": "2026"
  //         }
  //       ],
  //       "location": "Osaka, Japón"
  //     };

  //   try {
  //     const response = await fetch('/api/students', {
  //       method: 'PATCH',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(formData),
  //     });
  //     console.log('Response:', response);
  //     if (response.ok) {
  //       const updatedUser = await response.json();
  //       console.log('Profile updated successfully:', updatedUser);
  //       fetchProfileData();
  //     } else {
  //       const error = await response.json();
  //       console.error('Failed to update profile:', error);
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // }

  return (
    <div className="section has-background-light">
      <div className="container">
        {profileData && (
          <div className="box custom-box">
            {/* Profile Header */}
            <div className="hero is-primary is-bold custom-header mb-6">
              <div className="hero-body">
                <div className="is-flex is-justify-content-space-between is-align-items-start">
                  <div>
                    <h2 className="title is-2 has-text-white mb-2">
                      {profileData.fullName}
                      <span className="tag is-warning is-medium ml-3">
                        <span className="icon">
                          <i className="fas fa-user-graduate"></i>
                        </span>
                        <span>{profileData.careerStatus}</span>
                      </span>
                    </h2>
                    <div className="is-flex is-align-items-center mt-3">
                      <span className="icon-text has-text-white-bis">
                        <span className="icon">
                          <i className="fas fa-map-marker-alt"></i>
                        </span>
                        <span>{profileData.location}</span>
                      </span>
                      <span className="mx-2 has-text-white-bis">•</span>
                      <span className="icon-text has-text-white-bis">
                        <span className="icon">
                          <i className="fas fa-graduation-cap"></i>
                        </span>
                        <span>{profileData.educationLevel}</span>
                      </span>
                    </div>
                  </div>
                  <div className="profile-completion">
                    <div className="has-text-right">
                      <span className="icon-text has-text-white-bis mb-2">
                        <span className="icon">
                          <i className="fas fa-chart-line"></i>
                        </span>
                        <span>Profile Completion</span>
                      </span>
                      <progress 
                        className="progress is-success is-small" 
                        value={isProfileComplete ? "100" : "60"} 
                        max="100"
                      ></progress>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="columns">
              {/* Left Column - Skills & Quick Info */}
              <div className="column is-4">
                {/* Skills Section */}
                <div className="card custom-card mb-5">
                  <div className="card-content">
                    <h3 className="title is-4 mb-4">
                      <span className="icon-text">
                        <span className="icon has-text-primary">
                          <i className="fas fa-laptop-code"></i>
                        </span>
                        <span>Skills</span>
                      </span>
                    </h3>
                    <div className="tags">
                      {profileData.skills?.map((skill: any, index: number) => (
                        <span key={index} className="tag is-medium custom-skill-tag">
                          {skill.name}
                          <span className="tag is-primary is-primary ml-2">{skill.level}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="card custom-card">
                  <div className="card-content">
                    <h3 className="title is-4 mb-4">
                      <span className="icon-text">
                        <span className="icon has-text-primary">
                          <i className="fas fa-bolt"></i>
                        </span>
                        <span>Quick Actions</span>
                      </span>
                    </h3>
                    <div className="buttons are-medium">
                      <a href="ia" className="button is-primary is-fullwidth mb-2">
                        <span className="icon">
                          <i className="fas fa-edit"></i>
                        </span>
                        <span>Update Profile</span>
                      </a>
                      {isProfileComplete && (
                        <a href="profile/jobs" className="button is-success is-light is-fullwidth">
                          <span className="icon">
                            <i className="fas fa-search"></i>
                          </span>
                          <span>Find Matching Jobs</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Experience & Education */}
              <div className="column is-8">
                {/* Experience Section */}
                <div className="card custom-card mb-5">
                  <div className="card-content">
                    <h3 className="title is-4 mb-4">
                      <span className="icon-text">
                        <span className="icon has-text-primary">
                          <i className="fas fa-briefcase"></i>
                        </span>
                        <span>Experience</span>
                      </span>
                    </h3>
                    <div className="timeline">
                      {profileData.experience?.map((exp: any, index: number) => (
                        <div key={index} className="timeline-item">
                          <div className="is-flex is-justify-content-space-between mb-2">
                            <strong className="has-text-primary is-size-5">{exp.company}</strong>
                            <span className="tag is-primary is-primary">{exp.duration}</span>
                          </div>
                          <p className="is-size-5 has-text-weight-medium mb-2">{exp.position}</p>
                          <p className="has-text-grey">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Education Section */}
                <div className="card custom-card">
                  <div className="card-content">
                    <h3 className="title is-4 mb-4">
                      <span className="icon-text">
                        <span className="icon has-text-primary">
                          <i className="fas fa-graduation-cap"></i>
                        </span>
                        <span>Education</span>
                      </span>
                    </h3>
                    {profileData.education?.map((edu: any, index: number) => (
                      <div key={index} className="education-item mb-4">
                        <div className="is-flex is-justify-content-space-between mb-2">
                          <strong className="is-size-5">{edu.institution}</strong>
                          <span className="tag is-primary is-light">{edu.graduationYear}</span>
                        </div>
                        <p className="has-text-grey-dark">{edu.degree} - {edu.field}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-box {
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .custom-header {
          border-radius: 6px;
          background: linear-gradient(145deg, #00d1b2 0%, #009688 100%);
        }

        .custom-card {
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }

        .custom-card:hover {
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          transform: translateY(-2px);
        }

        .timeline-item {
          padding: 1.5rem;
          border-left: 2px solid #00d1b2;
          position: relative;
          margin-left: 1rem;
          padding-left: 2rem;
        }

        .timeline-item::before {
          content: '';
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          border: 2px solid #00d1b2;
          left: -7px;
          top: 2rem;
        }

        .custom-skill-tag {
          background-color: #f5f5f5;
          border: 1px solid #e8e8e8;
          border-radius: 20px;
        }

        .education-item {
          padding: 1rem;
          border-radius: 6px;
          background-color: #f8f9fa;
        }

        .profile-completion {
          min-width: 200px;
        }
      `}</style>
    </div>
  );
};


export default UpdateProfilePage;