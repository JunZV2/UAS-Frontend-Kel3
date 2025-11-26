const Order = require('../models/Order');
const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

const saveImageToFile = (base64Data) => {
  if (!base64Data || !base64Data.startsWith('data:image')) {
      return null;
  }

  try {
      const parts = base64Data.split(';base64,');
      const mimeType = parts[0].split(':')[1];
      const ext = mimeType.split('/')[1];
      const imageData = parts[1];
      const filename = `bukti-${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`;
      
      const imagePath = path.join(__dirname, '..', '..', 'public', 'uploads', filename);
      const publicUrl = `/uploads/${filename}`; 
      
      fs.writeFileSync(imagePath, imageData, { encoding: 'base64' });
      console.log(`[ORDER] Bukti pembayaran disimpan: ${publicUrl}`);
      
      return publicUrl; 
  } catch (error) {
      console.error('[ERROR] Gagal menyimpan bukti pembayaran:', error);
      return null;
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { namaPelanggan, email, notes, items, buktiPembayaranBase64 } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Keranjang belanja tidak boleh kosong' });
    }
    if (!namaPelanggan || !email) {
      return res.status(400).json({ message: 'Nama dan Email wajib diisi' });
    }

    let calculatedTotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Produk dengan ID ${item.productId} tidak ditemukan` });
      }
      const itemTotal = product.harga * item.quantity;
      calculatedTotal += itemTotal;
      orderItems.push({
        productId: product._id,
        nama: product.nama,
        harga: product.harga,
        quantity: item.quantity
      });
    }

    let buktiUrl = '';
    if (buktiPembayaranBase64) {
        buktiUrl = saveImageToFile(buktiPembayaranBase64);
    }


    const uniqueId = `DDT-${Date.now().toString().slice(-6)}`;

    const newOrder = new Order({
      orderId: uniqueId,
      namaPelanggan,
      email,
      notes,
      items: orderItems,
      total: calculatedTotal,
      buktiPembayaranUrl: buktiUrl || ''
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error createOrder:", error);
    res.status(400).json({ message: 'Gagal membuat pesanan', error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order tidak ditemukan' });
    }

    res.status(200).json({ message: 'Order berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ tanggalPesanan: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data pesanan', error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: 'Order tidak ditemukan' });
    }
  } catch (error) {
    console.error("Error getOrderById:", error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Order tidak ditemukan (ID tidak valid)' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { status, total } = req.body;
    const orderId = req.params.id; 

    const updateData = {};
    if (status) updateData.status = status;
    if (total !== undefined) updateData.total = total; 

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: updateData }, 
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order tidak ditemukan' });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: 'Gagal update pesanan', error: error.message });
  }
};

