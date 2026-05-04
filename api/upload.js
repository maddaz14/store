export default async function handler(req, res) {
  // Hanya izinkan jalur POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method tidak diizinkan' });
  }

  try {
    const { username, phone, imagePayload } = req.body;

    // 1. VALIDASI DATA KOSONG
    if (!username || !phone || !imagePayload) {
      return res.status(400).json({ error: 'Data tidak lengkap. Gagal memproses.' });
    }

    // 2. VALIDASI FORMAT FILE KETAT
    // Memastikan payload benar-benar diawali dengan header gambar asli, bukan teks/file zip
    const isImage = imagePayload.startsWith('data:image/jpeg') || 
                    imagePayload.startsWith('data:image/png') || 
                    imagePayload.startsWith('data:image/webp');
                    
    if (!isImage) {
      return res.status(403).json({ error: 'KEAMANAN AKTIF: Format file ditolak. Hanya gambar asli yang diizinkan.' });
    }

    // 3. PROSES SUKSES
    // Di sistem nyata, Base64 ini akan disimpan ke database (Supabase/Firebase) atau Google Drive.
    const orderId = "MDZ-" + Math.random().toString(36).toUpperCase().substr(2, 8);

    console.log(`[BERHASIL] Bukti diterima dari ${username} (${phone}) - Order: ${orderId}`);

    return res.status(200).json({
      success: true,
      message: 'Bukti lolos validasi server.',
      data: {
        order_id: orderId
      }
    });

  } catch (error) {
    return res.status(500).json({ error: 'Terjadi kesalahan pada server keamanan.' });
  }
}

