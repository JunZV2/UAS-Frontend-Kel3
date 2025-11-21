const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: [true, 'Nama produk wajib dii si'],
  },
  deskripsi: {
    type: String,
    required: [true, 'Deskripsi wajib diisi'],
  },
  harga: {
    type: Number,
    required: [true, 'Harga wajib diisi'],
  },
  gambarUrl: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('Product', productSchema);