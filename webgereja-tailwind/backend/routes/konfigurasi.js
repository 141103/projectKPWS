const express = require("express");
const multer = require("multer");
const router = express.Router();
const pool = require("../db");

// =================================================
// MULTER SETUP
// =================================================
const imageStorage = multer.diskStorage({
  destination: "uploads/images",
  filename: (req, file, cb) => {
    const filename = Date.now() + "-" + file.originalname;

    req.uploadedFiles = req.uploadedFiles || {};

    if (file.fieldname === "photo_gereja") {
      req.uploadedFiles.CHURCH_PHOTO_PATH = filename;
    }

    if (file.fieldname === "logo_gkj") {
      req.uploadedFiles.LOGO_GKJ_PATH = filename;
    }

    cb(null, filename);
  },
});

const uploadImages = multer({ storage: imageStorage }).fields([
  { name: "photo_gereja", maxCount: 1 },
  { name: "logo_gkj", maxCount: 1 },
]);

// =================================================
// GET KONFIGURASI (UNTUK FRONTEND)
// =================================================
router.get("/", async (req, res) => {
  try {
    const conn = await pool.getConnection();

    // ✅ FIX: destructuring
    const [rows] = await conn.query(
      "SELECT key_name, key_value FROM konfigurasi"
    );

    conn.release();

    // ✅ FIX: ubah jadi object
    const config = {};
    rows.forEach(item => {
      config[item.key_name] = item.key_value;
    });

    res.json(config);
  } catch (error) {
    console.error("CONFIG GET ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// =================================================
// UPLOAD / UPDATE FOTO & LOGO
// =================================================
router.post("/upload", uploadImages, async (req, res) => {
  const uploaded = req.uploadedFiles;

  if (!uploaded || Object.keys(uploaded).length === 0) {
    return res.status(400).json({ message: "Tidak ada file yang diunggah." });
  }

  try {
    const conn = await pool.getConnection();

    for (const key in uploaded) {
      await conn.query(
        `
        INSERT INTO konfigurasi (key_name, key_value)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE key_value = VALUES(key_value)
        `,
        [key, uploaded[key]]
      );
    }

    conn.release();
    res.json({ message: "Konfigurasi berhasil diperbarui." });
  } catch (error) {
    console.error("CONFIG UPLOAD ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// =================================================
// UPDATE TEXT-BASED CONFIG
// =================================================
router.post("/update-text", express.json(), async (req, res) => {
  const updates = req.body;

  if (!updates || Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "Tidak ada data yang dikirim." });
  }

  try {
    const conn = await pool.getConnection();

    for (const key in updates) {
      await conn.query(
        `
        INSERT INTO konfigurasi (key_name, key_value)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE key_value = VALUES(key_value)
        `,
        [key, updates[key]]
      );
    }

    conn.release();
    res.json({ message: "Konfigurasi teks berhasil diperbarui." });
  } catch (error) {
    console.error("CONFIG TEXT UPDATE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
