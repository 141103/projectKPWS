import React, { useState, useEffect, useCallback } from 'react';
import {
  // --- Ikon Navigasi & Umum ---
  Church, Menu, X, Sun, Moon, User, 
  
  // --- Ikon Fungsional ---
  Book, Camera, Calendar, HandCoins, Heart, GraduationCap, Music, MapPin, Phone, Mail, Newspaper, Gift, DollarSign, ChevronLeft, 
  
  // --- Ikon Modal & Loader ---
  Loader, Download 
  
} from 'lucide-react';

import { Link } from "react-router-dom";
import defaultChurchImg from '../assets/PhotoGereja.jpg';
// Gunakan defaultChurchImg sebagai fallback


const CHURCH_PHOTO_URL = 'https://lh5.googleusercontent.com/p/AF1QipPGcZsqYu4oPkK3t7GKqzAi0ye7S1JlzUDsWfbo=w408-h306-k-no';
const LOGO_GKJ_URL = 'https://sinodegkj.or.id/wp-content/uploads/2023/01/arti-makna-lmbang-gereja-kristen-jawa-gkj.png';

/// Data Koordinat Peta (GKJ Wates Selatan)
const CHURCH_ADDRESS = "GKJ Wates Selatan"; 
const MAP_COORDINATES = {
    lat: -7.910295743830408, 
    lng: 110.16149365254002,
    zoom: 15,
};

// URL Embed Google Maps yang sudah diperbaiki (TIDAK memerlukan API Key)
// Menggunakan format standard maps.google.com/maps?output=embed
const GOOGLE_MAPS_EMBED_URL = `https://maps.google.com/maps?q=${MAP_COORDINATES.lat},${MAP_COORDINATES.lng}&z=${MAP_COORDINATES.zoom}&output=embed`;

// ====================================================================
const WARTA_JEMAAT_FILE_ID = "141sCG_EfaKpmeB8w6HACwobZ_dbwbjQA"; 

const PDF_VIEWER_URL = WARTA_JEMAAT_FILE_ID === "1d-lQZg2xHcVzFm8XiCfMMa8niHOuWHIe" 
    ? "https://placehold.co/800x600/CCCCCC/333333/pdf" 
    : `https://drive.google.com/file/d/${WARTA_JEMAAT_FILE_ID}/preview`; 
    
const PDF_DOWNLOAD_URL = `https://drive.google.com/uc?export=download&id=${WARTA_JEMAAT_FILE_ID}`; 

// Data Warta Jemaat (Wajib ada untuk fallback Judul/Tanggal)
const WartaJemaatData = {
    issueDate: "Minggu, 21 September 2025",
    title: "GOSPEL - GEMA INFORMASI GKJ WATES SELATAN",
};

const WartaJemaatDetailData = {
    financialReport: [
        { label: "Sisa Kas Bulan Juli 2025", amount: 20614000 },
        { label: "Penerimaan Bulan Agustus 2025", amount: 18509000 },
        { label: "Sub Jumlah", amount: 39123000, highlight: true },
        { label: "Pengeluaran Bulan Agustus 2025", amount: -16810700, isExpense: true },
        { label: "Saldo Kas per 31 Agustus 2025", amount: 22312300, highlight: true, final: true },
    ],
    birthdays: [
        { date: "22 September", name: "Ib. Mimien Ernawati", location: "Depok" },
        { date: "23 September", name: "Bp. Lukas Purnomo", location: "Depok" },
        { date: "23 September", name: "Sdri. Rachelia Septiasih Cahyaningtyas", location: "Triharjo" }, // Mengasumsikan tanggal sama
        { date: "26 September", name: "An. Jonea Nazaret Alfa Saputra", location: "Galur" },
        { date: "27 September", name: "An. Nathan Haryo Cristian", location: "Wonogiri" },
    ],
};

/**
 * Helper: Format angka menjadi Rupiah (IDR)
 */
const formatRupiah = (amount) => {
    if (typeof amount !== 'number') return amount;
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};


// ====================================================================
// 1. HELPER FUNCTIONS
// ====================================================================

// Fungsi helper untuk smooth scroll
const scrollToSection = (id, setActiveSection) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => setActiveSection(id), 100); 
  }
};

const safeJsonParse = (jsonString, fallbackValue = []) => {
    if (!jsonString || typeof jsonString !== 'string') return fallbackValue;
    
    let result = fallbackValue;
    
    try {
        // Coba parse pertama
        result = JSON.parse(jsonString);

        // 📌 PERBAIKAN: Jika hasil parsing pertama masih berupa string, 
        // coba parse lagi (mengatasi double-encoding dari DB)
        if (typeof result === 'string') {
            result = JSON.parse(result);
        }
        
        // Pastikan hasil akhir adalah array/objek yang valid (bukan string)
        if (typeof result === 'object' && result !== null) {
            return result;
        }

    } catch (e) {
        // Kegagalan parsing, kembalikan fallback
        console.error("JSON Double Parsing failed:", e.message, "for string:", jsonString);
        return fallbackValue;
    }
    
    return fallbackValue; // Kembalikan fallback jika ada kegagalan tak terduga
};

// ====================================================================
// 2. HOOKS
// ====================================================================

/**
 * Hook kustom untuk Dark Mode
 */
