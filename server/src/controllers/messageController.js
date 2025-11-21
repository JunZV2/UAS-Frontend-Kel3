const Message = require('../models/Message');

exports.createMessage = async (req, res) => {
  try {
    const { nama, email, pesan } = req.body;
    if (!nama || !email || !pesan) {
      return res.status(400).json({ message: 'Semua field wajib diisi.' });
    }
    
    const newMessage = new Message({ nama, email, pesan });
    await newMessage.save();
    
    res.status(201).json({ message: 'Pesan berhasil terkirim!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ tanggal: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedMessage = await Message.findByIdAndDelete(id);
    
    if (!deletedMessage) {
      return res.status(404).json({ message: 'Pesan tidak ditemukan.' });
    }
    
    res.status(200).json({ message: 'Pesan berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};