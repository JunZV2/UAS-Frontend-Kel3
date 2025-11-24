// "use client";

// import Link from 'next/link';
// import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
// import { 
//   Container, Nav, Navbar, Row, Col, Button, 
//   Modal, Form, Alert, InputGroup, ListGroup, Image
// } from 'react-bootstrap';

// type Product = {
//   _id: string;
//   nama: string;
//   harga: number;
//   gambarUrl: string;
// };

// type CartItem = {
//   productId: string;
//   nama: string;
//   harga: number;
//   quantity: number;
//   gambarUrl: string;
// };

// type Order = {
//   orderId: string;
// };

// const API_URL = 'https://uas-frontend-kel3-api.onrender.com';

// export default function ServicesPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loadingProducts, setLoadingProducts] = useState(true);

//   const [showModal, setShowModal] = useState(false);
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [namaPelanggan, setNamaPelanggan] = useState('');
//   const [email, setEmail] = useState('');
//   const [notes, setNotes] = useState('');
  
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);
//   const [submitSuccess, setSubmitSuccess] = useState('');
//   const [submitError, setSubmitError] = useState('');

//   const [metodePembayaran, setMetodePembayaran] = useState('Transfer Bank'); 
//   const [showQRIS, setShowQRIS] = useState(false); 
//   const [buktiFile, setBuktiFile] = useState<File | null>(null);
//   const [buktiBase64, setBuktiBase64] = useState<string>('');
//   const [previewBukti, setPreviewBukti] = useState<string | null>(null);
  
//   const [showQRISModal, setShowQRISModal] = useState(false);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         setLoadingProducts(true);
//         const response = await fetch(`${API_URL}/api/products`); 
//         if (!response.ok) throw new Error('Gagal memuat menu');
//         const data: Product[] = await response.json();
//         setProducts(data);
//       } catch (err) {
//         if (err instanceof Error) setSubmitError(err.message);
//       } finally {
//         setLoadingProducts(false);
//       }
//     };
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     const total = cart.reduce((acc, item) => acc + (item.harga * item.quantity), 0);
//     setTotalPrice(total);
//   }, [cart]);


//   useEffect(() => {
//     if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           entry.target.classList.add('is-visible');
//           observer.unobserve(entry.target);
//         }
//       });
//     }, { threshold: 0.1 });
//     const targets = document.querySelectorAll('.animate-on-scroll');
//     targets.forEach((target) => observer.observe(target));
//     return () => targets.forEach((target) => observer.unobserve(target));
//   }, []);

//   const handleAddToCart = (product: Product) => {
//     setCart(currentCart => {
//       const existingItem = currentCart.find(item => item.productId === product._id);
//       if (existingItem) {
//         return currentCart.map(item => 
//           item.productId === product._id ? { ...item, quantity: item.quantity + 1 } : item
//         );
//       } else {
//         return [...currentCart, { 
//           productId: product._id, 
//           nama: product.nama, 
//           harga: product.harga, 
//           gambarUrl: product.gambarUrl,
//           quantity: 1 
//         }];
//       }
//     });
//   };

//   const handleUpdateQuantity = (productId: string, newQuantity: number) => {
//     if (newQuantity <= 0) {
//       setCart(currentCart => currentCart.filter(item => item.productId !== productId));
//     } else {
//       setCart(currentCart => 
//         currentCart.map(item => 
//           item.productId === productId ? { ...item, quantity: newQuantity } : item
//         )
//       );
//     }
//   };

//   const handleShowModal = () => {
//     setSubmitSuccess('');
//     setSubmitError('');
//     setIsLoading(false);
//     setShowModal(true);
//     setMetodePembayaran('Transfer Bank');
//     setShowQRIS(false);
//     setBuktiFile(null);
//     setBuktiBase64('');
//     setPreviewBukti(null);
//   };
//   const handleCloseModal = () => setShowModal(false);

//   const handlePaymentChange = (e: ChangeEvent<HTMLSelectElement>) => {
//     const method = e.target.value;
//     setMetodePembayaran(method);
//     setShowQRIS(method === 'QRIS');
//   };

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setBuktiFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setBuktiBase64(reader.result as string);
//         setPreviewBukti(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     } else {
//       setBuktiFile(null);
//       setBuktiBase64('');
//       setPreviewBukti(null);
//     }
//   };

