const express = require("express");
const multer = require("multer");
const router = express.Router();
const pool = require("../db");
const path = require('path');
const fs = require('fs'); 

const pdfStorage = multer.diskStorage({
  destination: "uploads/pdf",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const uploadPDF = multer({ storage: pdfStorage });

// Utility function to safely handle JSON input
// Mengasumsikan Persembahan Istimewa adalah Array JSON
const safeJSONString = (data) => {
    // Jika data undefined, null, atau string 'null', kembalikan string array kosong
    if (!data || data === 'null') return '[]'; 
    return data;
};

// Upload warta (Hanya menyisakan Persembahan Istimewa)
router.post("/", uploadPDF.single("file_pdf"), async (req, res) => {
  const { 
    judul, 
    tanggal, 
    persembahan_istimewa 
  } = req.body; 

  if (!req.file) {
      return res.status(400).json({ error: "File PDF wajib diupload." });
  }
  
  // Proses Data Persembahan Istimewa
  const PI = safeJSONString(persembahan_istimewa);

  try {
    const conn = await pool.getConnection();
    
    // Query hanya menyisakan persembahan_istimewa
    const query = `
      INSERT INTO warta_jemaat 
      (judul, tanggal, file_path, persembahan_istimewa)
      VALUES (?, ?, ?, ?)
    `;
    
    await conn.query(query, [
      judul, 
      tanggal, 
      req.file.filename, 
      PI   // Stringified JSON
    ]);
    
    conn.release();
    res.json({ message: "Warta berhasil diupload dan Persembahan Istimewa disimpan" });
  } catch (error) {
    console.error("WARTA INSERT ERROR:", error); 
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  const limitValue = req.query.limit ? parseInt(req.query.limit) : 0;

  try {
    const conn = await pool.getConnection();

    let query = `SELECT * FROM warta_jemaat ORDER BY tanggal DESC`;
    if (limitValue > 0) {
      query += ` LIMIT ${limitValue}`;
    }

    const [rows] = await conn.query(query); // ✅ FIX PENTING
    conn.release();

    res.json(rows); // ✅ sekarang ARRAY OBJECT
  } catch (error) {
    console.error("WARTA FETCH ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
        const conn = await pool.getConnection();
        
        // Opsional: Dapatkan file_path sebelum menghapus dari DB untuk menghapus file fisik
        const [warta] = await conn.query(`SELECT file_path FROM warta_jemaat WHERE id = ?`, [id]);
        
        const result = await conn.query(`DELETE FROM warta_jemaat WHERE id = ?`, [id]);
        conn.release();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Warta tidak ditemukan." });
        }
        
        // Opsional: Hapus file fisik PDF jika ada
        if (warta && warta.file_path) {
            const filePath = path.join(__dirname, '..', 'uploads', 'pdf', warta.file_path);
            // import fs di bagian atas (const fs = require('fs');) jika Anda ingin mengaktifkan penghapusan file
            // fs.unlink(filePath, (err) => {
            //     if (err) console.error("Gagal menghapus file PDF:", err);
            // });
        }
        
        res.json({ message: "Warta berhasil dihapus." });
    } catch (error) {
        console.error("WARTA DELETE ERROR:", error);
        res.status(500).json({ error: error.message });
    }
});

// Tambahkan Endpoint untuk Edit/Update Warta Jemaat
router.put("/:id", uploadPDF.single("file_pdf"), async (req, res) => {
    const { id } = req.params;
    const { 
        judul, 
        tanggal, 
        persembahan_istimewa 
    } = req.body; 
    const newFilePath = req.file ? req.file.filename : null;

    if (!judul || !tanggal) {
        return res.status(400).json({ error: "Judul dan Tanggal wajib diisi." });
    }

    const PI = safeJSONString(persembahan_istimewa);

    let conn;
    try {
        conn = await pool.getConnection();

        // 1. Ambil data lama 
        const [oldItem] = await conn.query(`SELECT file_path FROM warta_jemaat WHERE id = ?`, [id]);
        if (!oldItem) {
            conn.release();
            // Hapus file baru yang terupload jika item lama tidak ditemukan
            if (newFilePath) {
                const newFileFullPath = path.join(__dirname, '..', 'uploads', 'pdf', newFilePath);
                fs.unlink(newFileFullPath, (err) => {
                    if (err) console.error("Gagal menghapus file baru yang tidak terpakai:", err);
                });
            }
            return res.status(404).json({ message: "Warta tidak ditemukan." });
        }

        // 2. Tentukan file_path yang akan disimpan (baru atau lama)
        const filePathToSave = newFilePath || oldItem.file_path;

        // 3. Lakukan Update
        const [result] = await conn.query(
            `UPDATE warta_jemaat SET 
                judul = ?, 
                tanggal = ?, 
                file_path = ?, 
                persembahan_istimewa = ?
             WHERE id = ?`,
            [judul, tanggal, filePathToSave, PI, id]
        );
        conn.release();

        if (result.affectedRows === 0) {
             return res.json({ message: "Warta berhasil diperbarui (tidak ada perubahan data)." });
        }

        // 4. Hapus file lama (HANYA jika ada file baru diupload DAN file lama ada)
        if (newFilePath && oldItem.file_path) {
            const oldFileFullPath = path.join(__dirname, '..', 'uploads', 'pdf', oldItem.file_path);
            fs.unlink(oldFileFullPath, (err) => {
                if (err) console.error("Gagal menghapus file PDF lama:", oldFileFullPath, err);
                else console.log("File PDF lama berhasil dihapus:", oldFileFullPath);
            });
        }

        res.json({ message: "Warta berhasil diperbarui." });
    } catch (error) {
        // Jika terjadi error, pastikan file baru yang terupload dihapus (clean up)
        if (newFilePath) {
            const newFileFullPath = path.join(__dirname, '..', 'uploads', 'pdf', newFilePath);
            fs.unlink(newFileFullPath, (err) => {
                 if (err) console.error("Gagal menghapus file baru setelah error DB:", err);
            });
        }
        console.error("WARTA UPDATE ERROR:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;