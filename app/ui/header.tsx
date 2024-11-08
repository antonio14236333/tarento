"use client";

// components/Header/Header.js
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import '@/app/ui/header.css';

export default function Header() {
  const [isActive, setIsActive] = useState(false);
  const { data: session } = useSession(); // Hook para obtener la sesión actual

  // Manejador de clic para alternar el estado
  const toggleBurger = () => {
    setIsActive(!isActive);
  };

  return (
    <nav className="navbar is-fixed-top is-transparen" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link href="/" className="navbar-item logo">
          <Image
            src="/logo.png"
            width={60}
            height={60}
            alt="Screenshots of the dashboard project showing desktop version"
            style={{ maxHeight: 'none' }}
          />
        </Link>

        <a
          role="button"
          className={`navbar-burger ${isActive ? 'is-active' : ''}`}
          aria-label="menu"
          aria-expanded="false"
          onClick={toggleBurger}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
        <div className="navbar-start">
          <Link href="/" className="navbar-item">Home</Link>
          <div className="navbar-item has-dropdown is-hoverable">
            <Link href="#" className="navbar-link">Student</Link>
            <div className="navbar-dropdown">
              <Link href="/students/profile" className="navbar-item">Profile</Link>
              <Link href="/students/job-search" className="navbar-item">Jobs</Link>
              <hr className="navbar-divider" />
              {session ? (
                <a className="navbar-item is-danger" onClick={() => signOut()}>Log Out</a>
              ) : null}
            </div>
          </div>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              {!session ? (
                <>
                  <Link href="/students/register" className="button is-success">
                    <strong>Sign up</strong>
                  </Link>
                  <Link href="/authentication/login" className="button is-light">Log in</Link>
                </>
              ) : (
                <button onClick={() => signOut()} className="button is-danger">
                  Log Out
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
 