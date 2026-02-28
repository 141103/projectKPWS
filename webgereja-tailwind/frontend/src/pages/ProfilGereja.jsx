import { useNavigate } from "react-router-dom";
import Navbar from "../component/NavbarProfile";
import gerejaDepok from "../assets/gereja-depok-lama.png";

export default function ProfilGereja() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Navbar activeSection="profile" />

      <div className="container mx-auto max-w-6xl p-6 pt-20 pb-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 rounded-md border border-gray-300 px-4 py-2 text-sm
                     hover:bg-gray-100
                     dark:border-gray-700 dark:hover:bg-gray-800"
        >
          ← Kembali
        </button>

        <h1 className="mb-8 text-3xl font-bold">
          Sejarah GKJ Wates Selatan
        </h1>

       {/* Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          
          {/* Teks */}
          <div className="md:col-span-2 space-y-5 text-justify leading-relaxed text-gray-700 dark:text-gray-200">
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

          {/* Gambar */}
          <div className="space-y-4">
            <img
            src={gerejaDepok}
            alt="Gereja Depok Lama"
            className="w-full rounded-md border border-gray-300 dark:border-gray-700"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gedung Gereja Depok (±1935) – gereja induk GKJ Wates Selatan
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
