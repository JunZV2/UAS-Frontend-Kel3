"use client";

import Link from 'next/link';
import Carousel from 'react-bootstrap/Carousel';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useEffect, useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

type Product = {
  _id: string;
  nama: string;
  deskripsi: string;
  harga: number;
  gambarUrl: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type ProductSlide = Product[];

export default function HomePage() {
  const [slides, setSlides] = useState<ProductSlide[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`{API_URL}/api/products`);
        if (!response.ok) throw new Error('Gagal mengambil produk');
        const data: Product[] = await response.json();
        const chunkedData: ProductSlide[] = [];
        for (let i = 0; i < data.length; i += 3) {
          chunkedData.push(data.slice(i, i + 3));
        }
        setSlides(chunkedData); 

      } catch (err) {
        console.error(err);
        const dummyChunk: ProductSlide[] = [
          [
            { _id: 'd1', nama: 'Menu Segera Hadir', deskripsi: 'sedang menyiapkan menu-menu terbaik untuk Anda.', harga: 0, gambarUrl: 'https://via.placeholder.com/400x300.png?text=Menu+Kosong' }
          ]
        ];
        setSlides(dummyChunk);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
      <section className="hero-section animate-on-scroll">
        <div className="container">
          <h1 className="display-3">Rasa Otentik, Segar Setiap Saat</h1>
          <p className="lead mb-4">Nikmati kesegaran Thai Tea terbaik dari Di Di Thai Tea.</p>
          <a href="#Menu" className="btn btn-hero">Lihat Menu Kami</a>
        </div>
      </section>

      <main className="container py-5 animate-on-scroll">
        <div id="Menu" className="my-5">
          <h2 className="text-center display-6 mb-4">Menu Kami</h2>
          <section className="menu-gallery">
            
            {loading ? (
              <div className="text-center"><div className="spinner-border text-primary" /></div>
            ) : (
              
              <Carousel variant="dark" indicators={true} interval={null}> 
                
                {slides.length === 0 ? (
                  
                  <Carousel.Item>
                    <div className="row g-4 justify-content-center">
                      <div className="col-md-4">
                        <div className="carousel-product-card">
                           <img src="https://via.placeholder.com/400x300.png?text=Menu+Kosong" alt="Menu Kosong" className="product-image" /> 
                           <h3 className="product-name">Menu Segera Hadir</h3>
                           <p className="product-desc">sedang menyiapkan menu-menu terbaik untuk Anda.</p>
                           <p className="product-price">-</p>
                        </div>
                      </div>
                    </div>
                  </Carousel.Item>
                ) : (
                  
                  slides.map((productChunk, slideIndex) => (
                    <Carousel.Item key={slideIndex}>
                      <div className="row g-4">
                        {}
                        {productChunk.map((product) => (
                          <div className="col-md-4" key={product._id}>
                            <div className="carousel-product-card">
                            <img src={${API_URL}${product.gambarUrl}} alt={product.nama} className="product-image"/><h3 className="product-name">{product.nama}</h3>
                              <p className="product-desc">{product.deskripsi}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Carousel.Item>
                  ))
                )}
              </Carousel>
            )}
            
          </section>
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
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
