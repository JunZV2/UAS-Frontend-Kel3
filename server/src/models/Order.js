const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  nama: {
    type: String,
    required: true,
  },
  harga: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  namaPelanggan: {
    type: String,
    required: [true, 'Nama pelanggan wajib diisi'],
  },
  email: {
    type: String,
    required: [true, 'Email pelanggan wajib diisi'],
  },

  items: [orderItemSchema], 
  
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Belum', 'Sedang Diproses', 'Selesai', 'Batal'],
    default: 'Belum',
  },
  notes: {
    type: String,
  },
  tanggalPesanan: {
    type: Date,
    default: Date.now,
  },

  buktiPembayaranUrl: { type: String }
});

module.exports = mongoose.model('Order', orderSchema);