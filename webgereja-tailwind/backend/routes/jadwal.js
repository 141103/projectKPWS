const express = require("express");
const router = express.Router();
const pool = require("../db");

// POST: Tambah Jadwal
router.post("/", async (req, res) => {
  const { hari, waktu, nama_kegiatan, detail, aktif } = req.body;
  const activeStatus = aktif ? 1 : 0; 
  let conn; // Deklarasikan di luar try
  
  try {
    conn = await pool.getConnection();
    await conn.query(
      `INSERT INTO jadwal (hari, waktu, nama_kegiatan, detail, aktif)
       VALUES (?, ?, ?, ?, ?)`,
      [hari, waktu, nama_kegiatan, detail, activeStatus]
    );
    res.json({ message: "Jadwal berhasil disimpan" });
  } catch (error) {
    console.error("JADWAL INSERT ERROR:", error);
    res.status(500).json({ error: error.message });
  } finally {
    if (conn) conn.release(); // 📌 PERBAIKAN KRITIS: Pastikan koneksi dilepas di sini
  }
});

// GET: Ambil Semua Jadwal
// Contoh di router.get("/", async (_, res) => {
router.get("/", async (_, res) => {
  let conn; 
  try {
    conn = await pool.getConnection(); // Koneksi diambil
    const [rows] = await conn.query(`SELECT * FROM jadwal ORDER BY aktif DESC, hari ASC, waktu ASC`);
    res.json(rows);
  } catch (error) {
    // Error ditangkap
    console.error("JADWAL GET ERROR:", error);
    res.status(500).json({ error: error.message });
  } finally {
    if (conn) conn.release(); // 📌 Koneksi selalu dilepas
  }
});
// ... semua route lainnya juga sudah benar

// DELETE: Hapus Jadwal Berdasarkan ID
router.delete("/:id", async (req, res) => {
    const { id } = req.params; 
    let conn; // Deklarasikan di luar try

    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(`DELETE FROM jadwal WHERE id = ?`, [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Jadwal tidak ditemukan di database." });
        }
        res.json({ message: "Jadwal berhasil dihapus." });
    } catch (error) {
        console.error("JADWAL DELETE ERROR:", error);
        res.status(500).json({ error: error.message });
    } finally {
        if (conn) conn.release(); // 📌 PERBAIKAN KRITIS: Pastikan koneksi dilepas di sini
    }
});

// PUT: Edit/Update Jadwal
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { hari, waktu, nama_kegiatan, detail, aktif } = req.body;
    const activeStatus = aktif ? 1 : 0; 

    if (!hari || !waktu || !nama_kegiatan) {
        return res.status(400).json({ error: "Hari, Waktu, dan Nama Kegiatan wajib diisi." });
    }

    let conn; // Deklarasikan di luar try
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(
            `UPDATE jadwal SET 
                hari = ?, 
                waktu = ?, 
                nama_kegiatan = ?, 
                detail = ?, 
                aktif = ? 
             WHERE id = ?`,
            [hari, waktu, nama_kegiatan, detail, activeStatus, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Jadwal tidak ditemukan atau tidak ada perubahan data." });
        }
        res.json({ message: "Jadwal berhasil diperbarui." });
    } catch (error) {
        console.error("JADWAL UPDATE ERROR:", error);
        res.status(500).json({ error: error.message });
    } finally {
        if (conn) conn.release(); // 📌 PERBAIKAN KRITIS: Pastikan koneksi dilepas di sini
    }
});

module.exports = router;