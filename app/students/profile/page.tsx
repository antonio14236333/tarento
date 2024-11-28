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

  async function updateProfile() {
    const formData =     {
        "fullName": "No proporcionado",
        "educationLevel": "Universidad (en curso)",
        "careerStatus": "Practicante profesional",
        "skills": [
          {
            "name": "Desarrollo web",
            "level": "Avanzado"
          },
          {
            "name": "Django",
            "level": "Avanzado"
          },
          {
            "name": "Byte",
            "level": "Avanzado"
          },
          {
            "name": "Next.js",
            "level": "Avanzado"
          },
          {
            "name": "Frontera",
            "level": "Avanzado"
          },
          {
            "name": "Balcón",
            "level": "Avanzado"
          }
        ],
        "experience": [
          {
            "company": "Justia",
            "position": "Practicante",
            "duration": "Desde septiembre de 2022",
            "description": "Creación de Landing Pages."
          }
        ],
        "education": [
          {
            "institution": "Universidad Autónoma de Zacatecas",
            "degree": "Ingeniería de Software",
            "field": "Software",
            "graduationYear": "2026"
          }
        ],
        "location": "Osaka, Japón"
      };

    try {
      const response = await fetch('/api/students', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      console.log('Response:', response);
      if (response.ok) {
        const updatedUser = await response.json();
        console.log('Profile updated successfully:', updatedUser);
        fetchProfileData();
      } else {
        const error = await response.json();
        console.error('Failed to update profile:', error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <div className="hero is-fullheight is-light">
      <div className="hero-body">
        <div className="container">
          {profileData && (
            <div className="box">
              {/* Profile Header */}
              <div className="has-background-primary p-5 mb-5">
                <div className="is-flex is-justify-content-space-between is-align-items-center">
                  <div>
                    <h2 className="title is-3 has-text-white mb-2">{profileData.fullName}</h2>
                    <p className="subtitle is-5 has-text-white mb-0">{profileData.careerStatus}</p>
                  </div>
                  <div className="has-text-right">
                    <p className="has-text-white mb-2">{profileData.location}</p>
                    <p className="has-text-white">{profileData.educationLevel}</p>
                  </div>
                </div>
              </div>

              <div className="columns">
                {/* Left Column */}
                <div className="column is-4">
                  {/* Skills Section */}
                  <div className="box">
                    <h3 className="title is-4 mb-4">Skills</h3>
                    <div className="tags are-medium">
                      {profileData.skills?.map((skill: any, index: number) => (
                        <span key={index} className="tag is-primary is-light">
                          {skill.name}
                          <span className="tag is-primary is-small ml-2">{skill.level}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="column is-8">
                  {/* Experience Section */}
                  <div className="box mb-5">
                    <h3 className="title is-4 mb-4">Experience</h3>
                    {profileData.experience?.map((exp: any, index: number) => (
                      <div key={index} className="mb-4">
                        <div className="is-flex is-justify-content-space-between">
                          <strong className="has-text-primary">{exp.company}</strong>
                          <span className="has-text-grey-light">{exp.duration}</span>
                        </div>
                        <p className="is-size-5 mb-2">{exp.position}</p>
                        <p className="has-text-grey">{exp.description}</p>
                      </div>
                    ))}
                  </div>

                  {/* Education Section */}
                  <div className="box">
                    <h3 className="title is-4 mb-4">Education</h3>
                    {profileData.education?.map((edu: any, index: number) => (
                      <div key={index} className="mb-3">
                        <div className="is-flex is-justify-content-space-between">
                          <strong>{edu.institution}</strong>
                          <span className="has-text-grey">{edu.graduationYear}</span>
                        </div>
                        <p>{edu.degree} - {edu.field}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="is-flex is-justify-content-space-between mt-5">
                <button 
                  onClick={updateProfile}
                  className="button is-primary"
                >
                  Update Profile
                </button>
                
                {isProfileComplete && (
                  <a href="profile/jobs" className="button is-success is-light">
                    <button 
                      className="button is-success is-light"
                    >
                      Find Matching Jobs
                    </button>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default UpdateProfilePage;