import React, { useState, useEffect } from "react";
import { Trash2, Edit2, Loader, AlertTriangle, Calendar } from 'lucide-react';


// =========================
// 🌐 KONFIGURASI BACKEND (Perlu untuk menghubungkan ke API)
// =========================
// Ganti dengan alamat backend Anda. Default: http://192.168.100.71:5000
const API_BASE_URL = "/api"; 

// =========================
// 🔒 Helper API dengan JWT (Memastikan format data JSON yang dikirim ke database)
// =========================
const api = async (url, options = {}) => {
  const token = sessionStorage.getItem("token");
  
  // 1. Gabungkan Base URL dengan path endpoint
  const fullUrl = `${API_BASE_URL}${url}`;
  
  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };
  
  let body = options.body;

  // 📌 PERBAIKAN: Pastikan body di-stringify (dikonversi ke JSON string)
  // jika request BUKAN GET dan BUKAN FormData. 
  // Ini adalah praktik terbaik agar backend (Express: app.use(express.json())) dapat memprosesnya.
  if (body && options.method !== 'GET' && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  // 2. Lakukan Fetch
  const res = await fetch(fullUrl, {
    ...options,
    headers, // Gunakan headers yang sudah diperbarui
    body,    // Gunakan body yang sudah di-stringified (jika perlu)
  });

  // 1. Tangani Error Otentikasi (401)
  if (res.status === 401) {
    sessionStorage.removeItem("token");
    window.location.href = "/admin/login";
    throw new Error('Unauthorized'); 
  }
  
  // 2. Tangani Error Umum (4xx atau 5xx)
  if (!res.ok) {
     try {
        const errorBody = await res.json();
        throw new Error(errorBody.error || `Request failed with status ${res.status}`); 
     } catch {
        throw new Error(`Request failed with status ${res.status}`);
     }
  }

  // 3. Tangani Respons OK (2xx)
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return res.json(); // Mengembalikan data JSON
  }
  
  // Untuk operasi seperti DELETE/POST yang mungkin hanya mengembalikan status 204/200 tanpa body
  return {}; 
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("renungan");

  // ======================
  // 🔒 JWT Protected Mount
  // ======================
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      window.location.href = "/admin/login";
    }
  }, []);

  // ====================================
  // LOGOUT (JWT)
  // =====================================
  const logout = () => {
    sessionStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      <button
        onClick={logout}
        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
      >
        Logout
      </button>

      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {/* Navigation Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        {[
          "renungan",
          "jadwal",
          "galeri",
          "warta",
        //   "konfigurasi",
        ].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-md font-medium shadow
            ${activeTab === tab ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-200"}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ============================== */}
      {/* RENDER SECTION BERDASARKAN TAB */}
      {/* ============================== */}

      {activeTab === "renungan" && <RenunganSection />}
      {activeTab === "jadwal" && <JadwalSection />}
      {activeTab === "galeri" && <GaleriSection />}
      {activeTab === "warta" && <WartaSection />}
      {activeTab === "konfigurasi" && <KonfigurasiSection />}
    </div>
  );
}

const formatDate = (dateString) => {
    if (!dateString) return 'Tanggal Tidak Diketahui';

    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
        // If parsing failed, return a clear indicator
        return 'Invalid Date';
    }

    const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
    return date.toLocaleDateString('id-ID', options);
};

