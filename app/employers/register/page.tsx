'use client'
import { useState } from 'react';

export default function EmployerRegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    passwordHash: '',
    companyName: '',
    industry: '',
    companySize: '',
    companyDescription: '',
    location: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/employers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.status === 201) {
        const data = await response.json();
        alert("Employer registered successfully!");
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
        <h1 className="title">Employer Registration</h1>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Company Name</label>
            <div className="control">
              <input
                className="input"
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
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
                required
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
                required
              />
            </div>
          </div>
          <div className="field">
            <button className="button is-primary" type="submit">Register</button>
          </div>
        </form>
      </div>
    </section>
  );
}