//   const handleSubmitOrder = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!buktiFile) {
//         setSubmitError("Mohon unggah bukti pembayaran.");
//         return;
//     }
//     setIsLoading(true);
//     setSubmitError('');
//     setSubmitSuccess('');

//     const finalNotes = `Metode Bayar: ${metodePembayaran}. ${notes}`;

//     const itemsToSubmit = cart.map(item => ({
//       productId: item.productId,
//       quantity: item.quantity,
//       nama: item.nama,
//       harga: item.harga
//     }));

//     try {
//       const response = await fetch(`${API_URL}/api/orders`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           namaPelanggan,
//           email,
//           notes: finalNotes,
//           items: itemsToSubmit,
//           buktiPembayaranBase64: buktiBase64 
//         }),
//       });

//       if (!response.ok) {
//         const err = await response.json();
//         throw new Error(err.message || 'Gagal mengirim pesanan. Coba lagi.');
//       }
      
//       const newOrder: Order = await response.json();
//       setIsLoading(false);
//       setSubmitSuccess(`Pesanan Anda (${newOrder.orderId}) telah diterima! Admin akan segera menghubungi Anda.`);
      
//       setCart([]);
//       setNamaPelanggan('');
//       setEmail('');
//       setNotes('');
//       setMetodePembayaran('Transfer Bank');
//       setShowQRIS(false);
//       setBuktiFile(null);
//       setBuktiBase64('');
//       setPreviewBukti(null);

//     } catch (err) {
//       setIsLoading(false);
//       if (err instanceof Error) setSubmitError(err.message);
//     }
//   };

//   return (
//     <>
//       <header className="header-top sticky-top">
//   <Navbar expand="lg" className="container">
//     <Navbar.Brand as={Link} href="/" className="navbar-brand">
//       <span className="logo-icon">🥤</span> Di Di Thai Tea
//     </Navbar.Brand>
//     <Navbar.Toggle aria-controls="navbarNav" />

//     <Navbar.Collapse id="navbarNav" className="justify-content-end">

//       <Nav className="align-items-center">
//         <Nav.Link as={Link} href="/" className="nav-link active">Beranda</Nav.Link>
//         <Nav.Link as={Link} href="/about" className="nav-link">Tentang Kami</Nav.Link>
//         <Nav.Link as={Link} href="/services" className="nav-link">Layanan</Nav.Link>
//         <Nav.Link as={Link} href="/dashboard" className="nav-link">Dashboard</Nav.Link>
        
//         <Nav.Link as={Link} href="/contact" className="nav-link d-flex align-items-center">
//           <i className="bi bi-person-lines-fill me-2"></i>
          
//         </Nav.Link>
//       </Nav>

//     </Navbar.Collapse>
//   </Navbar>
// </header>   
//       <main className="container py-5 animate-on-scroll">
//         <h1 className="section-title">Layanan Kami</h1>
//         <div className="row g-5">
//            <div className="col-md-6">
//              <div className="service-box text-center">
//                <img src="/Asset Gambar/ThaiTea Vector.png" className="img-fluid" alt="Pesan Menu" style={{ width: '600px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
//                <h3 className="fw-bold mb-3 mt-4">Pesan Menu (Pickup / Katering)</h3>
//                <p className="mb-4">
//                  Pesan menu favorit Anda untuk diambil di tempat atau untuk acara katering.
//                  Klik tombol di bawah untuk memilih menu dan mengisi detail pesanan.
//                </p>
//                <Button variant="primary" className="btn-order" onClick={handleShowModal} disabled={loadingProducts}>
//                  {loadingProducts ? 'Memuat Menu...' : 'PESAN SEKARANG'}
//                </Button>
//              </div>
//            </div>
           
//            <div className="col-md-6">
//              <div className="service-box text-center">
//                <img src="/Asset Gambar/ThaiTea Vector.png" className="img-fluid" alt="Delivery Service Visual" style={{ width: '600px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
//                <h3 className="fw-bold mb-3 mt-4">Delivery Service</h3>
//                <p className="mb-4">
//                  Nikmati menu favorit Di Di Thai Tea di rumah. Kami kirimkan minuman segar
//                  langsung ke pintu Anda melalui partner delivery kami.
//                </p>
//                <a href="https://gofood.link/a/Fcd1n75" className="btn btn-order ms-2">ORDER VIA GOJEK</a>
//              </div>
//            </div>
//          </div>
//       </main>
      
