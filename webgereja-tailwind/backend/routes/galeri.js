const express = require("express");
const multer = require("multer");
const router = express.Router();
const pool = require("../db");
const path = require("path");
const fs = require("fs");

// ================= MULTER =================
const galeriStorage = multer.diskStorage({
  destination: "uploads/galeri",
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const uploadGaleri = multer({ storage: galeriStorage });

// ================= POST =================
router.post("/", uploadGaleri.single("file"), async (req, res) => {
  const { judul, tipe, video_url } = req.body;
  const filePath = req.file ? req.file.filename : null;
  const url = tipe === "video" ? video_url : null;

  if (!judul || (!filePath && !url)) {
    return res.status(400).json({ error: "Data tidak lengkap" });
  }

  try {
    const conn = await pool.getConnection();
    await conn.query(
      `INSERT INTO galeri (judul, tipe_media, file_path, video_url)
       VALUES (?, ?, ?, ?)`,
      [judul, tipe, filePath, url]
    );
    conn.release();
    res.json({ message: "Galeri tersimpan" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ================= GET =================
router.get("/", async (req, res) => {
  try {
    const conn = await pool.getConnection();

    const [rows] = await conn.query(`
      SELECT 
        id,
        judul,
        tipe_media AS tipe,
        file_path,
        video_url
      FROM galeri
      ORDER BY id DESC
    `);

    conn.release();

    // 🔍 DEBUG (boleh dihapus nanti)
    console.log("DATA GALERI DB:", rows);

    res.json(rows); // ← INI DATA DB ASLI
  } catch (error) {
    console.error("GALERI GET ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});


// ================= DOWNLOAD =================
router.get("/download/:filename", (req, res) => {
  const filePath = path.join(
    __dirname,
    "..",
    "uploads",
    "galeri",
    req.params.filename
  );

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File tidak ditemukan" });
  }

  res.download(filePath);
});

// ================= DELETE =================
router.delete("/:id", async (req, res) => {
  const conn = await pool.getConnection();
  const [rows] = await conn.query(
    "SELECT file_path FROM galeri WHERE id=?",
    [req.params.id]
  );

  await conn.query("DELETE FROM galeri WHERE id=?", [req.params.id]);
  conn.release();

  if (rows.length && rows[0].file_path) {
    const file = path.join(
      __dirname,
      "..",
      "uploads",
      "galeri",
      rows[0].file_path
    );
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }

  res.json({ message: "Galeri dihapus" });
});

module.exports = router;
