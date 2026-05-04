  async function submitProof() {
    const fileInput = document.getElementById('fileInput').files[0];
    const nama = document.getElementById('inputNama').value;
    const phone = document.getElementById('inputPhone').value;

    if (!fileInput) {
      alert('⚠️ Harap upload bukti pembayaran terlebih dahulu!');
      return;
    }

    goToStep(4);
    const statusText = document.getElementById('verifyStatus');
    statusText.textContent = "Mengenkripsi dan mengirim file ke Server Vercel...";

    try {
      const base64Image = await toBase64(fileInput);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: nama,
          phone: phone,
          imagePayload: base64Image
        })
      });

      // BACA SEBAGAI TEKS MENTAH DULU AGAR TIDAK CRASH JIKA VERCEL ERROR
      const rawText = await response.text();
      let result;

      try {
        result = JSON.parse(rawText);
      } catch (e) {
        // JIKA MASUK KESINI, BERARTI STRUKTUR FOLDER VERCEL KAMU SALAH
        console.error("Respon Server Bukan JSON:", rawText);
        alert("CRITICAL ERROR: Vercel gagal memuat backend. File /api/upload.js tidak ditemukan atau konfigurasi vercel.json salah.");
        statusText.textContent = "Backend tidak merespon.";
        setTimeout(() => goToStep(3), 3000);
        return;
      }

      if (response.ok) {
        document.getElementById('orderCode').textContent = result.data.order_id;
        statusText.textContent = "Validasi berhasil!";
        setTimeout(() => goToStep(5), 800); 
      } else {
        alert("🚫 SERVER MENOLAK: " + result.error);
        goToStep(3); 
      }

    } catch (error) {
      // INI BARU ERROR KONEKSI INTERNET ASLI
      alert("Gagal terhubung ke internet. Cek koneksi Anda.");
      statusText.textContent = "Koneksi terputus.";
      setTimeout(() => goToStep(3), 2000);
    }
  }