//       {/* <footer className="main-footer animate-on-scroll" style={{ marginTop: '5rem' }}>
//         <div className="container">
//            <div className="row align-items-center gy-3">
//              <div className="col-md-4 text-center text-md-start">
//                <Link className="navbar-brand text-white" href="/">
//                  <span className="logo-icon text-white">🥤</span> Di Di Thai Tea
//                </Link>
//              </div>
//              <div className="col-md-4 text-center footer-text">
//                <p className="mb-1">© 2025 Di Di Thai Tea. All rights reserved.</p>
//                <a href="#" className="text-white small">Privacy Policy</a> | <a href="#" className="text-white small">Terms</a>
//              </div>
//              <div className="col-md-4 text-center text-md-end footer-social-icons">
//                <a href="#" target="_blank" rel="noopener noreferrer" title="Facebook"><i className="fab fa-facebook-f"></i></a>
//                <a href="#" target="_blank" rel="noopener noreferrer" title="Instagram"><i className="fab fa-instagram"></i></a>
//                <a href="#" target="_blank" rel="noopener noreferrer" title="Twitter"><i className="fab fa-twitter"></i></a>
//              </div>
//            </div>
//          </div>
//       </footer> */}
// {/* Footer New */}
//         <footer className="main-footer animate-on-scroll">
//         <div className="container">
//           <div className="row align-items-center">
//             <div className="col-md-6 text-center text-md-start">
//               <Link className="navbar-brand text-white" href="/">
//                 <span className="logo-icon text-white">🥤</span> Di Di Thai Tea
//               </Link>
//             </div>
//             <div className="col-md-6 text-center text-md-end footer-text mt-3 mt-md-0">
//               <p className="mb-1">&copy; 2025 Di Di Thai Tea. All rights reserved.</p>
//             </div>
//           </div>
//         </div>
//       </footer>

//       <Modal show={showModal} onHide={handleCloseModal} size="xl" centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Formulir Pemesanan</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {submitSuccess && <Alert variant="success">{submitSuccess}</Alert>}
//           {submitError && <Alert variant="danger" onClose={() => setSubmitError('')} dismissible>{submitError}</Alert>}
          
//           {!submitSuccess && (
//             <Form onSubmit={handleSubmitOrder}>
//               <Row>
//                 <Col md={5} style={{ borderRight: '1px solid #eee' }}>
//                   <h5 className="mb-3">Pilih Menu</h5>
//                   <ListGroup style={{maxHeight: '400px', overflowY: 'auto'}}>
//                     {products.map(product => (
//                       <ListGroup.Item key={product._id} className="d-flex align-items-center p-2">
//                         <Image 
//                            src={product.gambarUrl ? `${API_URL}${product.gambarUrl}` : "https://placehold.co/60x60?text=No+Img"} 
//                            alt={product.nama}
//                            rounded
//                            style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '15px' }}
//                            onError={(e) => (e.currentTarget.src = 'https://placehold.co/60x60?text=Error')}
//                         />
//                         <div className="flex-grow-1">
//                           <div className="fw-bold">{product.nama}</div>
//                           <small className="text-muted">Rp {product.harga.toLocaleString('id-ID')}</small>
//                         </div>
//                         <Button size="sm" variant="outline-primary" onClick={() => handleAddToCart(product)}>
//                           + Add
//                         </Button>
//                       </ListGroup.Item>
//                     ))}
//                   </ListGroup>
//                 </Col>

//                 <Col md={4} style={{ borderRight: '1px solid #eee' }}>
//                   <h5 className="mb-3">Keranjang Anda</h5>
//                   <ListGroup variant="flush">
//                     {cart.length === 0 ? (
//                       <div className="text-muted text-center my-5">Keranjang masih kosong.</div>
//                     ) : (
//                       cart.map(item => (
//                         <ListGroup.Item key={item.productId} className="px-0">
//                            <div className="d-flex justify-content-between fw-bold">
//                              <span>{item.nama}</span>
//                              <span>Rp {(item.harga * item.quantity).toLocaleString('id-ID')}</span>
//                            </div>
//                            <div className="d-flex align-items-center mt-2">
//                              <Image 
//                                src={item.gambarUrl ? `${API_URL}${item.gambarUrl}` : "https://placehold.co/40x40?text=."}
//                                rounded
//                                style={{ width: '40px', height: '40px', objectFit: 'cover', marginRight: '10px' }}
//                              />
//                              <InputGroup size="sm" style={{ width: '100px' }}>
//                                <Button variant="outline-secondary" onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}>-</Button>
//                                <Form.Control 
//                                  className="text-center px-0" 
//                                  value={item.quantity} 
//                                  readOnly 
//                                />
//                                <Button variant="outline-secondary" onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}>+</Button>
//                              </InputGroup>
//                            </div>
//                         </ListGroup.Item>
//                       ))
//                     )}
//                   </ListGroup>
                  
