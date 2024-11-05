"use client";

// components/Header/Header.js
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import '@/app/ui/header.css';

export default function Header() {
  const [isActive, setIsActive] = useState(false);

  // Manejador de clic para alternar el estado
  const toggleBurger = () => {
    setIsActive(!isActive);
  };

  return (


  <nav className="navbar is-fixed-top is-transparen" role="navigation" aria-label="main navigation">
  <div className="navbar-brand">
    <a className="navbar-item logo" href="/">
    <Image
      src="/logo.png"
      width={60}
      height={60}
      alt="Screenshots of the dashboard project showing desktop version"
      style={{ maxHeight: 'none' }}
    />


    </a>

    <a role="button" className={`navbar-burger ${isActive ? 'is-active' : ''}`} aria-label="menu" aria-expanded="false" onClick={toggleBurger}>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  <div className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
  <div className="navbar-start">
      <a className="navbar-item" href=""> Home </a>
      <div className="navbar-item has-dropdown is-hoverable">
        <a className="navbar-link" href=""> Student </a>
        <div className="navbar-dropdown">
          <a className="navbar-item" href=""> Profile </a>
          <a className="navbar-item" href=""> Jobs </a>
          <hr className="navbar-divider"/>
          <a className="navbar-item is-danger" href=""> Log Out </a>
        </div>
      </div>
    </div>

    <div className="navbar-end">
      <div className="navbar-item">
        <div className="buttons">
          <a className="button is-success" href="/students/register">
            <strong>Sign up</strong>
          </a>
          <a className="button is-light" href="/authentication/login">
            Log in
          </a>
        </div>
      </div>
    </div>
  </div>
</nav>

  );
}
