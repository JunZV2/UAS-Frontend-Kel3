const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors()); 
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


const publicDirectoryPath = path.join(__dirname, 'public');
const uploadDirectoryPath = path.join(publicDirectoryPath, 'uploads');


if (!fs.existsSync(uploadDirectoryPath)) {
  fs.mkdirSync(uploadDirectoryPath, { recursive: true });
  console.log(`Folder 'public/uploads' telah dibuat di: ${uploadDirectoryPath}`);
}

app.use(express.static(publicDirectoryPath));


app.get('/api/test', (req, res) => {
  res.json({ message: 'Halo! Server backend sudah berjalan!' });
});

const orderRoutes = require('./src/routes/orderRoutes');
app.use('/api/orders', orderRoutes);

const productRoutes = require('./src/routes/productRoutes');
app.use('/api/products', productRoutes);

const reportRoutes = require('./src/routes/reportRoutes');
app.use('/api/reports', reportRoutes);


const messageRoutes = require('./src/routes/messageRoutes');app.use('/api/messages', messageRoutes); // <-- TAMBAHKAN INI

const startServer = async () => {
  try {
    if (!MONGODB_URI) throw new Error('MONGODB_URI tidak ditemukan di file .env');
    console.log('Mencoba terhubung ke MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('Berhasil terhubung ke MongoDB');

    app.listen(PORT, () => {
      console.log(`Server backend berjalan di http://localhost:${PORT}`);
      console.log(`Mengizinkan request dari semua origin (cors())`);
      console.log(`Menyajikan file dari: ${publicDirectoryPath}`);
    });

  } catch (err) {
    console.error('Koneksi fail.');
    console.error(err.message);
    process.exit(1);
  }
};


startServer();