//                   {cart.length > 0 && (
//                     <div className="mt-3 p-3 bg-light rounded">
//                       <div className="d-flex justify-content-between h5 mb-0">
//                         <span>Total:</span>
//                         <span className="text-primary fw-bold">Rp {totalPrice.toLocaleString('id-ID')}</span>
//                       </div>
//                     </div>
//                   )}
//                 </Col>

//                 <Col md={3}>
//                   <h5 className="mb-3">Data Pemesan</h5>
//                   <Form.Group className="mb-2"><Form.Label>Nama Anda*</Form.Label><Form.Control type="text" value={namaPelanggan} onChange={(e) => setNamaPelanggan(e.target.value)} required /></Form.Group>
//                   <Form.Group className="mb-2"><Form.Label>Email*</Form.Label><Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Form.Group>

//                   <h5 className="mb-3 mt-4">Pembayaran</h5>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Metode Pembayaran</Form.Label>
//                     <Form.Select value={metodePembayaran} onChange={handlePaymentChange}>
//                       <option value="Transfer Bank">Transfer Bank</option>
//                       <option value="QRIS">QRIS (Scan Barcode)</option>
//                     </Form.Select>
//                   </Form.Group>

//                   {metodePembayaran === 'Transfer Bank' && (
//                     <Alert variant="info" className="text-center small p-2">
//                       <span className="fw-bold">Silakan Transfer ke:</span><br/>
//                       BCA: 123456799<br/>
//                       (a/n Di Di Thai Tea)
//                     </Alert>
//                   )}

//                   {showQRIS && (
//                     <div className="text-center mb-3 p-2 border rounded bg-white shadow-sm">
//                       <p className="mb-1 small fw-bold">Scan QRIS</p>
//                       <Image 
//                         src={`${API_URL}/asset/qris.jpeg.jpg`} 
//                         alt="QRIS" 
//                         fluid 
//                         style={{ maxWidth: '120px', cursor: 'pointer' }} 
//                         onClick={() => setShowQRISModal(true)}
//                       />
//                       <p className="mt-1 mb-0 text-primary fw-bold small">Total: Rp {totalPrice.toLocaleString('id-ID')}</p>
//                       <Button variant="link" size="sm" onClick={() => setShowQRISModal(true)}>Perbesar Gambar</Button>
//                     </div>
//                   )}

//                   <Form.Group className="mb-3">
//                     <Form.Label>Upload Bukti Bayar*</Form.Label>
//                     <Form.Control 
//                       type="file" 
//                       accept="image/png, image/jpeg, image/jpg" 
//                       onChange={handleFileChange}
//                       required
//                     />
//                     {previewBukti && (
//                         <div className="mt-2 text-center">
//                             <Image src={previewBukti} alt="Preview Bukti" fluid style={{ maxHeight: '100px' }} thumbnail />
//                         </div>
//                     )}
//                   </Form.Group>
                  
//                   <Form.Group className="mb-3"><Form.Control as="textarea" rows={1} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Catatan tambahan..." /></Form.Group>
//                   <Button 
//                     variant="primary" 
//                     type="submit" 
//                     className="w-100 py-2 fw-bold" 
//                     disabled={isLoading || cart.length === 0 || !buktiFile} 
//                   >
//                     {isLoading ? 'Memproses...' : 'Kirim Pesanan'}
//                   </Button>
//                 </Col>
//               </Row>
//             </Form>
//           )}
//         </Modal.Body>
//       </Modal>

