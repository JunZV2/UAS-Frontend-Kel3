"use client";

import Link from 'next/link';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { 
  Container, Nav, Navbar, 
  Alert, Form, Button, Spinner
} from 'react-bootstrap';

const API_URL = 'https://uas-frontend-kel3-api.onrender.com';

export default function ContactPage() {
  
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    pesan: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal mengirim pesan.');
      }

      setSuccess('Pesan Anda berhasil terkirim! Terima kasih.');
      setFormData({ nama: '', email: '', pesan: '' }); 
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Terjadi kesalahan yang tidak diketahui.');
      }
    } finally {
      setLoading(false);
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
    }, {
      threshold: 0.1
    });
    const targets = document.querySelectorAll('.animate-on-scroll');
    targets.forEach((target) => observer.observe(target));
    return () => targets.forEach((target) => observer.unobserve(target));
  }, []);

  return (
    <>
      <header className="header-top sticky-top">
        <Navbar expand="lg" className="container">
          <Navbar.Brand as={Link} href="/" className="navbar-brand">
            <span className="logo-icon">🥤</span> Di Di Thai Tea
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarNav" />
          <Navbar.Collapse id="navbarNav" className="justify-content-end">
            <Nav className="align-items-center">
              <Nav.Link as={Link} href="/" className="nav-link">Beranda</Nav.Link>
              <Nav.Link as={Link} href="/about" className="nav-link">Tentang Kami</Nav.Link>
              <Nav.Link as={Link} href="/services" className="nav-link">Layanan</Nav.Link>
              <Nav.Link as={Link} href="/dashboard" className="nav-link">Dashboard</Nav.Link>
              <Nav.Link as={Link} href="/contact" className="nav-link active d-flex align-items-center">
                <i className="bi bi-person-lines-fill me-2"></i>
                {}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </header>

      <main className="container py-5 animate-on-scroll">
        <h1 className="section-title">Hubungi Kami</h1>
        <p className="text-center text-muted mb-5">Ada pertanyaan atau kritik dan saran? Jangan ragu untuk menghubungi kami.</p>

        <div className="row g-5">
          <div className="col-lg-7">
            
            {}
            <Form onSubmit={handleSubmit}>
              
              {}
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form.Group className="mb-3">
                <Form.Label htmlFor="nama">Nama Anda</Form.Label>
                <Form.Control 
                  type="text" 
                  id="nama" 
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  required 
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="email">Email</Form.Label>
                <Form.Control 
                  type="email" 
                  id="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="pesan">Pesan Anda</Form.Label>
                <Form.Control 
                  as="textarea" 
                  id="pesan" 
                  name="pesan"
                  rows={6} 
                  value={formData.pesan}
                  onChange={handleChange}
                  required 
                />
              </Form.Group>
              
              <Button type="submit" className="btn btn-submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span className="ms-2">Mengirim...</span>
                  </>
                ) : 'Kirim Pesan'}
              </Button>
            </Form>
          </div>

          <div className="col-lg-5">
            <div className="contact-info">
              <h4 className="fw-bold mb-3">Info Kontak</h4>
              <p className="d-flex align-items-start mb-3">
                <i className="fas fa-map-marker-alt fa-fw mt-1"></i>

              </p>
              <p className="d-flex align-items-start mb-4">
                <i className="fas fa-envelope fa-fw mt-1"></i>
                <span>HP📞: 082297329896</span>
              </p>
              <p className="d-flex align-items-start mb-4">
                <i className="fas fa-envelope fa-fw mt-1"></i>
                <span>EMAIL📧: danielraharjalim@gmail.com</span>
              </p>
            </div>
            <h4 className="fw-bold mb-3 mt-5">Lokasi Kami</h4>
            {}
            <span>Jl. Kali Anyar IV No.30, RT.7/RW.2, Kali Anyar, Kec. Tambora, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta 11310</span>
            <div className="map-responsive shadow">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.908003185514!2d106.7978653757732!3d-6.156588660312527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f61b7b15b5a1%3A0x651c6063b0e118!2sRocky%20Rooster!5e0!3m2!1sen!2sid!4v1715017163013!5m2!1sen!2sid"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>
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
              <p className="mb-1">© 2025 Di Di Thai Tea. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );

}