// =============================================================
// 📌 R E N U N G A N   S E C T I O N  (FINAL)
// =============================================================
function RenunganSection() {
  const [judul, setJudul] = useState("");
  const [pengarang, setPengarang] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [ayat, setAyat] = useState("");
  const [teksAyat, setTeksAyat] = useState("");
  const [isiRenungan, setIsiRenungan] = useState("");

  const [renunganList, setRenunganList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingItem, setEditingItem] = useState(null); // State for editing

  const fetchRenungan = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api("/renungan");
      if (!Array.isArray(data)) {
        throw new Error("Format data renungan tidak valid");
      }
      data.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
      setRenunganList(data);
    } catch (err) {
      console.error("Gagal mengambil data renungan:", err);
      setError("Gagal memuat daftar renungan.");
      setRenunganList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRenungan();
  }, []);

  // ===========================================================
  // Handler to clear form
  // ===========================================================
  const resetForm = () => {
    setJudul("");
    setPengarang("");
    setTanggal("");
    setAyat("");
    setTeksAyat("");
    setIsiRenungan("");
    setEditingItem(null);
  };
  
  // ===========================================================
  // Handler for starting an edit
  // ===========================================================
  const handleEdit = (item) => {
    setEditingItem(item);
    setJudul(item.judul || "");
    setPengarang(item.pengarang || "");
    setTanggal(item.tanggal ? new Date(item.tanggal).toISOString().split('T')[0] : "");
    setAyat(item.ayat_referensi || "");
    setTeksAyat(item.teks_ayat || "");
    setIsiRenungan(item.isi_renungan || "");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ===========================================================
  // POST / PUT: Simpan renungan baru atau update
  // ===========================================================
  const submitRenungan = async (e) => {
    e.preventDefault();

    if (!tanggal || !ayat || !teksAyat || !isiRenungan) {
      alert("Harap isi semua kolom wajib.");
      return;
    }

    const renunganData = {
      judul,
      pengarang,
      tanggal,
      ayat_referensi: ayat,
      teks_ayat: teksAyat,
      isi_renungan: isiRenungan,
    };

    try {
      let res;
      if (editingItem) {
        // UPDATE (PUT)
        res = await api(`/renungan/${editingItem.id}`, {
          method: "PUT",
          body: renunganData,
        });
        alert(res.message || "Renungan berhasil diperbarui");
      } else {
        // CREATE (POST)
        res = await api("/renungan", {
          method: "POST",
          body: renunganData,
        });
        alert(res.message || "Renungan berhasil disimpan");
      }

      resetForm();
      fetchRenungan();
    } catch (err) {
      alert("Gagal menyimpan renungan: " + err.message);
    }
  };

  const deleteRenungan = async (id, tanggal) => {
    if (!window.confirm(`Yakin ingin menghapus renungan tanggal ${formatDate(tanggal)}?`)) {
      return;
    }

    try {
      await api(`/renungan/${id}`, { method: "DELETE" });
      alert("Renungan berhasil dihapus");
      fetchRenungan();
    } catch (err) {
        alert("Gagal menghapus renungan: " + err.message);
    }
  };

  // ===========================================================
  // RENDER
  // ===========================================================
  return (
    <div className="max-w-6xl mx-auto">
      {/* ================= FORM INPUT ================= */}
      <form
        onSubmit={submitRenungan}
        className="bg-white p-6 rounded shadow mb-10 max-w-2xl mx-auto"
      >
        <h2 className="text-2xl font-bold mb-4 text-blue-600 border-b pb-2">
          {editingItem ? 'Edit Renungan' : 'Input Renungan Baru'}
        </h2>

        <label className="block mb-2">Judul</label>
        <input
          className="w-full border p-2 mb-4"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
        />

        <label className="block mb-2">Pengarang</label>
        <input
          className="w-full border p-2 mb-4"
          value={pengarang}
          onChange={(e) => setPengarang(e.target.value)}
        />

        <label className="block mb-2">Tanggal</label>
        <input
          type="date"
          className="w-full border p-2 mb-4"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          required
        />

        <label className="block mb-2">Ayat Referensi</label>
        <input
          className="w-full border p-2 mb-4"
          value={ayat}
          onChange={(e) => setAyat(e.target.value)}
          required
        />

        <label className="block mb-2">Teks Ayat</label>
        <textarea
          className="w-full border p-2 mb-4"
          value={teksAyat}
          onChange={(e) => setTeksAyat(e.target.value)}
          required
        />

        <label className="block mb-2">Isi Renungan</label>
        <textarea
          className="w-full border p-2 mb-4"
          value={isiRenungan}
          onChange={(e) => setIsiRenungan(e.target.value)}
          required
        />
        
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            {editingItem ? 'Update Renungan' : 'Simpan Renungan'}
          </button>
          {editingItem && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      {/* ================= LIST RENUNGAN ================= */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-blue-600 border-b pb-2">
          Daftar Renungan ({renunganList.length})
        </h2>

        {isLoading && <p className="text-center">Memuat data...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!isLoading && renunganList.length > 0 && (
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Tanggal</th>
                <th className="p-2 border">Judul / Ayat</th>
                <th className="p-2 border">Pengarang</th>
                <th className="p-2 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {renunganList.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{formatDate(item.tanggal)}</td>
                  <td className="p-2 border">
                    <strong>{item.judul || item.ayat_referensi}</strong>
                    <div className="text-xs text-gray-500">{item.teks_ayat}</div>
                  </td>
                  <td className="p-2 border">{item.pengarang || "-"}</td>
                  <td className="p-2 border text-center flex justify-center gap-2">
                    <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:underline"
                    >
                        Edit
                    </button>
                    <button
                      onClick={() => deleteRenungan(item.id, item.tanggal)}
                      className="text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// =============================================================
// 📌 J A D W A L   S E C T I O N  (FINAL)
// =============================================================
function JadwalSection() {
  const [hari, setHari] = useState("");
  const [waktu, setWaktu] = useState("");
  const [namaKegiatan, setNamaKegiatan] = useState("");
  const [detail, setDetail] = useState("");
  const [aktif, setAktif] = useState(true);

  const [jadwalList, setJadwalList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [editingItem, setEditingItem] = useState(null);

  // ===========================================================
  // GET: Ambil semua jadwal
  // ===========================================================
  const fetchJadwal = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await api("/jadwal");

      if (!Array.isArray(data)) {
        throw new Error("Format data jadwal tidak valid");
      }

      data.sort((a, b) => b.aktif - a.aktif);
      setJadwalList(data);
    } catch (err) {
      console.error("Gagal mengambil data jadwal:", err);
      setError("Gagal memuat daftar jadwal.");
      setJadwalList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJadwal();
  }, []);
  
  // ===========================================================
  // Form Reset
  // ===========================================================
  const resetForm = () => {
    setHari("");
    setWaktu("");
    setNamaKegiatan("");
    setDetail("");
    setAktif(true);
    setEditingItem(null);
  };
  
  // ===========================================================
  // Handle Edit
  // ===========================================================
  const handleEdit = (item) => {
    setEditingItem(item);
    setHari(item.hari);
    setWaktu(item.waktu);
    setNamaKegiatan(item.nama_kegiatan);
    setDetail(item.detail || "");
    setAktif(item.aktif === 1 || item.aktif === true); // Handle 1/0 or true/false
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ===========================================================
  // POST / PUT: Simpan jadwal
  // ===========================================================
  const submitJadwal = async (e) => {
    e.preventDefault();

    if (!hari || !waktu || !namaKegiatan) {
      alert("Hari, Waktu, dan Nama Kegiatan wajib diisi");
      return;
    }

    const jadwalData = {
      hari,
      waktu,
      nama_kegiatan: namaKegiatan,
      detail,
      aktif: aktif ? 1 : 0,
    };

    try {
      let res;
      if (editingItem) {
        res = await api(`/jadwal/${editingItem.id}`, {
            method: "PUT",
            body: jadwalData,
        });
        alert(res.message || "Jadwal berhasil diperbarui");
      } else {
        res = await api("/jadwal", {
            method: "POST",
            body: jadwalData,
        });
        alert(res.message || "Jadwal berhasil disimpan");
      }
      
      resetForm();
      fetchJadwal();
    } catch (err) {
      alert("Gagal menyimpan jadwal: " + err.message);
    }
  };

  // ===========================================================
  // DELETE: Hapus jadwal
  // ===========================================================
  const deleteJadwal = async (id) => {
    if (!window.confirm("Yakin ingin menghapus jadwal ini?")) return;

    try {
      await api(`/jadwal/${id}`, { method: "DELETE" });
      alert("Jadwal berhasil dihapus");
      fetchJadwal();
    } catch (err) {
      alert("Gagal menghapus jadwal: " + err.message);
    }
  };

  const formatAktif = (aktif) =>
    (aktif === 1 || aktif === true) ? (
      <span className="text-green-600 font-semibold">Aktif</span>
    ) : (
      <span className="text-red-600 font-semibold">Nonaktif</span>
    );

  // ===========================================================
  // RENDER
  // ===========================================================
  return (
    <div className="max-w-6xl mx-auto">
      {/* ================= FORM ================= */}
      <form
        onSubmit={submitJadwal}
        className="bg-white p-6 rounded shadow mb-10 max-w-2xl mx-auto"
      >
        <h2 className="text-2xl font-bold mb-4 text-blue-600 border-b pb-2">
          {editingItem ? 'Edit Jadwal Kegiatan' : 'Input Jadwal Kegiatan'}
        </h2>

        <label className="block mb-2">Hari</label>
        <input
          className="w-full border p-2 mb-4 rounded"
          value={hari}
          onChange={(e) => setHari(e.target.value)}
          required
        />

        <label className="block mb-2">Waktu</label>
        <input
          className="w-full border p-2 mb-4 rounded"
          value={waktu}
          onChange={(e) => setWaktu(e.target.value)}
          required
        />

        <label className="block mb-2">Nama Kegiatan</label>
        <input
          className="w-full border p-2 mb-4 rounded"
          value={namaKegiatan}
          onChange={(e) => setNamaKegiatan(e.target.value)}
          required
        />

        <label className="block mb-2">Detail</label>
        <textarea
          className="w-full border p-2 mb-4 rounded"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
        />

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={aktif}
            onChange={(e) => setAktif(e.target.checked)}
          />
          Aktif
        </label>

        <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              {editingItem ? 'Update Jadwal' : 'Simpan Jadwal'}
            </button>
            {editingItem && (
                <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600"
                >
                Batal
                </button>
            )}
        </div>
      </form>

      {/* ================= LIST ================= */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-blue-600 border-b pb-2">
          Daftar Jadwal ({jadwalList.length})
        </h2>

        {isLoading && <p className="text-center">Memuat data...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!isLoading && jadwalList.length > 0 && (
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Hari</th>
                <th className="p-2 border">Waktu</th>
                <th className="p-2 border">Kegiatan</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {jadwalList.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{item.hari}</td>
                  <td className="p-2 border">{item.waktu}</td>
                  <td className="p-2 border">
                    <strong>{item.nama_kegiatan}</strong>
                    <div className="text-xs text-gray-500">{item.detail}</div>
                  </td>
                  <td className="p-2 border">{formatAktif(item.aktif)}</td>
                  <td className="p-2 border text-center flex justify-center gap-2">
                    <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:underline"
                    >
                        Edit
                    </button>
                    <button
                      onClick={() => deleteJadwal(item.id)}
                      className="text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}         

// =============================================================
// 📌 G A L E R I   S E C T I O N (FINAL)
// =============================================================
function GaleriSection() {
  const [judul, setJudul] = useState("");
  const [tipe, setTipe] = useState("foto");
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");

  const [galeriList, setGaleriList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingItem, setEditingItem] = useState(null);
  const [preview, setPreview] = useState("");

  const BASE_GALERI_URL = "/uploads/galeri/";

  // ===========================================================
  // GET GALERI
  // ===========================================================
  const fetchGaleri = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await api("/galeri");

      if (!Array.isArray(data)) {
        throw new Error("Format data galeri tidak valid");
      }

      setGaleriList(data);
    } catch (err) {
      console.error("GALERI FETCH ERROR:", err);
      setError("Gagal memuat daftar galeri.");
      setGaleriList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGaleri();
  }, []);

  // ===========================================================
  // FORM RESET
  // ===========================================================
  const resetForm = (e) => {
    setJudul("");
    setTipe("foto");
    setFile(null);
    setVideoUrl("");
    setEditingItem(null);
    setPreview("");
    if (e) e.target.closest('form').reset();
  };

  // ===========================================================
  // HANDLE EDIT
  // ===========================================================
  const handleEdit = (item) => {
    setEditingItem(item);
    setJudul(item.judul);
    setTipe(item.tipe);
    if (item.tipe === 'foto') {
      setVideoUrl("");
      setPreview(BASE_GALERI_URL + item.file_path);
    } else {
      setVideoUrl(item.video_url || "");
      setPreview("");
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // ===========================================================
  // HANDLE FILE CHANGE
  // ===========================================================
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
        setPreview(URL.createObjectURL(selectedFile));
    } else {
        setPreview("");
    }
  };

  // ===========================================================
  // POST / PUT GALERI
  // ===========================================================
  const submitGaleri = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("tipe", tipe);

    if (tipe === "foto") {
      if (file) { // only append if a new file is chosen
        formData.append("file", file);
      } else if (!editingItem) { // if creating new and no file
        alert("File foto wajib diunggah");
        return;
      }
    } else { // tipe === "video"
      if (!videoUrl) {
        alert("URL video wajib diisi");
        return;
      }
      formData.append("video_url", videoUrl);
    }

    try {
      let res;
      if (editingItem) {
        res = await api(`/galeri/${editingItem.id}`, {
          method: "PUT",
          body: formData,
        });
        alert(res.message || "Galeri berhasil diperbarui");
      } else {
        res = await api("/galeri", {
          method: "POST",
          body: formData,
        });
        alert(res.message || "Galeri berhasil disimpan");
      }

      resetForm(e);
      fetchGaleri();
    } catch (err) {
      alert("Gagal menyimpan galeri: " + err.message);
    }
  };

  // ===========================================================
  // DELETE GALERI
  // ===========================================================
  const deleteGaleri = async (id) => {
    if (!window.confirm("Yakin ingin menghapus item galeri ini?")) return;

    try {
      await api(`/galeri/${id}`, { method: "DELETE" });
      alert("Item galeri berhasil dihapus");
      fetchGaleri();
    } catch (err) {
      alert("Gagal menghapus galeri: " + err.message);
    }
  };

  // ===========================================================
  // RENDER
  // ===========================================================
  return (
    <div className="max-w-6xl mx-auto">
      {/* ================= FORM ================= */}
      <form
        onSubmit={submitGaleri}
        className="bg-white p-6 rounded shadow mb-10 max-w-2xl mx-auto"
      >
        <h2 className="text-2xl font-bold mb-4 text-blue-600 border-b pb-2">
          {editingItem ? 'Edit Galeri' : 'Input Galeri Baru'}
        </h2>

        <label className="block mb-2">Judul</label>
        <input
          className="w-full border p-2 mb-4 rounded"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          required
        />

        <label className="block mb-2">Tipe</label>
        <select
          className="w-full border p-2 mb-4 rounded"
          value={tipe}
          onChange={(e) => setTipe(e.target.value)}
        >
          <option value="foto">Foto</option>
          <option value="video">Video</option>
        </select>

        {tipe === "foto" ? (
          <>
            <label className="block mb-2">Upload Foto</label>
            {preview && <img src={preview} alt="Preview" className="w-40 h-auto object-cover my-2 border"/>}
            <input
              type="file"
              className="w-full mb-4"
              onChange={handleFileChange}
            />
             <small className="text-gray-500 block mb-4">
              {editingItem ? "Kosongkan jika tidak ingin mengubah foto." : ""}
            </small>
          </>
        ) : (
          <>
            <label className="block mb-2">URL Video YouTube</label>
            <input
              className="w-full border p-2 mb-4 rounded"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          </>
        )}

        <div className="flex gap-4">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700">
              {editingItem ? 'Update Galeri' : 'Simpan Galeri'}
            </button>
            {editingItem && (
                <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600"
                >
                Batal
                </button>
            )}
        </div>
      </form>

      {/* ================= LIST ================= */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-blue-600 border-b pb-2">
          Daftar Galeri ({galeriList.length})
        </h2>

        {isLoading && <p className="text-center">Memuat galeri...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!isLoading && galeriList.length > 0 && (
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Tipe</th>
                <th className="p-2 border">Judul</th>
                <th className="p-2 border">Preview</th>
                <th className="p-2 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {galeriList.map((item) => (
                <tr key={item.id}>
                  <td className="p-2 border">{item.tipe}</td>
                  <td className="p-2 border">{item.judul}</td>
                  <td className="p-2 border">
                    {item.tipe === "foto" ? (
                      <a
                        href={`${BASE_GALERI_URL}${item.file_path}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        {item.file_path}
                      </a>
                    ) : (
                      <a
                        href={item.video_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-purple-600 underline"
                      >
                        Video
                      </a>
                    )}
                  </td>
                  <td className="p-2 border text-center flex justify-center gap-2">
                    <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:underline"
                    >
                        Edit
                    </button>
                    <button
                      onClick={() => deleteGaleri(item.id)}
                      className="text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}


// =============================================================
// 📌 W A R T A   S E C T I O N (FINAL)
// =============================================================
function WartaSection() {
  const [judul, setJudul] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [filePDF, setFilePDF] = useState(null);
  const [persembahanIstimewa, setPersembahanIstimewa] = useState("[]");

  const [wartaList, setWartaList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [editingItem, setEditingItem] = useState(null);

  const BASE_PDF_URL = "/uploads/pdf/";

  // ===========================================================
  // GET WARTA
  // ===========================================================
  const fetchWarta = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await api("/warta");

      if (!Array.isArray(data)) {
        throw new Error("Format data warta tidak valid");
      }

      data.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
      setWartaList(data);
    } catch (err) {
      console.error("WARTA FETCH ERROR:", err);
      setError("Gagal memuat daftar warta.");
      setWartaList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWarta();
  }, []);
  
  // ===========================================================
  // FORM RESET
  // ===========================================================
  const resetForm = (e) => {
    setJudul("");
    setTanggal("");
    setFilePDF(null);
    setPersembahanIstimewa("[]");
    setEditingItem(null);
    if(e) e.target.closest('form').reset();
  };
  
  // ===========================================================
  // HANDLE EDIT
  // ===========================================================
  const handleEdit = (item) => {
    setEditingItem(item);
    setJudul(item.judul);
    setTanggal(item.tanggal ? new Date(item.tanggal).toISOString().split('T')[0] : "");
    // Check if persembahan_istimewa is a valid JSON string, otherwise default to "[]"
    try {
        JSON.parse(item.persembahan_istimewa);
        setPersembahanIstimewa(item.persembahan_istimewa);
    } catch {
        setPersembahanIstimewa("[]");
    }
    setFilePDF(null); // Clear file input
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ===========================================================
  // POST / PUT WARTA
  // ===========================================================
  const submitWarta = async (e) => {
    e.preventDefault();

    if (!editingItem && !filePDF) {
      alert("File PDF wajib diupload untuk warta baru");
      return;
    }

    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("tanggal", tanggal);
    formData.append("persembahan_istimewa", persembahanIstimewa);
    if (filePDF) {
        formData.append("file_pdf", filePDF);
    }

    try {
      let res;
      if (editingItem) {
        res = await api(`/warta/${editingItem.id}`, {
            method: "PUT",
            body: formData,
        });
        alert(res.message || "Warta berhasil diperbarui");
      } else {
        res = await api("/warta", {
            method: "POST",
            body: formData,
        });
        alert(res.message || "Warta berhasil disimpan");
      }
      
      resetForm(e);
      fetchWarta();
    } catch (err) {
      alert("Gagal menyimpan warta: " + err.message);
    }
  };

  // ===========================================================
  // DELETE WARTA
  // ===========================================================
  const deleteWarta = async (id, tanggal) => {
    if (!window.confirm(`Hapus warta tanggal ${formatDate(tanggal)}?`)) return;

    try {
      await api(`/warta/${id}`, { method: "DELETE" });
      alert("Warta berhasil dihapus");
      fetchWarta();
    } catch (err) {
      alert("Gagal menghapus warta: " + err.message);
    }
  };

  // ===========================================================
  // RENDER
  // ===========================================================
  return (
    <div className="max-w-6xl mx-auto">
      {/* ================= FORM ================= */}
      <form
        onSubmit={submitWarta}
        className="bg-white p-6 rounded shadow mb-10 max-w-2xl mx-auto"
      >
        <h2 className="text-xl font-semibold mb-4">
            {editingItem ? 'Edit Warta Jemaat' : 'Input Warta Jemaat'}
        </h2>

        <label className="block mb-2 font-medium">Judul Warta</label>
        <input
          className="w-full border p-2 mb-4 rounded"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          required
        />

        <label className="block mb-2 font-medium">Tanggal Warta</label>
        <input
          type="date"
          className="w-full border p-2 mb-4 rounded"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
          required
        />

        <label className="block mb-2 font-medium">File PDF</label>
        {editingItem && editingItem.file_path && (
            <div className="mb-2">
                File saat ini: <a href={BASE_PDF_URL + editingItem.file_path} target="_blank" rel="noreferrer" className="text-blue-600 underline">{editingItem.file_path}</a>
            </div>
        )}
        <input
          type="file"
          className="w-full border p-2 mb-4 rounded"
          accept=".pdf"
          onChange={(e) => setFilePDF(e.target.files[0])}
        />
        {editingItem && <small className="text-gray-500 block mb-4">Kosongkan jika tidak ingin mengubah file PDF.</small>}


        <label className="block mb-2 font-medium">
          Persembahan Istimewa (JSON)
        </label>
        <textarea
          className="w-full border p-3 rounded font-mono text-sm h-36 mb-4"
          value={persembahanIstimewa}
          onChange={(e) => setPersembahanIstimewa(e.target.value)}
        />

        <div className="flex gap-4">
            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
              {editingItem ? 'Update Warta' : 'Upload Warta'}
            </button>
            {editingItem && (
                <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600">
                    Batal
                </button>
            )}
        </div>
      </form>

      {/* ================= LIST ================= */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-blue-600 border-b pb-2">
          Daftar Warta ({wartaList.length})
        </h2>

        {isLoading && <p className="text-center">Memuat warta...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!isLoading && wartaList.length > 0 && (
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Tanggal</th>
                <th className="p-2 border">Judul</th>
                <th className="p-2 border">PDF</th>
                <th className="p-2 border">Persembahan</th>
                <th className="p-2 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {wartaList.map((item) => (
                <tr key={item.id}>
                  <td className="p-2 border">{formatDate(item.tanggal)}</td>
                  <td className="p-2 border">{item.judul}</td>
                  <td className="p-2 border">
                    <a
                      href={`${BASE_PDF_URL}${item.file_path}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      {item.file_path}
                    </a>
                  </td>
                  <td className="p-2 border">
                    {item.persembahan_istimewa &&
                    item.persembahan_istimewa.length > 2 &&
                    item.persembahan_istimewa !== '[]' ? (
                      <span className="text-green-600">Ada</span>
                    ) : (
                      <span className="text-gray-400">Kosong</span>
                    )}
                  </td>
                  <td className="p-2 border text-center flex justify-center gap-2">
                    <button onClick={() => handleEdit(item)} className="text-blue-600 hover:underline">
                        Edit
                    </button>
                    <button
                      onClick={() => deleteWarta(item.id, item.tanggal)}
                      className="text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
