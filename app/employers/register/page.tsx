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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const industryOptions = [
    "Technology",
    "Healthcare",
    "Education",
    "Finance",
    "Manufacturing",
    "Retail",
    "Services",
    "Other"
  ];

  const companySizeOptions = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501+ employees"
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-8">
            <div className="box">
              <h1 className="title has-text-centered">
                <span className="icon-text">
                  <span className="icon is-large">🏢</span>
                  <span>Employer Registration</span>
                </span>
              </h1>
              
              <form onSubmit={handleSubmit}>
                {/* Company Name */}
                <div className="field">
                  <label className="label">Company Name</label>
                  <div className="control has-icons-left">
                    <input
                      className="input"
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Enter your company name"
                      required
                    />
                    <span className="icon is-small is-left">🏢</span>
                  </div>
                </div>

                {/* Email */}
                <div className="field">
                  <label className="label">Corporate Email</label>
                  <div className="control has-icons-left">
                    <input
                      className="input"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="company@domain.com"
                      required
                    />
                    <span className="icon is-small is-left">📧</span>
                  </div>
                </div>

                {/* Password */}
                <div className="field">
                  <label className="label">Password</label>
                  <div className="control has-icons-left">
                    <input
                      className="input"
                      type="password"
                      name="passwordHash"
                      value={formData.passwordHash}
                      onChange={handleChange}
                      placeholder="Enter a secure password"
                      required
                    />
                    <span className="icon is-small is-left">🔒</span>
                  </div>
                </div>

                {/* Industry */}
                <div className="field">
                  <label className="label">Industry</label>
                  <div className="control has-icons-left">
                    <div className="select is-fullwidth">
                      <select
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select an industry</option>
                        {industryOptions.map((industry) => (
                          <option key={industry} value={industry}>
                            {industry}
                          </option>
                        ))}
                      </select>
                    </div>
                    <span className="icon is-small is-left">🏭</span>
                  </div>
                </div>

                {/* Company Size */}
                <div className="field">
                  <label className="label">Company Size</label>
                  <div className="control has-icons-left">
                    <div className="select is-fullwidth">
                      <select
                        name="companySize"
                        value={formData.companySize}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select company size</option>
                        {companySizeOptions.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
                    <span className="icon is-small is-left">👥</span>
                  </div>
                </div>

                {/* Location */}
                <div className="field">
                  <label className="label">Location</label>
                  <div className="control has-icons-left">
                    <input
                      className="input"
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="City, Country"
                      required
                    />
                    <span className="icon is-small is-left">📍</span>
                  </div>
                </div>

                {/* Company Description */}
                <div className="field">
                  <label className="label">Company Description</label>
                  <div className="control">
                    <textarea
                      className="textarea"
                      name="companyDescription"
                      value={formData.companyDescription}
                      onChange={handleChange}
                      placeholder="Tell us about your company..."
                      rows={4}
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="field">
                  <div className="control">
                    <button className="button is-primary is-fullwidth" type="submit">
                      <span className="icon">✨</span>
                      <span>Register Company</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}