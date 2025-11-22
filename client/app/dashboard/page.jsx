"use client"; 

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default function DashboardPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    if (email === 'admin' && password === 'admin') {
      alert('Login Berhasil!');
      router.push('/dashboard/admin');
    } else {
      setError('Email atau password salah.');
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    const targets = document.querySelectorAll('.animate-on-scroll');
    targets.forEach((target) => observer.observe(target));
    return () => targets.forEach((target) => observer.unobserve(target));
  }, []);

  return (
    <>
      {}
      <header className="header-top sticky-top">
  <Navbar expand="lg" className="container">
    <Navbar.Brand as={Link} href="/" className="navbar-brand">
      <span className="logo-icon">🥤</span> Di Di Thai Tea
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="navbarNav" />

    {}
    <Navbar.Collapse id="navbarNav" className="justify-content-end">

      {}
      <Nav className="align-items-center">
        <Nav.Link as={Link} href="/" className="nav-link active">Beranda</Nav.Link>
        <Nav.Link as={Link} href="/about" className="nav-link">Tentang Kami</Nav.Link>
        <Nav.Link as={Link} href="/services" className="nav-link">Layanan</Nav.Link>
        <Nav.Link as={Link} href="/dashboard" className="nav-link">Dashboard</Nav.Link>
        
        {}
        <Nav.Link as={Link} href="/contact" className="nav-link d-flex align-items-center">
          <i className="bi bi-person-lines-fill me-2"></i>
          
        </Nav.Link>
      </Nav>

    </Navbar.Collapse>
  </Navbar>
</header>

      {}
      <main className="login-wrapper animate-on-scroll">
        <div className="login-box">
          <h2 className="text-center fw-bold mb-4" style={{ color: 'var(--secondary-color)' }}>Admin Login</h2>
          
          {}
          <form onSubmit={handleLogin}>
            {}
            {error && <p className="text-danger text-center">{error}</p>}

            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input 
                type="text" 
                className="form-control" 
                id="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="form-label">Password</label>
              <input 
                type="password" 
                className="form-control" 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <button type="submit" className="btn btn-login w-100">Login</button>
          </form>
          {}

        </div>
      </main>
      
      <footer className="main-footer animate-on-scroll">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <Link className="navbar-brand text-white" href="/">
                <span className="logo-icon text-white">🥤</span> Di Di Thai Tea
              </Link>
            </div>
            <div className="col-md-6 text-center text-md-end footer-text mt-3 mt-md-0">
              <p className="mb-1">&copy; 2025 Di Di Thai Tea. All rights reserved.</p>
              {/* <a href="#" className="text-white small">Kelompok</a> | <a href="#" className="text-white small">13</a> */}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}