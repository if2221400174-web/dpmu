import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// TODO: sesuaikan path service-nya
import { getProdukHukum } from "../_sevices/produkhukum";
import { getKeputusan } from "../_sevices/keputusan";

export default function Testimonial() {
  const navigate = useNavigate();

  const [latestProduk, setLatestProduk]       = useState(null);
  const [latestKeputusan, setLatestKeputusan] = useState(null);
  const [loadingCards, setLoadingCards]       = useState(true);

  useEffect(() => {
    Promise.all([getProdukHukum(), getKeputusan()])
      .then(([dataProduk, dataKeputusan]) => {
        const arrProduk    = Array.isArray(dataProduk)    ? dataProduk    : dataProduk?.data    ?? [];
        const arrKeputusan = Array.isArray(dataKeputusan) ? dataKeputusan : dataKeputusan?.data ?? [];
        const sortDesc     = (arr) => [...arr].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setLatestProduk(sortDesc(arrProduk)[0] ?? null);
        setLatestKeputusan(sortDesc(arrKeputusan)[0] ?? null);
      })
      .catch(() => {})
      .finally(() => setLoadingCards(false));
  }, []);

  return (
    <>
      {/* Main Welcome Section */}
      <section className="bg-white dark:bg-gray-900 py-5 lg:py-5">
        <div className="max-w-screen-xl px-4 py-4 sm:px-6 lg:px-8 mx-auto">

          {/* Header Welcome Box */}
          <div className="bg-blue-900 dark:to-blue-950 rounded-lg p-8 lg:p-12 mb-5 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Text Content */}
              <div className="text-white">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  Halo Mahasiswa Universitas Nurul Jadid!
                </h2>
                <p className="text-base lg:text-lg mb-6 leading-relaxed opacity-90">
                  Punya aspirasi, kritik, atau keluhan terkait kehidupan kampus?
                </p>
                <p className="text-base lg:text-lg mb-8 leading-relaxed opacity-90">
                  DPM Universitas Nurul Jadid menyediakan link pengaduan mahasiswa sebagai wadah penyampaian suara anda.
                </p>
                <p className="text-base lg:text-lg mb-8 leading-relaxed opacity-90">
                  Mari bersama wujudkan kampus yang lebih baik.
                </p>
              </div>

              {/* Illustration */}
              <div className="flex justify-center">
                <div className="w-64 h-64 lg:w-72 lg:h-72 bg-blue-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-lg">
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 11l16-9v18L3 13v-2z"/>
                      <path d="M11.6 16.8a3 3 0 11-5.8-1.6"/>
                    </svg>
                    <button
                      className="bg-blue-800 dark:bg-blue-800 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
                      onClick={() => navigate("/pengaduan")}
                    >
                      Pelayanan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── 2 Card: Produk Hukum & Keputusan Terbaru ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

            {/* Card Produk Hukum */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md overflow-hidden flex flex-col">
              <div className="bg-blue-900 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                  </svg>
                  <h3 className="text-white font-semibold text-sm tracking-wide">Produk Hukum Terbaru</h3>
                </div>
                <span className="bg-blue-700 text-blue-100 text-xs px-2 py-0.5 rounded-full font-medium">Baru</span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                {loadingCards ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"/>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full"/>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3"/>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mt-2"/>
                  </div>
                ) : latestProduk ? (
                  <>
                    <div>
                      <span className="inline-block text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full mb-3">
                        Produk Hukum
                      </span>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white leading-snug mb-2 line-clamp-2">
                        {latestProduk.judul ?? latestProduk.nama ?? "—"}
                      </h4>
                      <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                        </svg>
                        {latestProduk.created_at
                          ? new Date(latestProduk.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
                          : ""}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <Link to={`/produkhukum/${latestProduk.id}`} className="text-sm font-medium text-blue-800 dark:text-blue-400 hover:underline">
                        Lihat detail →
                      </Link>
                      <Link to="/produkhukum" className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 transition-colors">
                        Produk Hukum Lainnya
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                        </svg>
                      </Link>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">Belum ada produk hukum.</p>
                )}
              </div>
            </div>

            {/* Card Keputusan */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md overflow-hidden flex flex-col">
              <div className="bg-blue-800 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                  </svg>
                  <h3 className="text-white font-semibold text-sm tracking-wide">Keputusan Terbaru</h3>
                </div>
                <span className="bg-blue-600 text-blue-100 text-xs px-2 py-0.5 rounded-full font-medium">Baru</span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                {loadingCards ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"/>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full"/>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3"/>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mt-2"/>
                  </div>
                ) : latestKeputusan ? (
                  <>
                    <div>
                      <span className="inline-block text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full mb-3">
                        Keputusan
                      </span>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white leading-snug mb-2 line-clamp-2">
                        {latestKeputusan.judul ?? latestKeputusan.nama ?? "—"}
                      </h4>
                      <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                        </svg>
                        {latestKeputusan.created_at
                          ? new Date(latestKeputusan.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
                          : ""}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <Link to={`/keputusan/${latestKeputusan.id}`} className="text-sm font-medium text-blue-800 dark:text-blue-400 hover:underline">
                        Lihat detail →
                      </Link>
                      <Link to="/keputusan" className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 transition-colors">
                        Keputusan Lainnya
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                        </svg>
                      </Link>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">Belum ada keputusan.</p>
                )}
              </div>
            </div>

          </div>
          {/* ── End 2 Card ── */}

          {/* Three Columns Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Trilogi Santri */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl lg:text-2xl font-bold text-blue-800 dark:text-white mb-6 pb-4 border-b-2 border-blue-600">
                Trilogi Santri
              </h3>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <div>
                  <p className="font-semibold text-blue-700 dark:text-blue-400 mb-2">اَلاِِْهْتِمَامْ بِالْفُرُوْضِ اْلعَيْنِيَّةِ</p>
                  <p className="text-sm leading-relaxed">Memperhatikan kewajiban-kewajiban fardhu 'Ain.</p>
                </div>
                <div>
                  <p className="font-semibold text-blue-700 dark:text-blue-400 mb-2">اَلاِِْهْتِمَامْ بِتَرْكِ اْلكَبَائِرِ</p>
                  <p className="text-sm leading-relaxed">Mawas diri dengan meninggalkan dosa-dosa besar.</p>
                </div>
                <div>
                  <p className="font-semibold text-blue-700 dark:text-blue-400 mb-2">حُسْنُ اْلاَدَبِ مَعَ اللهِ وَمَعَ الْخَلْقِ</p>
                  <p className="text-sm leading-relaxed">Berbudi luhur kepada Allah dan Makhluq.</p>
                </div>
              </div>
            </div>

            {/* Panca Kesadaran Santri */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl lg:text-2xl font-bold text-blue-800 dark:text-white mb-6 pb-4 border-b-2 border-blue-600">
                Panca Kesadaran
              </h3>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <div>
                  <p className="font-semibold text-blue-700 dark:text-blue-400 mb-2">اَلْوَعْيُ الدِّيْنِيْ</p>
                  <p className="text-sm leading-relaxed">Kesadaran Beragama.</p>
                </div>
                <div>
                  <p className="font-semibold text-blue-700 dark:text-blue-400 mb-2">اَلْوَعْيُ الْعِلْمِيْ</p>
                  <p className="text-sm leading-relaxed">Kesadaran Berilmu.</p>
                </div>
                <div>
                  <p className="font-semibold text-blue-700 dark:text-blue-400 mb-2">اَلْوَعْيُ اْلاِجْتِمَاعِيْ</p>
                  <p className="text-sm leading-relaxed">Kesadaran Bermasyarakat.</p>
                </div>
                <div>
                  <p className="font-semibold text-blue-700 dark:text-blue-400 mb-2">اَلْوَعْيُ الْحُكُوْمِيْ وَالشُّعِْبيْ</p>
                  <p className="text-sm leading-relaxed">Kesadaran Berbangsa dan Bernegara.</p>
                </div>
                <div>
                  <p className="font-semibold text-blue-700 dark:text-blue-400 mb-2">اَلْوَعْيُ النِّظَامِيْ</p>
                  <p className="text-sm leading-relaxed">Kesadaran Berorganisasi.</p>
                </div>
              </div>
            </div>

            {/* Kalam Masyaikh */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl lg:text-2xl font-bold text-blue-800 dark:text-white mb-6 pb-4 border-b-2 border-blue-600">
                Kalam Masyaikh
              </h3>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <div>
                  <p className="font-semibold text-blue-700 dark:text-blue-400 mb-2">KH. Zaini Mun'im:</p>
                  <p className="text-sm leading-relaxed">
                    "Orang yang hidup di Indonesia kemudian tidak melakukan perjuangan, dia telah berbuat maksiat. Orang yang hanya memikirkan masalah pendidikannya sendiri, maka orang itu telah berbuat maksiat. Kita semua harus memikirkan perjuangan rakyat banyak."
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out; }
      `}</style>
    </>
  );
}