//       <Modal show={showQRISModal} onHide={() => setShowQRISModal(false)} centered size="sm">
//         <Modal.Header closeButton>
//           <Modal.Title>Scan QRIS</Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="text-center">
//           <Image 
//             src={`${API_URL}/asset/qris.jpeg.jpg`}
//             alt="QRIS" 
//             fluid 
//             style={{ width: '100%' }}
//           />
//           <h4 className="mt-3 text-primary fw-bold">
//             Total: Rp {totalPrice.toLocaleString('id-ID')}
//           </h4>
//         </Modal.Body>
//       </Modal>
//     </>
//   );

// }


// Revisi Source Code (fitur search)

"use client";

import Link from 'next/link';
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { 
  Container, Nav, Navbar, Row, Col, Button, 
  Modal, Form, Alert, InputGroup, ListGroup, Image 
} from 'react-bootstrap';

type Product = {
  _id: string;
  nama: string;
  harga: number;
  gambarUrl: string;
};

type CartItem = {
  productId: string;
  nama: string;
  harga: number;
  quantity: number;
  gambarUrl: string;
};

type Order = {
  orderId: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ServicesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState(''); // <--- STATE BARU UNTUK SEARCH

  const [namaPelanggan, setNamaPelanggan] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [metodePembayaran, setMetodePembayaran] = useState('Transfer Bank'); 
  const [showQRIS, setShowQRIS] = useState(false); 
  const [buktiFile, setBuktiFile] = useState<File | null>(null);
  const [buktiBase64, setBuktiBase64] = useState<string>('');
  const [previewBukti, setPreviewBukti] = useState<string | null>(null);
  const [showQRISModal, setShowQRISModal] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const response = await fetch(`${API_URL}/api/products`); 
        if (!response.ok) throw new Error('Gagal memuat menu');
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err) {
        if (err instanceof Error) setSubmitError(err.message);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const total = cart.reduce((acc, item) => acc + (item.harga * item.quantity), 0);
    setTotalPrice(total);
  }, [cart]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
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
  const filteredProducts = products.filter((product) =>
    product.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (product: Product) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.productId === product._id);
      if (existingItem) {
        return currentCart.map(item => 
          item.productId === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...currentCart, { 
          productId: product._id, 
          nama: product.nama, 
          harga: product.harga, 
          gambarUrl: product.gambarUrl,
          quantity: 1 
        }];
      }
    });
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(currentCart => currentCart.filter(item => item.productId !== productId));
    } else {
      setCart(currentCart => 
        currentCart.map(item => 
          item.productId === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handleShowModal = () => {
    setSubmitSuccess('');
    setSubmitError('');
    setIsLoading(false);
    setShowModal(true);
    setMetodePembayaran('Transfer Bank');
    setShowQRIS(false);
    setBuktiFile(null);
    setBuktiBase64('');
    setPreviewBukti(null);
    setSearchTerm(''); 
  };
  const handleCloseModal = () => setShowModal(false);

  const handlePaymentChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const method = e.target.value;
    setMetodePembayaran(method);
    setShowQRIS(method === 'QRIS');
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBuktiFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBuktiBase64(reader.result as string);
        setPreviewBukti(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setBuktiFile(null);
      setBuktiBase64('');
      setPreviewBukti(null);
    }
  };

  const handleSubmitOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (!buktiFile) {
        setSubmitError("Mohon unggah bukti pembayaran.");
        return;
    }
    setIsLoading(true);
    setSubmitError('');
    setSubmitSuccess('');

    const finalNotes = `Metode Bayar: ${metodePembayaran}. ${notes}`;
    const itemsToSubmit = cart.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      nama: item.nama,
      harga: item.harga
    }));

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          namaPelanggan,
          email,
          notes: finalNotes,
          items: itemsToSubmit,
          buktiPembayaranBase64: buktiBase64 
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Gagal mengirim pesanan. Coba lagi.');
      }
      
      const newOrder: Order = await response.json();
      setIsLoading(false);
      setSubmitSuccess(`Pesanan Anda (${newOrder.orderId}) telah diterima! Admin akan segera menghubungi Anda.`);
      
      setCart([]);
      setNamaPelanggan('');
      setEmail('');
      setNotes('');
      setMetodePembayaran('Transfer Bank');
      setShowQRIS(false);
      setBuktiFile(null);
      setBuktiBase64('');
      setPreviewBukti(null);

    } catch (err) {
      setIsLoading(false);
      if (err instanceof Error) setSubmitError(err.message);
    }
  };

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
               <Nav.Link as={Link} href="/services" className="nav-link active">Layanan</Nav.Link>
               <Nav.Link as={Link} href="/dashboard" className="nav-link">Dashboard</Nav.Link>
               <Nav.Link as={Link} href="/contact" className="nav-link d-flex align-items-center">
                 Hubungi Kami
               </Nav.Link>
             </Nav>
           </Navbar.Collapse>
         </Navbar>
      </header>

      <main className="container py-5 animate-on-scroll">
        <h1 className="section-title">Layanan Kami</h1>
        <div className="row g-5">
           <div className="col-md-6">
             <div className="service-box text-center">
               <img src="/Asset Gambar/ThaiTea Vector.png" className="img-fluid" alt="Pesan Menu" style={{ width: '600px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
               <h3 className="fw-bold mb-3 mt-4">Pesan Menu (Pickup / Katering)</h3>
               <p className="mb-4">
                 Pesan menu favorit Anda untuk diambil di tempat atau untuk acara katering.
                 Klik tombol di bawah untuk memilih menu dan mengisi detail pesanan.
               </p>
               <Button variant="primary" className="btn-order" onClick={handleShowModal} disabled={loadingProducts}>
                 {loadingProducts ? 'Memuat Menu...' : 'PESAN SEKARANG'}
               </Button>
             </div>
           </div>
           
           <div className="col-md-6">
             <div className="service-box text-center">
               <img src="/Asset Gambar/ThaiTea Vector.png" className="img-fluid" alt="Delivery Service Visual" style={{ width: '600px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
               <h3 className="fw-bold mb-3 mt-4">Delivery Service</h3>
               <p className="mb-4">
                 Nikmati menu favorit Di Di Thai Tea di rumah. Kami kirimkan minuman segar
                 langsung ke pintu Anda melalui partner delivery kami.
               </p>
               <a href="https://gofood.link/a/Fcd1n75" className="btn btn-order ms-2">ORDER VIA GOJEK</a>
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
              <p className="mb-1">&copy; 2025 Di Di Thai Tea. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      <Modal show={showModal} onHide={handleCloseModal} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>Formulir Pemesanan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {submitSuccess && <Alert variant="success">{submitSuccess}</Alert>}
          {submitError && <Alert variant="danger" onClose={() => setSubmitError('')} dismissible>{submitError}</Alert>}
          
          {!submitSuccess && (
            <Form onSubmit={handleSubmitOrder}>
              <Row>
                <Col md={5} style={{ borderRight: '1px solid #eee' }}>
                  <h5 className="mb-2">Pilih Menu</h5>
                  
                  <Form.Group className="mb-3" controlId="searchMenu">
                    <Form.Control
                      type="text"
                      placeholder="Cari nama menu..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </Form.Group>
                  {/* ------------------------- */}

                  <ListGroup style={{maxHeight: '400px', overflowY: 'auto'}}>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(product => (
                        <ListGroup.Item key={product._id} className="d-flex align-items-center p-2">
                          <Image 
                             src={product.gambarUrl ? `${API_URL}${product.gambarUrl}` : "https://placehold.co/60x60?text=No+Img"} 
                             alt={product.nama}
                             rounded
                             style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '15px' }}
                             onError={(e) => (e.currentTarget.src = 'https://placehold.co/60x60?text=Error')}
                          />
                          <div className="flex-grow-1">
                            <div className="fw-bold">{product.nama}</div>
                            <small className="text-muted">Rp {product.harga.toLocaleString('id-ID')}</small>
                          </div>
                          <Button size="sm" variant="outline-primary" onClick={() => handleAddToCart(product)}>
                            + Add
                          </Button>
                        </ListGroup.Item>
                      ))
                    ) : (
                      <div className="text-center py-3 text-muted small">Menu tidak ditemukan</div>
                    )}
                  </ListGroup>
                </Col>

                <Col md={4} style={{ borderRight: '1px solid #eee' }}>
                  <h5 className="mb-3">Keranjang Anda</h5>
                  <ListGroup variant="flush">
                    {cart.length === 0 ? (
                      <div className="text-muted text-center my-5">Keranjang masih kosong.</div>
                    ) : (
                      cart.map(item => (
                        <ListGroup.Item key={item.productId} className="px-0">
                           <div className="d-flex justify-content-between fw-bold">
                             <span>{item.nama}</span>
                             <span>Rp {(item.harga * item.quantity).toLocaleString('id-ID')}</span>
                           </div>
                           <div className="d-flex align-items-center mt-2">
                             <Image 
                               src={item.gambarUrl ? `${API_URL}${item.gambarUrl}` : "https://placehold.co/40x40?text=."}
                               rounded
                               style={{ width: '40px', height: '40px', objectFit: 'cover', marginRight: '10px' }}
                             />
                             <InputGroup size="sm" style={{ width: '100px' }}>
                               <Button variant="outline-secondary" onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}>-</Button>
                               <Form.Control 
                                 className="text-center px-0" 
                                 value={item.quantity} 
                                 readOnly 
                               />
                               <Button variant="outline-secondary" onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}>+</Button>
                             </InputGroup>
                           </div>
                        </ListGroup.Item>
                      ))
                    )}
                  </ListGroup>
                  
                  {cart.length > 0 && (
                    <div className="mt-3 p-3 bg-light rounded">
                      <div className="d-flex justify-content-between h5 mb-0">
                        <span>Total:</span>
                        <span className="text-primary fw-bold">Rp {totalPrice.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  )}
                </Col>

                <Col md={3}>
                  <h5 className="mb-3">Data Pemesan</h5>
                  <Form.Group className="mb-2"><Form.Label>Nama Anda*</Form.Label><Form.Control type="text" value={namaPelanggan} onChange={(e) => setNamaPelanggan(e.target.value)} required /></Form.Group>
                  <Form.Group className="mb-2"><Form.Label>Email*</Form.Label><Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Form.Group>

                  <h5 className="mb-3 mt-4">Pembayaran</h5>
                  <Form.Group className="mb-3">
                    <Form.Label>Metode Pembayaran</Form.Label>
                    <Form.Select value={metodePembayaran} onChange={handlePaymentChange}>
                      <option value="Transfer Bank">Transfer Bank</option>
                      <option value="QRIS">QRIS (Scan Barcode)</option>
                    </Form.Select>
                  </Form.Group>

                  {metodePembayaran === 'Transfer Bank' && (
                    <Alert variant="info" className="text-center small p-2">
                      <span className="fw-bold">Silakan Transfer ke:</span><br/>
                      BCA: 123456799<br/>
                      (a/n Di Di Thai Tea)
                    </Alert>
                  )}

                  {showQRIS && (
                    <div className="text-center mb-3 p-2 border rounded bg-white shadow-sm">
                      <p className="mb-1 small fw-bold">Scan QRIS</p>
                      <Image 
                        src={`${API_URL}/asset/qris.jpeg.jpg`} 
                        alt="QRIS" 
                        fluid 
                        style={{ maxWidth: '120px', cursor: 'pointer' }} 
                        onClick={() => setShowQRISModal(true)}
                      />
                      <p className="mt-1 mb-0 text-primary fw-bold small">Total: Rp {totalPrice.toLocaleString('id-ID')}</p>
                      <Button variant="link" size="sm" onClick={() => setShowQRISModal(true)}>Perbesar Gambar</Button>
                    </div>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label>Upload Bukti Bayar*</Form.Label>
                    <Form.Control 
                      type="file" 
                      accept="image/png, image/jpeg, image/jpg" 
                      onChange={handleFileChange}
                      required 
                    />
                    {previewBukti && (
                        <div className="mt-2 text-center">
                            <Image src={previewBukti} alt="Preview Bukti" fluid style={{ maxHeight: '100px' }} thumbnail />
                        </div>
                    )}
                  </Form.Group>
                  
                  <Form.Group className="mb-3"><Form.Control as="textarea" rows={1} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Catatan tambahan..." /></Form.Group>
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 py-2 fw-bold" 
                    disabled={isLoading || cart.length === 0 || !buktiFile} 
                  >
                    {isLoading ? 'Memproses...' : 'Kirim Pesanan'}
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showQRISModal} onHide={() => setShowQRISModal(false)} centered size="sm">
        <Modal.Header closeButton>
          <Modal.Title>Scan QRIS</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Image 
            src={`${API_URL}/asset/qris.jpeg.jpg`}
            alt="QRIS" 
            fluid 
            style={{ width: '100%' }}
          />
          <h4 className="mt-3 text-primary fw-bold">
            Total: Rp {totalPrice.toLocaleString('id-ID')}
          </h4>
        </Modal.Body>
      </Modal>
    </>
  );
}


