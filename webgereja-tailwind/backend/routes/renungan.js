const express = require("express");
const router = express.Router();
const pool = require("../db");

// =================================================
// UTIL: Ambil data renungan (FIX mysql2)
// =================================================
const getDevotions = async (date, limit) => {
  const conn = await pool.getConnection();

  let query = `
    SELECT 
      id,
      judul,
      pengarang,
      tanggal,
      ayat_referensi,
      teks_ayat,
      isi_renungan
    FROM renungan
  `;
  let params = [];

  if (limit > 0) {
    if (date) {
      query += " WHERE tanggal <= ? ORDER BY tanggal DESC LIMIT ?";
      params = [date, limit];
    } else {
      query += " ORDER BY tanggal DESC LIMIT ?";
      params = [limit];
    }
  } else if (date) {
    query += " WHERE tanggal = ?";
    params = [date];
  } else {
    query += " ORDER BY tanggal DESC";
  }

  // ✅ FIX PENTING
  const [rows] = await conn.query(query, params);
  conn.release();

  return rows; // ← ARRAY OBJECT DB ASLI
};

// =================================================
// POST: Tambah Renungan
// =================================================
router.post("/", async (req, res) => {
  const {
    judul,
    pengarang,
    tanggal,
    ayat_referensi,
    teks_ayat,
    isi_renungan,
  } = req.body;

  try {
    const conn = await pool.getConnection();
    await conn.query(
      `INSERT INTO renungan 
        (judul, pengarang, tanggal, ayat_referensi, teks_ayat, isi_renungan)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [judul, pengarang, tanggal, ayat_referensi, teks_ayat, isi_renungan]
    );
    conn.release();

    res.json({ message: "Renungan berhasil disimpan" });
  } catch (error) {
    console.error("RENUNGAN POST ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// =================================================
// GET: Ambil Renungan (date & limit)
// =================================================
router.get("/", async (req, res) => {
  const { date, limit } = req.query;
  const limitValue = limit ? parseInt(limit) : 0;

  try {
    const rows = await getDevotions(date, limitValue);

    // 🔍 DEBUG (boleh dihapus)
    console.log("DATA RENUNGAN DB:", rows);

    res.json(rows);
  } catch (error) {
    console.error("RENUNGAN GET ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// =================================================
// DELETE Renungan
// =================================================
router.delete("/:id", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [result] = await conn.query(
      "DELETE FROM renungan WHERE id = ?",
      [req.params.id]
    );
    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Renungan tidak ditemukan." });
    }

    res.json({ message: "Renungan berhasil dihapus" });
  } catch (error) {
    console.error("RENUNGAN DELETE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// =================================================
// UPDATE Renungan
// =================================================
router.put("/:id", async (req, res) => {
  const {
    judul,
    pengarang,
    tanggal,
    ayat_referensi,
    teks_ayat,
    isi_renungan,
  } = req.body;

  if (!judul || !pengarang || !tanggal || !isi_renungan) {
    return res.status(400).json({
      error: "Judul, Pengarang, Tanggal, dan Isi Renungan wajib diisi.",
    });
  }

  try {
    const conn = await pool.getConnection();
    const [result] = await conn.query(
      `UPDATE renungan SET
        judul = ?,
        pengarang = ?,
        tanggal = ?,
        ayat_referensi = ?,
        teks_ayat = ?,
        isi_renungan = ?
       WHERE id = ?`,
      [
        judul,
        pengarang,
        tanggal,
        ayat_referensi,
        teks_ayat,
        isi_renungan,
        req.params.id,
      ]
    );
    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Renungan tidak ditemukan." });
    }

    res.json({ message: "Renungan berhasil diperbarui." });
  } catch (error) {
    console.error("RENUNGAN UPDATE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