const useDarkMode = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Inisialisasi dari localStorage atau preferensi sistem
    useEffect(() => {
        const root = window.document.documentElement;
        const storedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        let initialMode = storedTheme === 'dark' || (storedTheme === null && systemPrefersDark);
        
        setIsDarkMode(initialMode);
        if (initialMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, []);

    // Terapkan perubahan tema dan simpan ke localStorage
    const toggleDarkMode = useCallback(() => {
        setIsDarkMode(prevMode => {
            const newMode = !prevMode;
            const root = window.document.documentElement;
            localStorage.setItem('theme', newMode ? 'dark' : 'light');

            if (newMode) {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
            return newMode;
        });
    }, []);

    return { isDarkMode, toggleDarkMode };
};

//RENUNGAN
/**
 * Hook kustom untuk mengambil data Renungan Harian dari API.
 * Mengambil 4 renungan terbaru (hari ini + 3 hari ke belakang) atau
 * 1 renungan jika 'date' disediakan.
 */
const useDevotions = () => {
    const [devotions, setDevotions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // State untuk melacak renungan yang sedang ditampilkan
    const [currentPage, setCurrentPage] = useState(0); // 0 = renungan terbaru

    // Fetch data
    useEffect(() => {
        const fetchDevotions = async () => {
            setIsLoading(true);
            setError(null);
            
            // Asumsi API berjalan di /api/renungan
            const apiUrl = `/api/renungan?limit=4`; 
            
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                // Sort data agar yang terbaru (tanggal terbesar) ada di index 0
                data.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
                
                setDevotions(data);
                
            } catch (e) {
                // Data placeholder/statis jika fetch gagal
                const staticDevotion = {
                    // FIX: Tambahkan 'judul' di data statis
                    judul: "Kasih yang Tak Terbatas (Statis)",
                    tanggal: "2025-09-19",
                    ayat_referensi: "Yohanes 3:16",
                    teks_ayat: `"Karena begitu besar kasih Allah akan dunia ini, sehingga Ia telah mengaruniakan Anak-Nya yang tunggal, supaya setiap orang yang percaya kepada-Nya tidak binasa, melainkan beroleh hidup yang kekal."`,
                    isi_renungan: `Saudara-saudara terkasih dalam Kristus, hari ini kita diingatkan kembali akan kasih Allah yang tak terbatas kepada kita.\n\nDalam kehidupan sehari-hari, sering kali kita merasa tidak layak atau terlalu berdosa untuk menerima kasih Allah.`,
                    pengarang: "Pdt. Dr. Yohanes Santoso, M.Th (Data Statis)"
                };
                setDevotions([staticDevotion]);
                console.error("Gagal mengambil data renungan dari API:", e.message);
                setError("Gagal memuat renungan. Menampilkan data statis.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDevotions();
    }, []);
    
    // Fungsi untuk navigasi
    const goToPrevious = () => {
        // Cek apakah ada renungan di index selanjutnya
        if (currentPage < devotions.length - 1) {
            setCurrentPage(currentPage + 1);
        }
    };
    
    const goToNext = () => {
         // Cek apakah bukan renungan hari ini (index 0)
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const currentDevotion = devotions[currentPage];
    const canGoPrevious = currentPage < devotions.length - 1;
    const canGoNext = currentPage > 0;

    return { 
        currentDevotion, 
        isLoading, 
        error,
        goToPrevious,
        goToNext,
        canGoPrevious,
        canGoNext,
        devotionsCount: devotions.length,
        currentPage
    };
};

// --- HOOKS: Warta Jemaat ---
/**
 * Hook kustom untuk mengambil data Warta Jemaat terbaru dari API.
 */
const useLatestWarta = () => {
    const [latestWarta, setLatestWarta] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWarta = async () => {
        setIsLoading(true);
        setError(null);
 
            const apiUrl = `/api/warta?limit=1`; 

            try {
                    const response = await fetch(apiUrl);
                    if (!response.ok) {
                    // FIX: Jika API merespons dengan 404/500, lemparkan error
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();

                    if (data && data.length > 0) {
                    const rawWarta = data[0];

                    // 📌 BAGIAN INI YANG DIUBAH: GANTI JSON.parse() dengan safeJsonParse()
                    const processedWarta = {
                         ...rawWarta,
                        persembahan_istimewa: safeJsonParse(rawWarta.persembahan_istimewa),
                    };

                    setLatestWarta(processedWarta);
                    } else {
                    setLatestWarta(null);
                    }

                } catch (e) {
                console.error("Gagal mengambil data warta dari API:", e.message);
                // FIX: Gunakan error message dari exception
                setError(e.message || "Gagal memuat warta. Cek koneksi API.");
                } finally {
                setIsLoading(false);    
            }
        };

        fetchWarta();
    }, []);

    return { latestWarta, isLoading, error };
};

const useScheduleData = () => {
    const [scheduleData, setScheduleData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSchedule = async () => {
            setIsLoading(true);
            setError(null);
            
            const apiUrl = `/api/jadwal`; 
            
            try {
                // Menggunakan fetch biasa, tidak perlu JWT
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                // Pastikan data yang aktif saja yang ditampilkan
                const activeData = data.filter(item => item.aktif); 

                // Urutkan data berdasarkan hari (Contoh sederhana: Ibadah Minggu di depan)
                activeData.sort((a, b) => {
                    if (a.hari === 'Ibadah Minggu' && b.hari !== 'Ibadah Minggu') return -1;
                    if (a.hari !== 'Ibadah Minggu' && b.hari === 'Ibadah Minggu') return 1;
                    return a.waktu.localeCompare(b.waktu); // Sort by time as secondary
                });
                
                setScheduleData(activeData);
                
            } catch (e) {
                console.error("Gagal mengambil data jadwal:", e.message);
                setError("Gagal memuat jadwal. Menampilkan data statis.");
                // Fallback ke data statis lama jika fetch gagal
                setScheduleData(scheduleItems); // Asumsi scheduleItems masih didefinisikan
            } finally {
                setIsLoading(false);
            }
        };

        fetchSchedule();
    }, []);

    return { scheduleData, isLoading, error };
};

const BASE_IMAGE_URL = '/uploads/images/'; // URL base untuk gambar

const useGlobalConfig = () => {
    const [config, setConfig] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchConfig = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/konfigurasi');
                if (!response.ok) {
                    throw new Error('Gagal mengambil konfigurasi dari server');
                }
                const data = await response.json();
                
                // data is an object, not an array of key-value pairs
                // const configObject = data.reduce((acc, item) => {
                //     acc[item.key_name] = item.key_value;
                //     return acc;
                // }, {});

                const finalConfig = {
                    CHURCH_PHOTO_URL: data.CHURCH_PHOTO_PATH 
                        ? `${BASE_IMAGE_URL}${data.CHURCH_PHOTO_PATH}` 
                        : 'https://lh5.googleusercontent.com/p/AF1QipPGcZsqYu4oPkK3t7GKqzAi0ye7S1JlzUDsWfbo=w408-h306-k-no', // Fallback
                    LOGO_GKJ_URL: data.LOGO_GKJ_PATH 
                        ? `${BASE_IMAGE_URL}${data.LOGO_GKJ_PATH}` 
                        : 'https://sinodegkj.or.id/wp-content/uploads/2023/01/arti-makna-lmbang-gereja-kristen-jawa-gkj.png', // Fallback
                };

                setConfig(finalConfig);
            } catch (e) {
                console.error("Gagal mengambil konfigurasi global:", e.message);
                // Fallback ke data statis yang sudah ada
                setConfig({
                    CHURCH_PHOTO_URL: 'https://lh5.googleusercontent.com/p/AF1QipPGcZsqYu4oPkK3t7GKqzAi0ye7S1JlzUDsWfbo=w408-h306-k-no',
                    LOGO_GKJ_URL: 'https://sinodegkj.or.id/wp-content/uploads/2023/01/arti-makna-lmbang-gereja-kristen-jawa-gkj.png',
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchConfig();
    }, []);

    return { config, isLoading };
};

const BASE_GALERI_URL = '/uploads/galeri/';

const useGalleryData = () => {
    const [galeriData, setGaleriData] = useState({ photos: [], videos: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGaleri = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                const response = await fetch('/api/galeri'); 
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                const photos = data
                    .filter(item => item.tipe === 'foto')
                    // FIX: Gunakan BASE_GALERI_URL untuk membuat URL lengkap
                    .map(item => ({ 
                        id: item.id, 
                        src: `${BASE_GALERI_URL}${item.file_path}`, 
                        // caption: item.judul 
                    }));

                const videos = data
                    .filter(item => item.tipe === 'video')
                    // FIX: Ekstrak YouTube embed URL dari URL penuh jika perlu
                    .map(item => ({ 
                        id: item.id, 
                        // Asumsi item.video_url sudah dalam format embed yang bisa dipakai
                        src: item.video_url, 
                        // caption: item.judul
                    }));
                
                setGaleriData({ photos, videos });
                
            } catch (e) {
                console.error("Gagal mengambil data galeri:", e.message);
                setError("Gagal memuat galeri. Menampilkan data statis.");
                // Fallback ke data statis
                setGaleriData({
                     photos: [ { id: 1, src: "https://picsum.photos/400/300?random=1", caption: "Ibadah Minggu (Statis)" } ],
                     videos: [ { id: 1, src: "https://www.youtube.com/embed/dQw4w9WgXcQ", caption: "Rick Astley (Statis)" } ],
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchGaleri();
    }, []);

    return { galeriData, isLoading, error };
};

// ====================================================================
// 3. COMPONENTS
// ====================================================================

// --- MODAL COMPONENT ---
const ServiceModal = ({ service, onClose }) => {
    if (!service) return null;

    // Data Detail Tambahan untuk Modal
    const detailContent = {
        'Ibadah Minggu': {
            icon: <Church className="w-16 h-16 text-blue-500 mx-auto mb-4" />,
            title: 'Ibadah Minggu',
            body: 'Ibadah rutin dilaksanakan setiap hari Minggu di gereja induk dan pepanthan. Kami menawarkan dua sesi ibadah. Liturgi dirancang untuk memuliakan Tuhan dan memperkuat iman jemaat. Pelayanan sakramen dilaksanakan secara berkala sesuai jadwal gerejawi.',
            jadwal: 'Pukul 07:00 dan 09:30 WIB (Gereja Induk).'
        },
        'Persekutuan': {
            icon: <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />,
            title: 'Persekutuan Keluarga & Kelompok',
            body: 'Persekutuan adalah sarana untuk mempererat tali kasih antar jemaat. Kami memiliki persekutuan khusus untuk kaum muda, wanita, pria, dan persekutuan wilayah (kelompok). Kegiatan ini mencakup doa bersama, diskusi firman, dan kegiatan sosial.',
            jadwal: 'Jadwal bervariasi per kelompok (cek warta jemaat).'
        },
        'Sekolah Minggu': {
            icon: <GraduationCap className="w-16 h-16 text-green-500 mx-auto mb-4" />,
            title: 'Sekolah Minggu / Anak',
            body: 'Sekolah Minggu bertujuan menanamkan nilai-nilai Kristiani sejak dini. Kami menggunakan kurikulum yang interaktif dan menyenangkan yang disesuaikan dengan kelompok usia anak, mulai dari balita hingga pra-remaja. Dilaksanakan bersamaan dengan ibadah kedua.',
            jadwal: 'Pukul 09:00 WIB, setiap Minggu.'
        },
        'Pemahaman Alkitab': {
            icon: <Book className="w-16 h-16 text-purple-500 mx-auto mb-4" />,
            title: 'Studi & Pemahaman Alkitab',
            body: 'Pemahaman Alkitab (PA) adalah kegiatan rutin untuk menggali dan memahami Firman Tuhan secara mendalam. Diadakan di lingkungan gereja. PA dipimpin oleh pendeta atau majelis yang bertugas, memberikan kesempatan untuk bertanya dan berdiskusi.',
            jadwal: 'Jadwal bervariasi per kelompok (cek warta jemaat).'
        }
    };

    // Ambil konten berdasarkan judul, atau gunakan fallback
    const content = detailContent[service.title] || { 
        title: service.title, 
        body: service.desc, 
        jadwal: 'Tidak tersedia.' 
    };

    return (
        <div 
            className="fixed inset-0 bg-gray-900 bg-opacity-75 z-[9999] flex justify-center items-center p-4 transition-opacity duration-300"
            onClick={onClose} 
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full transform transition-all duration-300 scale-100 opacity-100 overflow-hidden"
                onClick={(e) => e.stopPropagation()} 
            >
                <div className="p-6 sm:p-8">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-gray-100 flex items-center">
                            {/* Hanya tampilkan ikon jika ada di detailContent */}
                            {content.icon && <span className='mr-3'>{content.icon}</span>}
                            {content.title}
                        </h3>
                        <button 
                            onClick={onClose}
                            className="text-gray-400 hover:text-red-500 p-1 rounded-full transition-colors focus:outline-none"
                            aria-label="Tutup Modal"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-4 text-base sm:text-lg leading-relaxed">
                        {content.body}
                    </p>

                    <div className="bg-blue-50 dark:bg-blue-900/50 p-3 rounded-lg mt-4 border-l-4 border-blue-500">
                        <p className="font-semibold text-blue-700 dark:text-blue-300 text-sm">
                            Jadwal Rutin: <span className="font-normal">{content.jadwal}</span>
                        </p>
                    </div>

                    <div className="mt-6 text-center">
                        <button 
                            onClick={onClose}
                            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors shadow-md"
                        >
                            Oke, Mengerti
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- HERO COMPONENT ---
const Hero = ({ isDarkMode, churchPhotoUrl, isConfigLoading }) => {
    const lightClass = 'text-white shadow-lg';
    const darkClass = 'text-gray-900 bg-white/90 shadow-2xl';

    if (isConfigLoading) {
        return (
            <section id="beranda" className="pt-16 relative bg-gray-200 dark:bg-gray-700 min-h-[70vh] flex items-center justify-center">
                <Loader className="w-12 h-12 animate-spin text-blue-500" />
            </section>
        );
    }

    return (
        <section id="beranda" 
            className="pt-16 relative bg-cover bg-center min-h-[70vh] flex items-center transition-all duration-500" 
            style={{ 
                backgroundImage: `url(${churchPhotoUrl || CHURCH_PHOTO_URL})`,
            }}
        >
            {/* Overlay untuk keterbacaan teks */}
            <div className={`absolute inset-0 bg-slate-900 opacity-60 transition-opacity duration-500 ${isDarkMode ? 'opacity-80' : 'opacity-60'}`}></div>

            <div className="max-w-7xl mx-auto px-4 relative z-10 text-center py-20">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 drop-shadow-lg transition-colors duration-500">
                    Selamat Datang di GKJ Wates Selatan
                </h1>
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 mb-8 drop-shadow transition-colors duration-500">
                    Melayani, bersaksi, dan bersekutu dalam kasih karunia Tuhan Yesus Kristus. Mari bertumbuh bersama dalam iman.
                </p>
                <a 
                    href="#jadwal"
                    className={`inline-flex items-center justify-center px-8 py-3 border border-transparent 
                                text-lg font-medium rounded-full transition-all duration-300 transform hover:scale-105 
                                ${isDarkMode ? darkClass : lightClass} bg-blue-600 hover:bg-blue-700
                                `}
                >
                    Lihat Jadwal Ibadah
                </a>
            </div>
        </section>
    );
};

const PhotoModal = ({ photo, onClose }) => {
    console.log("PhotoModal sedang mencoba render. Photo:", photo);
    if (!photo) return null;

    // Nama file untuk diunduh (untuk atribut download)
    const fileName = photo.src.substring(photo.src.lastIndexOf('/') + 1);
    // 📌 AMBIL HANYA NAMA FILE dari URL penuh (misal: 1703657353987-foto.png)
    const filenameOnly = photo.src.substring(photo.src.lastIndexOf('/') + 1);
    
    // 📌 URL BARU: Memanggil endpoint backend
    const downloadApiUrl = `/api/galeri/download/${filenameOnly}`;
    
    return (
        // Overlay - Klik di luar akan menutup modal
        <div 
            className="fixed inset-0 bg-gray-900 bg-opacity-100 z-[9999] flex justify-center items-center p-4"
            onClick={onClose} 
        >
            <div 
                className="relative max-w-4xl w-full h-auto max-h-[90vh] bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam menutup modal
            >
                {/* Tombol Tutup */}
                <button 
                    onClick={onClose}
                    className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
                    aria-label="Tutup"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Konten Gambar dan Tombol Download */}
                <div className="flex flex-col h-full">
                    {/* Gambar Diperbesar */}
                    <div className="flex-grow flex items-center justify-center p-4">
                        <img 
                            src={photo.src} 
                            alt={photo.caption} 
                            className="max-w-full max-h-[75vh] object-contain rounded-lg"
                        />
                    </div>
                    
                    {/* Caption dan Download */}
            <div className="p-4 bg-gray-100 dark:bg-gray-900 flex justify-between items-center">
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{photo.caption}</p>
                <a
                    href={downloadApiUrl} 
                    // 📌 PERUBAHAN KRUSIAL: Membuka di tab baru untuk menghindari blokir
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                    onClick={(e) => { 
                    }} 
                >
                    <Download className="w-5 h-5 mr-2" />
                    Unduh Gambar
                </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Tambahkan sebelum WartaJemaat
const SectionHeader = ({ id, title, subtitle, icon: Icon }) => (
    <div id={id} className="mb-10 text-center">
        {Icon && <Icon className="mx-auto mb-2 w-10 h-10 text-blue-500" />}
        <h2 className="text-3xl font-bold text-slate-800 dark:text-gray-100">{title}</h2>
        <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
    </div>
);

const CustomInfoBlock = ({ content, title }) => {
    // Pisahkan konten berdasarkan baris baru untuk paragraf
    const paragraphs = content ? content.split('\n').filter(p => p.trim() !== '') : [];

    if (!content || paragraphs.length === 0) return null;

    return (
        // Gunakan col-span-2 agar selalu mengambil lebar penuh
        <div className="md:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border-t-4 border-purple-500">
            <div className="flex items-center mb-4">
                <Newspaper className="w-6 h-6 text-purple-500 mr-2"/> 
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">{title || 'Informasi Khusus'}</h4>
            </div>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 text-base">
                {paragraphs.map((p, index) => (
                    <p key={index}>{p}</p>
                ))}
            </div>
        </div>
    );
};

// --- Warta Jemaat Component ---
const WartaJemaat = () => {
    // 1. Panggil Hook yang mengambil data warta terbaru dari API
    const { latestWarta, isLoading, error } = useLatestWarta();

    // URL dasar untuk mengakses file PDF yang diupload
    const BASE_PDF_URL = "/uploads/pdf/";
    
    // Helper untuk memformat tanggal (Pastikan fungsi ini ada di Header.jsx)
    const formatDate = (dateString) => {
    if (!dateString) return 'Tanggal Tidak Diketahui';

    let date;

    // 1. Coba parsing dengan penambahan T00:00:00 (metode timezone-safe)
    date = new Date(dateString + 'T00:00:00'); 
    
    // Jika parsing metode 1 GAGAL, coba parsing langsung
    if (isNaN(date.getTime())) {
        // 2. Coba parsing langsung (metode browser default)
        date = new Date(dateString); 
    }

    // 🛑 LAKUKAN VALIDASI: Periksa apakah objek Date valid
    if (isNaN(date.getTime())) {
        // Jika kedua metode gagal, string dari DB memang bermasalah
        return 'Tanggal Invalid'; 
    }

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
};
    
    // 📌 DATA FALLBACK: Gunakan data API jika ada, jika tidak, gunakan data statis global.
    const specialOfferingData = latestWarta?.persembahan_istimewa || WartaJemaatDetailData.specialOfferingReport;
    const finalSpecialOfferingData = Array.isArray(specialOfferingData) ? specialOfferingData : [];

    // === LOGIC TAMPILAN LOADING / ERROR / URL ===
    if (isLoading) {
        return (
            <section id="warta-jemaat" className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-gray-100 mb-8">Warta Jemaat</h2>
                    <p className="text-blue-500 dark:text-blue-400 flex items-center justify-center">
                        {/* Asumsi Loader sudah diimpor */}
                        {/* <Loader className="w-5 h-5 animate-spin mr-2" /> */}
                        Memuat data Warta Jemaat terbaru...
                    </p>
                </div>
            </section>
        );
    }

    if (!latestWarta) {
        return (
             <section id="warta-jemaat" className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-gray-100 mb-8">Warta Jemaat</h2>
                    <p className="text-red-500 dark:text-red-400">Tidak ada data Warta Jemaat terbaru yang ditemukan.</p>
                </div>
            </section>
        );
    }
    
    // Tentukan Judul, Tanggal, dan URL berdasarkan data API atau Fallback
    const issueDate = latestWarta ? formatDate(latestWarta.tanggal) : WartaJemaatData.issueDate;
    const title = latestWarta ? latestWarta.judul : WartaJemaatData.title;
    
    let currentPDFViewerURL;
    let currentPDFDownloadURL;
    let showPlaceholderNote = false;

    if (error || !latestWarta) {
        currentPDFViewerURL = PDF_VIEWER_URL; 
        currentPDFDownloadURL = PDF_DOWNLOAD_URL;
        showPlaceholderNote = true;
    } else {
        const filePath = latestWarta.file_path;
        currentPDFViewerURL = `${BASE_PDF_URL}${filePath}`; 
        currentPDFDownloadURL = `${BASE_PDF_URL}${filePath}`; 
    }

    const isPlaceholder = showPlaceholderNote && WARTA_JEMAAT_FILE_ID === "1d-lQZg2xHcVzFm8XiCfMMa8niHOuWHIe";
    // === END LOGIC ===


    return (
        <section id="warta-jemaat" className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
            {/* ... (Header dan PDF Viewer Section tidak berubah) ... */}
            
            <SectionHeader 
                id="warta-jemaat-header-component"
                title="Warta Jemaat" 
                subtitle={`Edisi ${issueDate} - ${title}`} 
                icon={Newspaper} 
            />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                {/* --- PDF Viewer Section --- */}
                <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Dokumen Warta Jemaat (PDF)</h3>
                    <p className="text-gray-600 dark:text-gray-400">Tampilan lengkap Warta Jemaat</p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-4 sm:p-6 mb-10">
                    <div className="w-full h-[600px] overflow-hidden border-4 border-indigo-500 dark:border-indigo-400 rounded-lg">
                        <iframe
                            src={currentPDFViewerURL}
                            title="Warta Jemaat PDF Viewer"
                            className="w-full h-full"
                            style={{ minHeight: '500px' }}
                            frameBorder="0"
                            type="application/pdf"
                        />
                    </div>
                    {(showPlaceholderNote) && (
                         <p className="text-sm text-center text-red-500 dark:text-red-400 mt-3 font-semibold">
                            {error 
                                ? `ERROR: Gagal memuat Warta terbaru dari API. Menampilkan data statis/lama. (${error})`
                                : `CATATAN: Tampilan ini menggunakan URL placeholder Google Drive.`
                            }
                        </p>
                    )}
                </div>

                {/* Download Button */}
                <div className="text-center mb-16">
                    <a
                        href={currentPDFDownloadURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={`Warta_Jemaat_GKJ_Wates_Selatan_${issueDate.replace(/[, ]/g, '_')}.pdf`}
                        className="inline-flex items-center justify-center px-10 py-4 border border-transparent text-lg font-bold rounded-full shadow-xl text-white bg-green-600 hover:bg-green-700 transition duration-300 transform hover:scale-105"
                    >
                        <Gift className="w-5 h-5 mr-3"/>
                        Unduh Warta Jemaat (PDF)
                    </a>
                </div>

                {/* --- Structured Data Section --- */}
                {/* 📌 KONDISI UTAMA: HANYA RENDER JIKA ADA DATA PERSEMBAHAN ISTIMEWA */}
                {finalSpecialOfferingData.length > 0 && (
                    <div className="grid md:grid-cols-2 gap-8">
                        
                        {/* 📌 KITA HANYA MENGGUNAKAN SATU DIV DENGAN col-span-2 */}
                        <div className="md:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border-t-4 border-yellow-500">
                            <div className="flex items-center mb-4">
                                <HandCoins className="w-6 h-6 text-yellow-500 mr-2"/> 
                                <h4 className="text-xl font-bold text-gray-900 dark:text-white">Persembahan Istimewa</h4>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                Majelis telah menerima persembahan istimewa, Tuhan memberkati.
                            </p>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border dark:border-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        {/* ... (thead tabel tidak berubah) ... */}
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {finalSpecialOfferingData.map((item, index) => (
                                            <tr key={`spec-${index}`}>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{index + 1}.</td>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.dari || '-'}</td>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">
                                                    {item.nominal ? formatRupiah(item.nominal) : item.nominal}
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.peruntukan || '-'}</td>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.keterangan || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* 📌 PESAN KOSONG: Jika tidak ada Persembahan Istimewa, tampilkan pesan ini */}
                {finalSpecialOfferingData.length === 0 && (
                     <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
                         Tidak ada Persembahan Istimewa yang dicatat pada Warta Jemaat edisi ini.
                     </p>
                )}
            </div>
        </section>
    );
};

const FloatingAdminButton = () => {
    // Cek status login (diambil dari sessionStorage)
    const isAdminLoggedIn = !!sessionStorage.getItem('token');
    
    // Tentukan URL dan Label berdasarkan status login
    const targetPath = isAdminLoggedIn ? '/admin/dashboard' : '/admin/login';
    const label = isAdminLoggedIn ? 'Admin Dashboard' : 'Admin Login';

    // Tentukan warna dan ikon
    const bgColor = isAdminLoggedIn ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-red-600 hover:bg-red-700';
    const Icon = isAdminLoggedIn ? Menu : User; // Asumsi ikon User sudah diimport

    return (
        <a
            href={targetPath}
            // 📌 POSISI FIXED, KANAN BAWAH (z-index tinggi)
            className={`fixed bottom-6 right-6 z-40 
                        flex items-center px-4 py-3 
                        text-sm font-semibold rounded-full 
                        text-white shadow-xl transition-all duration-300 
                        transform hover:scale-105 ${bgColor}`}
            aria-label={label}
        >
            <Icon className="w-5 h-5 mr-2" />
            {label}
        </a>
    );
};


// --- DEVOTION COMPONENT ---
const Devotion = () => {
    // FIX: Gunakan hook useDevotions yang telah dimodifikasi
    const { 
        currentDevotion, 
        isLoading, 
        error, 
        goToPrevious, 
        goToNext, 
        canGoPrevious, 
        canGoNext,
        currentPage
    } = useDevotions();

    // Helper untuk memformat tanggal YYYY-MM-DD menjadi DD MMMM YYYY
const formatDate = (dateString) => {
    if (!dateString) return 'Tanggal Tidak Diketahui';

    let date;

    // 1. Coba parsing dengan penambahan T00:00:00 (metode timezone-safe yang paling sering gagal di browser)
    date = new Date(dateString + 'T00:00:00'); 
    
    // Jika parsing metode 1 GAGAL, coba parsing langsung (metode yang lebih forgiving)
    if (isNaN(date.getTime())) {
        // 2. Coba parsing langsung (tanpa T00:00:00)
        date = new Date(dateString); 
    }

    // 🛑 LAKUKAN VALIDASI AKHIR
    if (isNaN(date.getTime())) {
        // Jika kedua metode gagal, string dari DB memang bermasalah
        return 'Tanggal Invalid'; 
    }

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
};
    
    if (isLoading) {
        return (
            <section id="renungan" className="py-12 sm:py-20 bg-white dark:bg-gray-800 transition-colors duration-500">
                 <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-800 dark:text-gray-100 mb-8 sm:mb-12">Renungan Harian</h2>
                    <p className="text-blue-500 dark:text-blue-400 flex items-center justify-center">
                        <Loader className="w-5 h-5 animate-spin mr-2" />
                        Memuat Renungan...
                    </p>
                </div>
            </section>
        );
    }
    
    if (!currentDevotion) {
         return (
            <section id="renungan" className="py-12 sm:py-20 bg-white dark:bg-gray-800 transition-colors duration-500">
                 <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-800 dark:text-gray-100 mb-8 sm:mb-12">Renungan Harian</h2>
                    <p className="text-red-500 dark:text-red-400">Tidak ada data renungan yang tersedia saat ini. {error && `(${error})`}</p>
                </div>
            </section>
        );
    }

    // Renungan hari ini adalah renungan pertama (index 0)
    const isToday = currentPage === 0;

    // Pisahkan isi renungan berdasarkan baris baru untuk membuat paragraf
    const paragraphs = currentDevotion.isi_renungan ? currentDevotion.isi_renungan.split('\n').filter(p => p.trim() !== '') : [];


    return (
        <section id="renungan" className="py-12 sm:py-20 bg-white dark:bg-gray-800 transition-colors duration-500">
            <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-800 dark:text-gray-100 mb-8 sm:mb-12">Renungan Harian</h2>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-lg p-5 sm:p-8 border-t-8 border-red-500 transition-colors duration-500">
                    <div className="mb-6">
                        {/* FIX: Menggunakan kolom judul dari DB */}
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-gray-100 mb-4">
                            {currentDevotion.judul || 'Renungan Tanpa Judul'}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:justify-between text-gray-500 dark:text-gray-400 text-sm sm:text-base gap-2">
                            <span>{formatDate(currentDevotion.tanggal)} {isToday && '(Hari Ini)'}</span>
                            <span>{currentDevotion.pengarang || 'Pengarang Tidak Diketahui'}</span> 
                        </div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 sm:p-6 rounded-lg mb-6 border-l-4 border-blue-500">
                        <p className="italic text-gray-700 dark:text-gray-300 mb-4 text-base sm:text-lg">
                            {currentDevotion.teks_ayat}
                        </p>
                        <span className="text-right block text-gray-600 dark:text-gray-400 italic text-sm sm:text-base">- {currentDevotion.ayat_referensi}</span>
                    </div>
                    <div className="space-y-4 text-gray-700 dark:text-gray-300 text-base sm:text-lg">
                        {/* Tampilkan Paragraf Isi Renungan */}
                        {paragraphs.map((p, index) => (
                            <p key={index} dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        ))}
                    </div>

                    {/* NAVIGASI RENUNGAN */}
                    <div className="mt-6 flex justify-between">
                        <button 
                            onClick={goToPrevious}
                            disabled={!canGoPrevious} // Disable jika tidak ada renungan sebelumnya (maks. 3 hari ke belakang)
                            className={`flex items-center font-semibold text-sm sm:text-base transition-colors ${
                                canGoPrevious ? 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300' : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                            }`}
                        >
                            <ChevronLeft className="w-5 h-5 mr-1" />
                            Baca Renungan Sebelumnya
                        </button>
                         <button 
                            onClick={goToNext}
                            disabled={!canGoNext} // Disable jika sudah renungan hari ini (index 0)
                            className={`flex items-center font-semibold text-sm sm:text-base transition-colors ${
                                canGoNext ? 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300' : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                            }`}
                        >
                            Baca Renungan Hari Ini
                            {/* Rotasi ChevronLeft untuk menunjuk ke kanan */}
                            <ChevronLeft className="w-5 h-5 ml-1 transform rotate-180" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- SERVICES COMPONENT (Dengan logika Modal) ---
const Services = () => { 
    // State untuk mengontrol modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    const services = [
        { icon: <Church className="w-12 h-12" />, title: 'Ibadah Minggu', desc: 'Ibadah minggu reguler dengan khotbah yang menguatkan iman dan persekutuan yang hangat.' },
        { icon: <Heart className="w-12 h-12" />, title: 'Persekutuan', desc: 'Berbagai kelompok persekutuan untuk semua usia: remaja, dewasa muda, dan lansia.' },
        { icon: <GraduationCap className="w-12 h-12" />, title: 'Sekolah Minggu', desc: 'Pendidikan iman untuk anak-anak dengan kurikulum yang menyenangkan.' },
        { icon: <Book className="w-12 h-12" />, title: 'Pemahaman Alkitab', desc: 'Studi Alkitab mingguan untuk mendalami firman Tuhan secara berkelompok.' }
    ];

    // Fungsi untuk membuka modal dan menyimpan data layanan yang diklik
    const openModal = (service) => {
        setSelectedService(service);
        setIsModalOpen(true);
    };

    // Fungsi untuk menutup modal
    const closeModal = () => {
        setIsModalOpen(false);
        // Timeout singkat agar transisi penutupan terlihat mulus sebelum data dihapus
        // Ini adalah praktik yang baik untuk UX modal
        setTimeout(() => setSelectedService(null), 300);
    };

    return (
        <section id="layanan" className="py-12 sm:py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-800 dark:text-gray-100 mb-8 sm:mb-12">Layanan Gereja</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
                    {services.map((service, idx) => (
                        // Menambahkan onClick handler untuk menampilkan modal
                        <div 
                            key={idx} 
                            onClick={() => openModal(service)} // Panggil openModal saat diklik
                            className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center transform hover:scale-[1.02] cursor-pointer border-t-4 border-blue-500 hover:border-red-500"
                        >
                            <div className="text-blue-500 flex justify-center mb-4">{service.icon}</div>
                            <h3 className="text-xl sm:text-2xl font-bold mb-2 text-slate-800 dark:text-gray-100">
                                {service.title}
                            </h3>
                            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                                {service.desc}
                            </p>
                            <span className="text-sm text-red-500 mt-2 block font-semibold">
                                Klik untuk Detail
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Render Modal jika isModalOpen bernilai true */}
            {isModalOpen && (
                <ServiceModal 
                    service={selectedService} 
                    onClose={closeModal} 
                />
            )}
        </section>
    );
};


// =========================================================================================================================================
// Komponen Schedule (Jadwal)
// =========================================================================================================================================
const scheduleItems = [
    { day: "Ibadah Minggu", time: "07:00 WIB", event: "Induk Depok I", theme: "Hijau" },
    { day: "Ibadah Minggu", time: "09:30 WIB", event: "Induk Depok II", theme: "Kuning" },
    { day: "Sekolah Minggu", time: "09:00 WIB", event: "Sekolah Minggu Untuk Anak-anak", theme: "Biru" },
    { day: "Ibadah Minggu", time: "07:00 WIB", event: "Pepanthan Triharjo", theme: "Merah" },
    { day: "Ibadah Minggu", time: "08:00 WIB", event: "Pepanthan Wonogiri", theme: "Merah" },
    { day: "Ibadah Minggu", time: "08:00 WIB", event: "Pepanthan Galur", theme: "Merah" },
];

// ...existing code...
const Schedule = () => {
    // Gunakan Hook untuk mendapatkan data dinamis
    const { scheduleData: itemsToDisplay, isLoading, error } = useScheduleData();

    if (isLoading) {
        return (
             <section id="jadwal" className="py-12 sm:py-20 bg-white dark:bg-gray-800 transition-colors duration-500">
                <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-800 dark:text-gray-100 mb-8 sm:mb-12">Jadwal Kegiatan</h2>
                <p className="text-center text-blue-500 flex items-center justify-center">
                    {/* Asumsi Loader sudah diimpor */}
                    {/* <Loader className="w-5 h-5 animate-spin mr-2" /> */}
                    Memuat Jadwal...
                </p>
             </section>
        );
    }
    
    // Jika tidak ada data aktif dari database
    if (itemsToDisplay.length === 0) {
        return (
             <section id="jadwal" className="py-12 sm:py-20 bg-white dark:bg-gray-800 transition-colors duration-500">
                <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-800 dark:text-gray-100 mb-8 sm:mb-12">Jadwal Kegiatan</h2>
                <p className="text-center text-gray-500 dark:text-gray-400">Tidak ada jadwal yang aktif saat ini.</p>
             </section>
        );
    }

    return (
        <section id="jadwal" className="py-12 sm:py-20 bg-white dark:bg-gray-800 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-800 dark:text-gray-100 mb-8 sm:mb-12">
                    Jadwal Kegiatan
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {itemsToDisplay.map((item, index) => (
                        <div key={item.id || index} className="p-4 border-b-4 border-indigo-500 bg-white dark:bg-gray-700 rounded-lg shadow-md transition-shadow hover:shadow-lg flex justify-between items-center">
                            
                            {/* KIRI: Hari, Nama Kegiatan/Detail */}
                            <div className="flex items-start">
                                {/* Ikon Kalender dan Hari */}
                                <Calendar size={24} className="text-indigo-600 dark:text-indigo-400 mr-3 mt-1 flex-shrink-0" />
                                <div>
                                    {/* Hari (Judul Utama) */}
                                    <span className="font-bold text-lg text-gray-900 dark:text-white">{item.hari}</span>
                                    
                                    {/* 📌 PERBAIKAN: Tampilkan DETAIL (misalnya "Induk Depok I") di baris kedua, atau Nama Kegiatan */}
                                    <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
                                        {/* Jika item.detail ada, gunakan detail. Jika tidak, gunakan nama_kegiatan. */}
                                        {item.detail || item.nama_kegiatan}
                                    </p>
                                </div>
                            </div>
                            
                            {/* KANAN: Waktu */}
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded-full whitespace-nowrap">
                                {item.waktu}
                            </span>
                        </div>
                    ))}
                </div>
                <p className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
                    *Jadwal dapat berubah sewaktu-waktu. Harap cek Warta Jemaat.
                </p>
            </div>
        </section>
    );
};

const toYoutubeEmbed = (rawUrl) => {
  if (!rawUrl) return "";

  const urlStr = String(rawUrl).trim();

  try {
    const u = new URL(urlStr);

    // Ambil video id dari berbagai format:
    // - https://youtu.be/VIDEOID
    // - https://www.youtube.com/watch?v=VIDEOID
    // - https://www.youtube.com/embed/VIDEOID
    let id = "";

    if (u.hostname.includes("youtu.be")) {
      id = u.pathname.replace("/", "");
    } else if (u.searchParams.get("v")) {
      id = u.searchParams.get("v");
    } else if (u.pathname.includes("/embed/")) {
      id = u.pathname.split("/embed/")[1]?.split(/[/?#]/)[0] || "";
    }

    // Kalau gagal ekstrak id, pakai url as-is tapi tetap trim
    if (!id) return urlStr;

    // Embed yang lebih “bersih”
    return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;
  } catch {
    // Kalau rawUrl bukan URL valid, minimal trim
    return urlStr;
  }
};

// --- GALLERY COMPONENT (Dengan logika Modal) ---
const Gallery = () => {
    const { galeriData, isLoading, error } = useGalleryData();
    const { photos, videos } = galeriData;
    
    // 📌 STATE BARU untuk Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    
    const openModal = (photo) => {
        setSelectedPhoto(photo);
        setIsModalOpen(true);
        console.log("Modal harus terbuka, Data:", photo);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedPhoto(null), 300); // Tunggu transisi
    };

  if (isLoading) {
       return (
            <section id="galeri" className="py-20 bg-gray-50 dark:bg-gray-800">
                <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-slate-800 dark:text-gray-100">Galeri Kegiatan</h2>
                <p className="text-center text-blue-500 flex items-center justify-center">
                    <Loader className="w-5 h-5 animate-spin mr-2" /> Memuat Galeri...
                </p>
            </section>
       );
  }

  return (
        <section id="galeri" className="py-20 bg-gray-50 dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4">
                {/* ... (Header) ... */}
                <SectionHeader 
                    id="galeri-header-component"
                    title="Galeri Kegiatan" 
                    subtitle="Dokumentasi kegiatan dan pelayanan Gereja Kristen Jawa Wates Selatan." 
                    icon={Camera} // Asumsi ikon Camera atau Images diimpor
                />
                
                {/* FOTO */}
                {photos.length > 0 && (
                  <>
                    <h3 className="text-xl font-semibold mb-6 text-slate-700 dark:text-gray-200">Foto</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                      {photos.map((p) => (
                        <div 
                        key={p.id} 
                        className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:scale-105 transition-transform cursor-pointer"
                        >
                        <img 
                            src={p.src} 
                            alt={p.caption} 
                            className="w-full h-56 object-cover" 
                            // 📌 PINDAHKAN onClick KE SINI
                            onClick={() => openModal(p)} 
                        />
                        {/* <p className="p-3 text-center text-gray-700 dark:text-gray-300">{p.caption}</p> */}
                        </div>
                    ))}
                    </div>
                  </>
                )}

        {/* VIDEO */}
        
        {videos.length > 0 && (
        <>
            <h3 className="text-xl font-semibold mb-6 text-slate-700 dark:text-gray-200">Video</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {videos.map((v) => {
            const embed = toYoutubeEmbed(v.src);
            console.log("VIDEO RAW:", v.src);
            console.log("VIDEO EMBED:", embed);

            return (
                <div key={v.id} className="aspect-video rounded-xl overflow-hidden shadow-lg">
                <iframe
                    src={embed}
                    title={v.caption || `video-${v.id}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                    loading="lazy"
                />
                </div>
            );
            })}
            </div>
        </>
        )}

        {(photos.length === 0 && videos.length === 0) && (
                     <p className="text-center text-gray-500 dark:text-gray-400">Belum ada konten galeri yang diunggah.</p>
                )}
            </div>
            
            {/* 📌 RENDER MODAL */}
            {isModalOpen && (
            <PhotoModal photo={selectedPhoto} onClose={closeModal} />
        )}
    </section>
    );
};


// --- CONTACT COMPONENT (Layout 2 Kolom: Info di Kiri, Maps di Kanan) ---
const Contact = () => (
  <section
    id="kontak"
    className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-500"
  >
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-800 dark:text-gray-100 mb-12">
        Hubungi Kami
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* === KIRI: Info Kontak === */}
        <div className="flex flex-col space-y-6">
          {/* Telepon */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border-l-4 border-blue-500 flex items-center space-x-5 hover:shadow-xl transition-transform hover:scale-[1.02]">
            <Phone className="w-10 h-10 text-blue-500 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-xl text-slate-800 dark:text-gray-100 mb-1">
                Telepon
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-base">
                (0274) 123456
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border-l-4 border-blue-500 flex items-center space-x-5 hover:shadow-xl transition-transform hover:scale-[1.02]">
            <Mail className="w-10 h-10 text-blue-500 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-xl text-slate-800 dark:text-gray-100 mb-1">
                Email
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-base">
                gkjwatsel@gmail.com
              </p>
            </div>
          </div>

          {/* Instagram */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border-l-4 border-blue-500 flex items-center space-x-5 hover:shadow-xl transition-transform hover:scale-[1.02]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.6"
              stroke="currentColor"
              className="w-10 h-10 text-blue-500 flex-shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.75 2.25h8.5A5.25 5.25 0 0 1 21.5 7.5v8.5a5.25 5.25 0 0 1-5.25 5.25h-8.5A5.25 5.25 0 0 1 2.5 16V7.5a5.25 5.25 0 0 1 5.25-5.25Zm4.25 6.75a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm5.5-.5h.008v.008H17.5V8.5Z"
              />
            </svg>
            <div>
              <h4 className="font-bold text-xl text-slate-800 dark:text-gray-100 mb-1">
                Instagram
              </h4>
              <a
                href="https://www.instagram.com/gkj.watesselatan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                @gkj.watesselatan
              </a>
            </div>
          </div>
        </div>

        {/* === KANAN: Google Maps === */}
        <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-blue-500 h-[500px]">
          <iframe
            src={GOOGLE_MAPS_EMBED_URL}
            width="100%"
            height="100%"
            allowFullScreen=""
            loading="lazy"
            className="w-full h-full border-0"
            title="Lokasi GKJ Wates Selatan"
          ></iframe>
        </div>
      </div>
    </div>
  </section>
);


import Navbar from './Navbar';

// =========================================================================================================================================
// --- APP COMPONENT ---
// =========================================================================================================================================

const App = () => {
    const [activeSection, setActiveSection] = useState('beranda');
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const { config, isLoading: isConfigLoading } = useGlobalConfig();

    // Logic untuk mendeteksi section yang sedang aktif saat scroll
    useEffect(() => {
        const sectionIds = ['beranda', 'warta-jemaat', 'renungan', 'layanan', 'jadwal', 'galeri', 'kontak'];
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, {
            root: null, 
            rootMargin: '-16px 0px -70% 0px', 
            threshold: 0.1 
        });

        sectionIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element);
            }
        });

        // Clean up observer
        return () => observer.disconnect();
    }, []);

    // Sinkronisasi kelas 'dark' ke elemen <html>
    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [isDarkMode]);


    return (
        <div className="min-h-screen font-inter antialiased">
            <Navbar 
                activeSection={activeSection} 
                setActiveSection={setActiveSection} 
                isDarkMode={isDarkMode} 
                toggleDarkMode={toggleDarkMode} 
                logoGkjUrl={config?.LOGO_GKJ_URL}
            />
            <main className="pt-0">
                <Hero 
                    isDarkMode={isDarkMode} 
                    churchPhotoUrl={config?.CHURCH_PHOTO_URL}
                    isConfigLoading={isConfigLoading}
                />
                <WartaJemaat />
                <Devotion /> 
                <Services />
                <Schedule />
                <Gallery />
                <Contact />
            </main>
            <FloatingAdminButton />
            <footer className="bg-slate-800 dark:bg-gray-900 text-white dark:text-gray-300 p-6 text-center text-sm shadow-inner transition-colors duration-500">
                &copy; {new Date().getFullYear()} GKJ Wates Selatan. Dibangun dengan Kasih.
            </footer>
        </div>
    );
};

export default App;
