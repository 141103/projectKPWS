import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import gerejaDepok from "../assets/gereja-depok-lama.png";


export default function ProfilGereja({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const isDarkMode = theme === "dark";
  const toggleDarkMode = toggleTheme;

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 dark:bg-slate-950 dark:text-gray-100 transition-colors duration-500">
      <Navbar
          activeSection="profile"
          isDarkMode={theme === "dark"}
          toggleDarkMode={toggleTheme}
          logoGkjUrl="https://sinodegkj.or.id/wp-content/uploads/2023/01/arti-makna-lmbang-gereja-kristen-jawa-gkj.png"
      />
      <div className="container mx-auto max-w-7xl px-6 lg:px-10 pt-24 pb-12">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 rounded-md border border-gray-300 px-4 py-2 text-sm
                     hover:bg-gray-100
                     dark:border-gray-700 dark:hover:bg-gray-800"
        >
          ← Kembali
        </button>

        <h1
              className="
                  mb-10
                  text-4xl
                  font-extrabold
                  tracking-wide
                  text-slate-800
                  dark:text-white
                  border-l-4
                  border-blue-600
                  pl-5
              "
          >
          Sejarah GKJ Wates Selatan
        </h1>

       {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-14 items-start">

          {/* ================= KOLOM KIRI ================= */}
    <div
        className="
            lg:col-span-2
            bg-white
            dark:bg-slate-900
            rounded-2xl
            shadow-xl
            border
            border-slate-200
            dark:border-slate-700
            p-8
            space-y-10
            leading-8
            text-justify
            transition-colors
            duration-500
        "
    >
          
          {/* Teks */}
          {/* ===================== Section 1 ===================== */}
<div className="space-y-4">
    <h2 className="text-2xl font-bold text-blue-600 border-l-4 border-blue-600 pl-4">
        Awal Pelayanan (1897–1933)
    </h2>

    <p>
        Sejarah GKJ Wates Selatan berakar dari pelayanan Zending Gereformeerd
        pada akhir abad ke-19 dan awal abad ke-20 yang melaksanakan Pekabaran
        Injil melalui pendekatan pendidikan, kesehatan, dan penginjilan.
        Salah satu tonggak penting dalam pelayanan ini adalah berdirinya
        CBZ Petronella Hospitaal di Yogyakarta pada tahun 1897, yang kini
        dikenal sebagai Rumah Sakit Bethesda.
    </p>

    <p>
        Pelayanan kesehatan tersebut kemudian diperluas dengan berdirinya
        Hulphospitaal Wates pada tahun 1908. Kehadiran rumah sakit ini tidak
        hanya menjawab kebutuhan kesehatan masyarakat, tetapi juga menjadi
        sarana perjumpaan iman Kristen dengan masyarakat di wilayah Wates
        dan sekitarnya.
    </p>

    <p>
        Jemaat Kristen di wilayah Depok mulai bertumbuh sejak tahun 1930-an
        sebagai bagian dari Pepanthan Gereja Kristen Djawi Tengah Selatan
        (GKDTS) Wates. Pertumbuhan jumlah jemaat dan aktivitas peribadatan
        mendorong kebutuhan akan gedung gereja yang permanen.
    </p>
</div>

<hr className="border-slate-300 dark:border-slate-700" />

{/* ===================== Section 2 ===================== */}
<div className="space-y-4">
    <h2 className="text-2xl font-bold text-blue-600 border-l-4 border-blue-600 pl-4">
        Berdirinya Gereja (1933–1945)
    </h2>

    <p>
        Pada tahun 1933 hingga 1935 dibangun Gedung Gereja Depok di atas tanah
        persembahan dr. Soenoesmo. Sejak saat itu, Gereja Depok berfungsi
        sebagai gereja induk dan pusat pelayanan bagi jemaat-jemaat di
        wilayah selatan Kabupaten Kulon Progo.
    </p>

    <p>
        Masa pendudukan Jepang (1943–1945) menjadi periode yang sangat berat
        bagi kehidupan bergereja. Banyak tenaga pelayanan, pendeta, guru,
        dan tokoh gereja mengalami tekanan, bahkan interniran.
    </p>

    <p>
        Di tengah situasi tersebut, kehidupan iman jemaat tetap terpelihara
        melalui persekutuan sederhana dan kesetiaan dalam menjalani ibadah
        secara terbatas.
    </p>
</div>

<hr className="border-slate-300 dark:border-slate-700" />

{/* ===================== Section 3 ===================== */}
<div className="space-y-4">
    <h2 className="text-2xl font-bold text-blue-600 border-l-4 border-blue-600 pl-4">
        Menjadi GKJ Wates Selatan (1945–1995)
    </h2>

    <p>
        Pasca kemerdekaan Indonesia, kehidupan jemaat Kristen perlahan
        bangkit meskipun masih menghadapi berbagai keterbatasan.
    </p>

    <p>
        Dari proses tersebut, pelayanan di wilayah Wonogiri, Galur, dan
        Toyan semakin berkembang dan kemudian ditetapkan sebagai
        pepanthan-pepanthan yang aktif melayani jemaat.
    </p>

    <p>
        Memasuki dekade 1990-an, GKJ Wates Wilayah Selatan mulai menjalani
        proses pendewasaan sebagai gereja yang mandiri.
    </p>

    <p>
        Setelah melalui proses persiapan tersebut, pada tanggal
        <strong> 28 Juni 1995</strong> GKJ Wates Selatan resmi didewasakan.
        Peristiwa ini disertai dengan pentahbisan
        <strong> Pdt. R. Hestitama, S.Th.</strong> sebagai pendeta pertama
        GKJ Wates Selatan.
    </p>
</div>
</div>

 {/* ================= KOLOM KANAN ================= */}
          {/* Gambar */}
          <div className="space-y-5 sticky top-28">
            <img
            src={gerejaDepok}
            alt="Gereja Depok Lama"
            className="
                        w-full
                        rounded-2xl
                        shadow-xl
                        border
                        border-slate-300
                        dark:border-slate-700
                      "
            />
            <p
              className="
              text-center
              italic
              text-base
              text-slate-500
              dark:text-slate-400
              "
            >
              Gedung Gereja Depok (±1935) – gereja induk GKJ Wates Selatan
            </p>

            {/* Pendeta */}
            <div className="mt-10">

                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                    Pendeta
                </h3>

                <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
                    Daftar pendeta yang melayani jemaat.
                </p>

                <div className="border-t border-slate-300 dark:border-slate-700 mb-5"></div>

                {/* Card 1 */}
                <div className="flex items-center gap-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-md p-4 mb-4">

                    <img
                        src="/images/pendeta1.jpg"
                        alt="Pendeta"
                        className="w-16 h-16 rounded-full object-cover"
                    />

                    <div>
                        <h4 className="font-bold text-slate-800 dark:text-white">
                            Vik. Yehezkiel Dwi Cahya Yoga Respati, S.Fil
                        </h4>

                        <p className="text-slate-500 dark:text-slate-400">
                            Vikaris
                        </p>
                    </div>

                </div>

                {/* Card 2 */}
                <div className="flex items-center gap-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-md p-4">

                    <img
                        src="/images/pendeta2.jpg"
                        alt="Pendeta"
                        className="w-16 h-16 rounded-full object-cover"
                    />

                    <div>
                        <h4 className="font-bold text-slate-800 dark:text-white">
                            Pdt. Hestitama, S.Th
                        </h4>

                        <p className="text-slate-500 dark:text-slate-400">
                            Pendeta Aktif
                        </p>
                    </div>

                </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
