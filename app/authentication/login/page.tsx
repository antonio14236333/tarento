'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
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
        if (result?.ok) {
          const session = await getSession();
          if (session?.user?.role === 'student') {
            router.push('/students/profile');
          } else if (session?.user?.role === 'employer') {
            router.push('/employers/profile');
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="hero is-fullheight">
      <div className="hero-body" style={{ padding: '0px 25px', height: '100px'}}>
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-5-tablet is-4-desktop">
              <div className="box">
                <h1 className="title has-text-centered">Welcome Back</h1>
                
                <form onSubmit={handleSubmit}>
                  <div className="field">
                    <label className="label">Email</label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="email"
                        placeholder="Enter your email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                      <span className="icon is-small is-left">
                        📧
                      </span>
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Password</label>
                    <div className="control has-icons-left">
                      <input
                        className="input"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                      <span className="icon is-small is-left">
                        🔒
                      </span>
                    </div>
                  </div>

                  {error && (
                    <div className="notification is-danger is-light">
                      {error}
                    </div>
                  )}

                  <div className="field is-grouped is-grouped-centered mt-5">
                    <div className="control">
                      <button 
                        type="submit" 
                        className={`button is-primary ${isLoading ? 'is-loading' : ''}`}
                        disabled={isLoading}
                      >
                        Sign In
                      </button>
                    </div>
                    <div className="control">
                      <button 
                        type="button" 
                        className="button is-light"
                        onClick={() => { 
                          setUsername(''); 
                          setPassword(''); 
                          setError('');
                        }}
                        disabled={isLoading}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}