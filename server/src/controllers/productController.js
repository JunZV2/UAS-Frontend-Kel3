const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

const saveImageToFile = (base64Data) => {
  if (!base64Data || !base64Data.startsWith('data:image')) {
    console.log('[LOG] saveImageToFile: Tidak ada base64 baru, proses dibatalkan.');
    return null; 
  }

  try {
    console.log('[LOG] saveImageToFile: Memproses base64 data...');
    const parts = base64Data.split(';base64,');
    const mimeType = parts[0].split(':')[1];
    
    if (!mimeType.startsWith('image/')) {
        console.warn('[LOG] saveImageToFile: Data base64 bukan gambar.');
        return null;
    }

    const ext = mimeType.split('/')[1];
    const imageData = parts[1];
    const filename = `${Date.now()}.${ext}`;
    const imagePath = path.join(__dirname, '..', '..', 'public', 'uploads', filename);
    const publicUrl = `/uploads/${filename}`; 
 
    fs.writeFileSync(imagePath, imageData, { encoding: 'base64' });
    
    console.log(`[LOG] Gambar DISIMPAN di server di: ${imagePath}`);
    console.log(`[LOG] URL Publik yang disimpan ke DB: ${publicUrl}`);
    
    return publicUrl; 
  } catch (error) {
    console.error('[ERROR] Gagal menyimpan gambar:', error);
    return null;
  }
};

const deleteImageFile = (imageUrl) => {
    if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.startsWith('/uploads/')) {
        console.log(`[LOG] deleteImageFile: Tidak ada gambar lama untuk dihapus (${imageUrl})`);
        return; 
    }
    try {
        const imagePath = path.join(__dirname, '..', '..', 'public', imageUrl);
        
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log(`[LOG] Gambar LAMA DIHAPUS: ${imagePath}`);
        } else {
            console.warn(`[LOG] deleteImageFile: File tidak ditemukan: ${imagePath}`);
        }
    } catch (error) {
        console.error('[ERROR] Gagal menghapus gambar:', error);
    }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.createProduct = async (req, res) => {
  const { nama, deskripsi, harga, gambarBase64 } = req.body;

  try {
    const gambarUrl = saveImageToFile(gambarBase64);

    const newProduct = new Product({
      nama,
      deskripsi,
      harga,
      gambarUrl: gambarUrl || ''
    });

    const product = await newProduct.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ message: "Gagal membuat produk" });
  }
};

exports.updateProduct = async (req, res) => {
  const { nama, deskripsi, harga, gambarBase64 } = req.body;
  
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    product.nama = nama;
    product.deskripsi = deskripsi;
    product.harga = harga;

    if (gambarBase64 && gambarBase64.startsWith('data:image')) {
      deleteImageFile(product.gambarUrl);
 
      product.gambarUrl = saveImageToFile(gambarBase64);
    } 

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ message: "Gagal memperbarui produk" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    deleteImageFile(product.gambarUrl);

    await product.deleteOne(); 

    res.json({ message: 'Produk berhasil dihapus' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getProductById = async (req, res) => {
try {
    const product = await Product.findById(req.params.id); 
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Produk tidak ditemukan (ID tidak valid)' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

