const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  email: { type: String, required: true },
  pesan: { type: String, required: true },
  tanggal: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);