const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const pool = require("../db");

const SECRET_KEY = "gkj-secret-aman";

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("LOGIN:", email, password);

  let conn;
  try {
    conn = await pool.getConnection();

    // Debug: cek database aktif
    const [db] = await conn.query("SELECT DATABASE() AS db");
    console.log("CONNECTED DB:", db[0].db);

    const [rows] = await conn.query(
      "SELECT email, password FROM `user` WHERE BINARY email = ?",
      [email]
    );

    console.log("QUERY RESULT:", rows);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Email atau password salah" });
    }

    const user = rows[0];

    if (password !== user.password) {
      return res.status(401).json({ error: "Email atau password salah" });
    }

    const token = jwt.sign(
      { email: user.email },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    res.json({ token });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: "Server error" });
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;
