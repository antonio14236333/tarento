'use client';
// Tenle respeto a este archivo


import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn('credentials', {
      redirect: false,
      email: username,
      password,
    });

    if (result?.error) {
      setError(result.error);
      alert('Error de inicio de sesión: ' + result.error);
    } else {
      console.log('Inicio de sesión exitoso');

      if (result && result.ok) {
        
        router.push('/students/profile');
      }
    }
  };

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Username</label>
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          {error && <p className="has-text-danger">{error}</p>}
          <div className="field is-grouped">
            <div className="control">
              <button type="submit" className="button is-link">Login</button>
            </div>
            <div className="control">
              <button type="button" className="button is-light" onClick={() => { setUsername(''); setPassword(''); }}>Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
