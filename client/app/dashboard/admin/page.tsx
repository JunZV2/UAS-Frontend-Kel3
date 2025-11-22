"use client";

import Link from 'next/link';
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { 
  Container, Nav, Navbar, Tabs, Tab, Table, 
  Card, Row, Col, ButtonGroup, Alert,
  Form, Button, Modal, Image, Spinner, ListGroup
} from 'react-bootstrap';

type OrderItem = {
  productId: string;
  nama: string;
  harga: number;
  quantity: number;
};

type Order = {
  _id: string; 
  orderId: string;
  namaPelanggan: string;
  tanggalPesanan: string;
  total: number;
  status: string;
  notes: string;
  buktiPembayaranUrl?: string; 
  items: OrderItem[];
};

type Product = {
  _id: string;
  nama: string;
  deskripsi: string;
  harga: number;
  gambarUrl: string; 
};

type ReportData = {
  title: string;
  totalPenjualan: number;
  jumlahOrder: number;
  startDate: string; 
  endDate: string;   
  totalPenjualanSebelumnya: number;
  jumlahOrderSebelumnya: number;
  persentasePerubahan: number;
};

type Message = {
  _id: string;
  nama: string;
  email: string;
  pesan: string;
  tanggal: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';;

type ProductFormProps = {
  formState: {
    nama: string;
    deskripsi: string;
    harga: number;
    gambarUrl: string;
    gambarBase64: string;
  };
  onFormChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  formId: string;
};

const ProductFormFields: React.FC<ProductFormProps> = ({ 
  formState, 
  onFormChange, 
  onImageChange, 
  formId 
}) => {
  const fileInputId = `productImageInput-${formId}`;
  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Nama Produk</Form.Label>
        <Form.Control 
          type="text" 
          name="nama" 
          value={formState.nama} 
          onChange={onFormChange}
          required 
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Deskripsi</Form.Label>
        <Form.Control 
          as="textarea" 
          rows={3} 
          name="deskripsi" 
          value={formState.deskripsi} 
          onChange={onFormChange}
          required 
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Harga (Rupiah)</Form.Label>
        <Form.Control 
          type="number" 
          name="harga" 
          value={formState.harga} 
          onChange={onFormChange}
          required 
          min="0"
        />
      </Form.Group>
      
      {}
      <Form.Group className="mb-3">
        <Form.Label>Gambar Produk</Form.Label>
        <div 
          className="custom-file-upload"
          onClick={() => {
            document.getElementById(fileInputId)?.click();
          }}
        >
          <input 
            id={fileInputId}
            type="file" 
            accept="image/png, image/jpeg, image/webp" 
            onChange={onImageChange}
            style={{ display: 'none' }}
          />
          {formState.gambarBase64 ? (
            <Image src={formState.gambarBase64} alt="Preview" fluid style={{ maxHeight: '150px' }} />
          ) : formState.gambarUrl ? (
            <Image src={`${API_URL}${formState.gambarUrl}`} alt="Gambar Saat Ini" fluid style={{ maxHeight: '150px' }} />
          ) : (
            <div className="placeholder-image">
              <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-cloud-arrow-up-fill" viewBox="0 0 16 16">
                <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.427-1.577 2.309C.856 7.58 1 9.052 1 10a7 7 0 0 0 14 0c0-1.049-.147-2.418-1.166-3.807-.263-.56-1.043-1.256-1.766-1.933A6.517 6.517 0 0 0 8 2zm2.354 5.354a.5.5 0 0 1-.708 0L7.5 6.207V9.5a.5.5 0 0 1-1 0V6.207L5.354 7.354a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708z"/>
              </svg>
              <p className="mt-2 mb-0">Klik untuk upload foto</p>
            </div>
          )}
        </div>
        <Form.Text className="text-muted text-center d-block mt-2">
          Format: PNG, JPG, WebP.
        </Form.Text>
      </Form.Group>
    </>
  );
};

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [history, setHistory] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [updatedStatus, setUpdatedStatus] = useState('');
  const [updatedTotal, setUpdatedTotal] = useState(0);
  
  const [laporan, setLaporan] = useState<ReportData | null>(null);
  const [loadingLaporan, setLoadingLaporan] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false); 
  const [productForm, setProductForm] = useState({
    _id: '',
    nama: '', 
    deskripsi: '', 
    harga: 0, 
    gambarUrl: '',
    gambarBase64: ''
  });

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/api/orders`);
      if (!response.ok) {
        throw new Error(`Gagal mengambil data pesanan: ${response.statusText}`);
      }
      const data: Order[] = await response.json();
      setOrders(data);
      setHistory(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      console.error('Fetch Orders Gagal:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);
      if (!response.ok) {
        throw new Error(`Gagal mengambil data produk: ${response.statusText}`);
      }
      const data: Product[] = await response.json();
      setProducts(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      console.error('Fetch Products Gagal:', err);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_URL}/api/messages`);
      if (!response.ok) {
        throw new Error(`Gagal mengambil data masukan: ${response.statusText}`);
      }
      const data: Message[] = await response.json();
      setMessages(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      console.error('Fetch Messages Gagal:', err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        await Promise.all([fetchOrders(), fetchProducts(), fetchMessages()]);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []); 

  useEffect(() => {
    if (loading) return; 
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
  }, [loading]); 

  const handleOpenUpdateModal = (order: Order) => {
    setCurrentOrder(order); 
    setUpdatedStatus(order.status); 
    setUpdatedTotal(order.total); 
    setShowOrderModal(true); 
  };

  const handleUpdateOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentOrder) return;
    try {
      const response = await fetch(`${API_URL}/api/orders/${currentOrder._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: updatedStatus,
          total: updatedTotal
        }),
      });
      if (!response.ok) throw new Error('Gagal menyimpan perubahan');
      await fetchOrders(); 
      setShowOrderModal(false); 
      setCurrentOrder(null); 
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    setError('');
    if (!window.confirm('Apakah Anda yakin ingin menghapus masukan ini?')) {
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/messages/${messageId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menghapus pesan');
      }
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg._id !== messageId)
      );
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };
  
  const resetProductForm = () => {
    setProductForm({ _id: '', nama: '', deskripsi: '', harga: 0, gambarUrl: '', gambarBase64: '' });
  };
  const handleProductFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductForm(prev => ({ ...prev, [name]: name === 'harga' ? parseFloat(value) : value }));
  };
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm(prev => ({ ...prev, gambarBase64: reader.result as string, gambarUrl: '' }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleOpenAddModal = () => {
    resetProductForm();
    setShowAddProductModal(true);
  };
  const handleOpenEditModal = (product: Product) => {
    setProductForm({
      _id: product._id,
      nama: product.nama,
      deskripsi: product.deskripsi,
      harga: product.harga,
      gambarUrl: product.gambarUrl,
      gambarBase64: ''
    });
    setShowEditProductModal(true);
  };
  const handleAddNewProduct = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const { nama, deskripsi, harga, gambarBase64 } = productForm; 
    try {
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, deskripsi, harga, gambarBase64 }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menyimpan produk');
      }
      await fetchProducts();
      setShowAddProductModal(false); 
      resetProductForm();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };
  const handleUpdateProduct = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const { _id, nama, deskripsi, harga, gambarBase64 } = productForm;
    if (!_id) return;
    try {
      const response = await fetch(`${API_URL}/api/products/${_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, deskripsi, harga, gambarBase64 }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal memperbarui produk');
      }
      await fetchProducts(); 
      setShowEditProductModal(false); 
      resetProductForm();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };
  const handleDeleteProduct = async (productId: string) => {
    setError('');
    if (!window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
    try {
      const response = await fetch(`${API_URL}/api/products/${productId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menghapus produk');
      }
      await fetchProducts();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };
  
  const calculateOverview = () => {
    const completedOrders = history.filter(order => order.status === 'Selesai');
    const totalPenjualan = completedOrders.reduce((acc, order) => acc + order.total, 0);
    const totalOrderCount = history.length;
    return {
      totalPenjualan: `Rp ${totalPenjualan.toLocaleString('id-ID')}`,
      totalOrder: totalOrderCount
    };
  };
  const overview = calculateOverview();

  const handleFetchLaporan = async (e: FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setError('Silakan pilih tanggal mulai dan tanggal selesai.');
      return;
    }
    setError('');
    setLoadingLaporan(true);
    setLaporan(null); 

    try {
      const url = `${API_URL}/api/reports/sales/custom?startDate=${startDate}&endDate=${endDate}`;
      const response = await fetch(url);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Gagal mengambil laporan');
      }
      const data: ReportData = await response.json();
      setLaporan(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoadingLaporan(false);
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
               <Nav.Link as={Link} href="/" className="nav-link">Lihat Situs</Nav.Link>
               <Nav.Link as={Link} href="/logout" className="nav-link">Logout</Nav.Link>
             </Nav>
           </Navbar.Collapse>
         </Navbar>
      </header>

      <Container as="main" className="py-5 animate-on-scroll">
        <h1 className="section-title">Admin Dashboard</h1>
        
        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
        
        {loading && <div className="text-center"><div className="spinner-border" /></div>}

        {!loading && (
          <Tabs defaultActiveKey="pesanan" id="admin-dashboard-tabs" className="mb-3" fill>
            
            {}
            <Tab eventKey="pesanan" title="Pesanan">
              <h2 className="h4 mb-3">Manajemen Pesanan</h2>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID Pesanan</th>
                    <th>Nama Pelanggan</th>
                    <th>Notes</th>
                    <th>Tanggal</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order.orderId}</td>
                      <td>{order.namaPelanggan}</td>
                      <td>{order.notes}</td>
                      <td>{new Date(order.tanggalPesanan).toLocaleDateString('id-ID')}</td>
                      <td>Rp {(order.total ?? 0).toLocaleString('id-ID')}</td>
                      <td>
                        <span className={`badge bg-${
                          order.status === 'Selesai' ? 'success' :
                          order.status === 'Sedang Diproses' ? 'primary' :
                          order.status === 'Batal' ? 'danger' : 'secondary'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        {}
                        <Button 
                          variant="primary"
                          size="sm" 
                          onClick={() => handleOpenUpdateModal(order)}
                        >
                          Detail
                        </Button>
                        {}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>

            {}
            <Tab eventKey="overview" title="Overview">
              <h2 className="h4 mb-3">Overview Dashboard</h2>
              <Row className="g-4 mb-4">
                <Col md={6}>
                  <Card className="text-center">
                    <Card.Header>Total Penjualan (Selesai)</Card.Header>
                    <Card.Body>
                      <Card.Title className="display-5 fw-bold">{overview.totalPenjualan}</Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="text-center">
                    <Card.Header>Total Order (Masuk)</Card.Header>
                    <Card.Body>
                      <Card.Title className="display-5 fw-bold">{overview.totalOrder}</Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <h2 className="h4 my-3">History Order (Aliran Transaksi)</h2>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID Transaksi</th>
                    <th>Tanggal</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((trx) => (
                    <tr key={trx._id}>
                      <td>{trx.orderId}</td>
                      <td>{new Date(trx.tanggalPesanan).toLocaleDateString('id-ID')}</td>
                      <td>Rp {(trx.total ?? 0).toLocaleString('id-ID')}</td>
                      <td>
                        <span className={`badge bg-${
                          trx.status === 'Selesai' ? 'success' :
                          trx.status === 'Sedang Diproses' ? 'primary' :
                          trx.status === 'Batal' ? 'danger' : 'secondary'
                        }`}>
                          {trx.status}
                        </span>
                      </td>
                      <td>{trx.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>

            {}
            <Tab eventKey="menu" title="Menu">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h4 mb-0">Manajemen Menu</h2>
                <Button variant="primary" onClick={handleOpenAddModal}>
                   + Tambah Menu Baru
                </Button>
              </div>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Gambar</th>
                    <th>Nama Produk</th>
                    <th>Deskripsi</th>
                    <th>Harga</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <Image 
                          src={product.gambarUrl ? `${API_URL}${product.gambarUrl}` : `https://placehold.co/80x60/e9ecef/adb5bd?text=No+Image`} 
                          alt={product.nama} 
                          thumbnail
                          style={{objectFit: 'cover', width: '80px', height: '60px'}}
                          onError={(e) => (e.currentTarget.src = 'https://placehold.co/80x60/f8d7da/dc3545?text=Error')}
                        />
                      </td>
                      <td>{product.nama}</td>
                      <td>{product.deskripsi}</td>
                      <td>Rp {product.harga.toLocaleString('id-ID')}</td>
                      <td>
                        <ButtonGroup>
                          <Button 
                            variant="info" 
                            size="sm" 
                            className="me-2"
                            onClick={() => handleOpenEditModal(product)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="danger" 
                            size="sm" 
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            Delete
                          </Button>
                        </ButtonGroup>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>
            
            {}
            <Tab eventKey="laporan" title="Laporan">
              <h2 className="h4 mb-3">Laporan Penjualan Kustom</h2>
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <Card.Title as="h5">Pilih Rentang Tanggal</Card.Title>
                  <Form onSubmit={handleFetchLaporan}>
                    <Row className="align-items-end g-3">
                      <Col md={4} sm={6}>
                        <Form.Group>
                          <Form.Label>Tanggal Mulai</Form.Label>
                          <Form.Control 
                            type="date" 
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            max={endDate || undefined} 
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4} sm={6}>
                        <Form.Group>
                          <Form.Label>Tanggal Selesai</Form.Label>
                          <Form.Control 
                            type="date" 
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={startDate || undefined} 
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4} sm={12}>
                        <Button variant="primary" type="submit" className="w-100" disabled={loadingLaporan}>
                          {loadingLaporan ? (
                            <>
                              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                              <span className="ms-2">Memuat...</span>
                            </>
                          ) : 'Tampilkan Laporan'}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>

              {loadingLaporan && (
                <div className="text-center my-4">
                  <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                  <p className="mt-2 text-muted">Mencari data laporan...</p>
                </div>
              )}

              {!loadingLaporan && laporan && (
                <Row>
                  <Col md={7}>
                    <Card className="shadow-sm mb-3">
                      <Card.Header as="h5">Hasil Laporan Penjualan</Card.Header>
                      <Card.Body>
                        <Card.Title className="display-6 fw-bold text-primary">
                          {`Rp ${laporan.totalPenjualan.toLocaleString('id-ID')}`}
                        </Card.Title>
                        <Card.Text className="mb-0">
                          Berdasarkan <strong>{laporan.jumlahOrder}</strong> pesanan selesai
                        </Card.Text>
                        <Card.Text className="text-muted small">
                          dari {new Date(laporan.startDate).toLocaleDateString('id-ID')} sampai {new Date(laporan.endDate).toLocaleDateString('id-ID')}.
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={5}>
                    <Card className="shadow-sm mb-3">
                      <Card.Header as="h5">Perbandingan</Card.Header>
                      <Card.Body className="text-center">
                        <Card.Title className={`display-6 fw-bold ${
                          (laporan.persentasePerubahan ?? 0) > 0 ? 'text-success' :
                          (laporan.persentasePerubahan ?? 0) < 0 ? 'text-danger' : 'text-muted'
                        }`}>
                          {(laporan.persentasePerubahan ?? 0) > 0 ? '↑' : (laporan.persentasePerubahan ?? 0) < 0 ? '↓' : ''}
                          {Math.abs(laporan.persentasePerubahan ?? 0).toFixed(1)}%
                        </Card.Title>
                        <Card.Text className="text-muted">
                          Dibandingkan periode sebelumnya (Rp {laporan.totalPenjualanSebelumnya?.toLocaleString('id-ID') ?? 0}).
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}
              
              {!loadingLaporan && !laporan && !error && (
                 <Alert variant="info" className="text-center">
                   Silakan pilih rentang tanggal di atas untuk melihat laporan.
                 </Alert>
              )}
            </Tab>

            {}
            <Tab eventKey="masukan" title="Masukan">
              <h2 className="h4 mb-3">Kritik & Saran Pelanggan</h2>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Pesan</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.length > 0 ? (
                    messages.map((msg) => (
                      <tr key={msg._id}>
                        <td style={{ minWidth: '150px' }}>{new Date(msg.tanggal).toLocaleString('id-ID')}</td>
                        <td>{msg.nama}</td>
                        <td><a href={`mailto:${msg.email}`}>{msg.email}</a></td>
                        <td style={{ minWidth: '350px' }}>{msg.pesan}</td>
                        <td>
                          <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => handleDeleteMessage(msg._id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center">Belum ada masukan.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Tab>

          </Tabs>
        )}
      </Container>
      
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

      {}
      <Modal show={showAddProductModal} onHide={() => { setShowAddProductModal(false); resetProductForm(); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Menu Baru</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddNewProduct}>
            <ProductFormFields formState={productForm} onFormChange={handleProductFormChange} onImageChange={handleImageChange} formId="add-new" />
            <Button variant="primary" type="submit" className="w-100">Simpan Produk</Button>
          </Form>
        </Modal.Body>
      </Modal>
      
      <Modal show={showEditProductModal} onHide={() => { setShowEditProductModal(false); resetProductForm(); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Produk</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateProduct}>
            <ProductFormFields formState={productForm} onFormChange={handleProductFormChange} onImageChange={handleImageChange} formId="edit-existing" />
            <Button variant="primary" type="submit" className="w-100">Simpan Perubahan</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {}
      <Modal show={showOrderModal} onHide={() => setShowOrderModal(false)} centered>
         <Modal.Header closeButton>
           <Modal.Title>Detail Pesanan: {currentOrder?.orderId}</Modal.Title>
         </Modal.Header>
         <Modal.Body>
           
           {}
           {currentOrder?.buktiPembayaranUrl ? (
             <div className="mb-3 text-center p-3 bg-light border rounded">
               <p className="fw-bold mb-2">Bukti Pembayaran Pelanggan:</p>
               <Image 
                 src={`${API_URL}${currentOrder.buktiPembayaranUrl}`} 
                 alt="Bukti Pembayaran" 
                 thumbnail 
                 fluid 
                 style={{ maxHeight: '250px', objectFit: 'contain' }}
               />
               <div className="d-grid mt-2">
                 <Button 
                   variant="outline-primary" 
                   size="sm" 
                   href={`${API_URL}${currentOrder.buktiPembayaranUrl}`} 
                   target="_blank"
                 >
                   Buka Ukuran Penuh
                 </Button>
               </div>
             </div>
           ) : (
             <Alert variant="warning" className="mb-3 py-2 text-center small">
               Tidak ada bukti pembayaran yang dilampirkan.
             </Alert>
           )}
           
           {}
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Detail Item Pesanan:</Form.Label>
              <ListGroup variant="flush" style={{ maxHeight: '150px', overflowY: 'auto' }} className="border rounded">
                {currentOrder?.items && currentOrder.items.length > 0 ? (
                  currentOrder.items.map((item, index) => (
                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="fw-bold">{item.quantity}x</span> {item.nama}
                      </div>
                      <span className="text-muted">
                        Rp {(item.harga * item.quantity).toLocaleString('id-ID')}
                      </span>
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item>Tidak ada item detail.</ListGroup.Item>
                )}
              </ListGroup>
            </Form.Group>
           {}

           <Form onSubmit={handleUpdateOrder}>
             <Form.Group className="mb-3">
               <Form.Label>Nama Pelanggan</Form.Label>
               <Form.Control type="text" value={currentOrder?.namaPelanggan || ''} readOnly disabled />
             </Form.Group>
             <Form.Group className="mb-3">
               <Form.Label>Notes</Form.Label>
               <Form.Control as="textarea" rows={3} value={currentOrder?.notes || ''} readOnly disabled />
             </Form.Group>
             <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Status Pesanan</Form.Label>
                  <Form.Select 
                    value={updatedStatus} 
                    onChange={(e) => setUpdatedStatus(e.target.value)}
                  >
                    <option value="Belum">Belum</option>
                    <option value="Sedang Diproses">Sedang Diproses</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Batal">Batal</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Total Harga (Rp)</Form.Label>
                  <Form.Control 
                    type="number" 
                    value={updatedTotal}
                    onChange={(e) => setUpdatedTotal(parseFloat(e.target.value) || 0)}
                  />
                </Form.Group>
              </Col>
             </Row>
            
             <Button variant="primary" type="submit" className="w-100">
               Simpan Perubahan
             </Button>
           </Form>
         </Modal.Body>
      </Modal>
    </>
  );

}
