'use client'
import { useState } from 'react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    passwordHash: '',
    educationLevel: '',
    careerStatus: '',
    skills: null, 
    experience: null, 
    education: null, 
    location: '',
    profileStatus: 'INCOMPLETE',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.status === 201) {
        const data = await response.json();
        alert("Student registered successfully!");
      } else {
        const errorData = await response.json();
        alert("Error: " + errorData.error);
      }
    } catch (error) {
      alert("There was an error with registration.");
    }
  };

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Student Registration</h1>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Full Name</label>
            <div className="control">
              <input
                className="input"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Email</label>
            <div className="control">
              <input
                className="input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Password</label>
            <div className="control">
              <input
                className="input"
                type="password"
                name="passwordHash"
                value={formData.passwordHash}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </div>
          </div>
          {/* Agrega otros campos aquí */}
          <div className="field">
            <button className="button is-primary">Register</button>
          </div>
        </form>
      </div>
    </section>
  );
}
