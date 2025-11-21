"use client";
import Link from 'next/link';
import { useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default function AboutPage() {
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
    }, {
      threshold: 0.1
    });
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
</header>      {}

      {}
      <main className="container py-5 animate-on-scroll">
        <h1 className="section-title">Tentang Di Di Thai Tea</h1>
        <section className="mb-5 pt-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="about-image">
              </div>
            </div>
            <div className="col-lg-6">
              <h2 className="fw-bold mb-3" style={{ color: 'var(--secondary-color)' }}>Latar Belakang</h2>
              <p className="text-muted">Pertama kali berdiri sejak Tahun 2018, dimana pak darwin adalah founder Di Di Thai Tea, yang mengembangkan UMKM untuk menjangkau wilayah pedesaan</p>
              <p className="text-muted">Beliau merupakan Lulusan Universitas Tarumanagara yang mengimplementasikan model pemikiran kritis dalam mengembangkan bisnis ini.</p>
              <h4 className="fw-bold mt-4 mb-3" style={{ color: 'var(--secondary-color)' }}>Misi Kami</h4>
              <ul className="list-unstyled text-muted">
                <li className="mb-2"><i className="fas fa-check-circle me-2" style={{ color: 'var(--secondary-color)' }}></i>Menyajikan minuman dari bahan-bahan yang berkualitas.</li>
                <li className="mb-2"><i className="fas fa-check-circle me-2" style={{ color: 'var(--secondary-color)' }}></i>Memberikan pelayanan yang ramah dan cepat.</li>
                <li className="mb-2"><i className="fas fa-check-circle me-2" style={{ color: 'var(--secondary-color)' }}></i>Terus berinovasi untuk menciptakan jenis rasa baru yang unik.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {}
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
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}