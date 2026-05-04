module.exports = async function handler(req, res) {
  // Hanya izinkan jalur POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method HTTP tidak diizinkan' });
  }

  try {
    const { username, phone, imagePayload } = req.body;

    // 1. VALIDASI DATA KOSONG
    if (!username || !phone || !imagePayload) {
      return res.status(400).json({ error: 'Data tidak lengkap. Gagal memproses.' });
    }

    // 2. VALIDASI FORMAT FILE KETAT
    // Memastikan payload benar-benar diawali dengan header gambar asli
    const isImage = imagePayload.startsWith('data:image/jpeg') || 
                    imagePayload.startsWith('data:image/png') || 
                    imagePayload.startsWith('data:image/webp');
                    
    if (!isImage) {
      return res.status(403).json({ error: 'SISTEM KEAMANAN: Format file ditolak. Hanya gambar asli (JPG/PNG) yang diizinkan.' });
    }

    // 3. PROSES SUKSES
    const orderId = "MDZ-" + Math.random().toString(36).toUpperCase().substr(2, 8);

    // Kirim respon sukses dalam bentuk JSON
    return res.status(200).json({
      success: true,
      message: 'Bukti lolos validasi server keamanan.',
      data: {
        order_id: orderId
      }
    });

  } catch (error) {
    return res.status(500).json({ error: 'Terjadi kesalahan internal pada server keamanan.' });
  }
};
