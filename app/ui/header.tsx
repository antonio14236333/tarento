// components/Header/Header.js
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <nav className="navbar is-secondary" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link href="/" className="navbar-item">
        <Image
        src="/logo.png"
        width={28}
        height={28}
        className="hidden md:block"
        alt="Screenshots of the dashboard project showing desktop version"
      />
        </Link>

        <a
          role="button"
          className="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          <Link href="/" className="navbar-item">
            Home
          </Link>

          <Link href="/job-search" className="navbar-item">
            Job Search
          </Link>

          <Link href="/about" className="navbar-item">
            About
          </Link>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              <Link href="/register" className="button is-light">
                Register
              </Link>
              <Link href="/login" className="button is-link">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
