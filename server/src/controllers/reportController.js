
const Order = require('../models/Order');

/**
 * 
 * @param {string} startStr
 * @param {string} endStr
 * @returns {Promise<{totalPenjualan: number, jumlahOrder: number}>}
 */
const getSalesDataForPeriod = async (startStr, endStr) => {
  try {
    const start = new Date(startStr + "T00:00:00"); 
    const end = new Date(endStr + "T23:59:59");

    console.log(`[Laporan] Mencari order 'Selesai' dari ${start.toISOString()} hingga ${end.toISOString()}`);

    const orders = await Order.find({
      status: 'Selesai',
      tanggalPesanan: { $gte: start, $lte: end }
    });

    const totalPenjualan = orders.reduce((acc, order) => acc + order.total, 0);
    const jumlahOrder = orders.length;
    
    console.log(`[Laporan] Ditemukan ${jumlahOrder} order, Total: Rp ${totalPenjualan}`);
    
    return { totalPenjualan, jumlahOrder };
  } catch (error) {
    console.error("Error di getSalesDataForPeriod:", error);
    return { totalPenjualan: 0, jumlahOrder: 0 };
  }
};

/**
 * @param {Date} dateObj
 * @returns {string}
 */
const toLocalDateString = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); 
  const day = dateObj.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};


exports.getCustomSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query; 

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'startDate dan endDate diperlukan' });
    }

    const currentStartDateObj = new Date(startDate + "T00:00:00");
    const currentEndDateObj = new Date(endDate + "T00:00:00");
    const oneDay = 24 * 60 * 60 * 1000;
    const durationMs = currentEndDateObj.getTime() - currentStartDateObj.getTime();
    const durationDays = Math.round(durationMs / oneDay) + 1;

    const prevEndDateObj = new Date(currentStartDateObj.getTime() - oneDay);
    const prevStartDateObj = new Date(prevEndDateObj.getTime() - (oneDay * (durationDays - 1)));

    const prevStartDateStr = toLocalDateString(prevStartDateObj);
    const prevEndDateStr = toLocalDateString(prevEndDateObj);


    console.log(`[Laporan] Periode Saat Ini Diminta: ${startDate} s/d ${endDate} (Durasi: ${durationDays} hari)`);
    console.log(`[Laporan] Periode Sebelumnya Dihitung: ${prevStartDateStr} s/d ${prevEndDateStr}`);

    const [currentPeriodData, previousPeriodData] = await Promise.all([
      getSalesDataForPeriod(startDate, endDate),
      getSalesDataForPeriod(prevStartDateStr, prevEndDateStr)
    ]);

    let persentasePerubahan = 0;
    const currentTotal = currentPeriodData.totalPenjualan;
    const previousTotal = previousPeriodData.totalPenjualan;

    if (previousTotal > 0) {
      persentasePerubahan = ((currentTotal - previousTotal) / previousTotal) * 100;
    } else if (currentTotal > 0) {
      persentasePerubahan = 100.0;
    }

    console.log(`[Laporan] Perhitungan: ((${currentTotal} - ${previousTotal}) / ${previousTotal}) = ${persentasePerubahan.toFixed(1)}%`);

    res.json({
      title: `Laporan dari ${startDate} ke ${endDate}`,
      totalPenjualan: currentTotal,
      jumlahOrder: currentPeriodData.jumlahOrder,
      startDate: startDate,
      endDate: endDate,
      totalPenjualanSebelumnya: previousTotal,
      jumlahOrderSebelumnya: previousPeriodData.jumlahOrder,
      persentasePerubahan: persentasePerubahan 
    });

  } catch (err) {
    if (err instanceof Error) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error saat mengambil laporan" });
    } else {
        console.error("Terjadi error yang tidak diketahui:", err);
        res.status(500).json({ message: "Error tidak diketahui di server" });
    }
  }
};