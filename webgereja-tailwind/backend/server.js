const express = require("express");
const cors = require("cors");
const app = express();

const PORT = 5001;

// ======================================
// 1. CORS
// ======================================
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://192.168.100.71:5173",

  // ✅ untuk production via nginx port 80
  "http://192.168.100.71",
  "http://192.168.100.71:80",

  "http://crl.labjaringanukdw.my.id",
  "https://crl.labjaringanukdw.my.id",
];



app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) return callback(null, true);

    console.log("CORS BLOCKED ORIGIN:", origin);
    return callback(new Error("CORS not allowed"));
  },
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
}));


// ✅ cukup ini (Express otomatis handle OPTIONS jika cors middleware aktif)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================================
// 2. STATIC FILES
// ======================================
app.use("/uploads", express.static("uploads"));
app.use("/uploads/pdf", express.static("uploads/pdf"));
app.use("/uploads/images", express.static("uploads/images"));

// ======================================
// 3. ROUTES
// ======================================
app.use("/api/admin", require("./routes/admin"));
app.use("/api/renungan", require("./routes/renungan"));
app.use("/api/jadwal", require("./routes/jadwal"));
app.use("/api/galeri", require("./routes/galeri"));
app.use("/api/warta", require("./routes/warta"));
app.use("/api/konfigurasi", require("./routes/konfigurasi"));

// ======================================
// 4. SERVER START
// ======================================
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server berjalan di http://0.0.0.0:${PORT}`);
});
