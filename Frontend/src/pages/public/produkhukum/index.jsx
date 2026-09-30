import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProdukHukum } from "../../../_sevices/produkhukum";

export default function PublikProdukHukum() {
  const [produk_hukums, setProdukHukums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  const sortByNewest = (arr) =>
    [...arr].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  useEffect(() => {
    getProdukHukum()
      .then((data) => {
        // Handle berbagai bentuk response
        if (Array.isArray(data)) {
          setProdukHukums(sortByNewest(data));
        } else if (data && Array.isArray(data.data)) {
          setProdukHukums(sortByNewest(data.data));
        } else {
          setProdukHukums([]);
        }
        setError(null);
      })
      .catch((err) => {
        const status = err?.response?.status;
        const message = err?.response?.data?.message || err?.message || "Gagal memuat data";

        if (status === 401 || status === 403) {
          setError("Akses ditolak. Endpoint memerlukan autentikasi.");
        } else if (err?.message?.includes("Network Error") || err?.code === "ERR_NETWORK") {
          setError("Tidak dapat terhubung ke server. Pastikan backend berjalan.");
        } else if (err?.message?.includes("CORS")) {
          setError("CORS error. Konfigurasi backend perlu diperbaiki.");
        } else {
          setError(message);
        }

        setProdukHukums([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getFileExtension = (filename) => {
    if (!filename) return "FILE";
    return filename.split(".").pop().toUpperCase();
  };

  const filteredProduk = produk_hukums.filter(
    (p) =>
      p.judul?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease both; }

        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
        .skeleton {
          background: linear-gradient(90deg,#e2e8f0 25%,#f8fafc 50%,#e2e8f0 75%);
          background-size: 600px 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 12px;
        }
      `}</style>

      <div className="min-h-screen bg-gray-50">

        {/* Hero Banner */}
        <div className="relative bg-blue-900 overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-white font-semibold text-center text-3xl sm:text-4xl lg:text-5xl leading-tight mb-3">
                  Produk Hukum
                </h1>
                <p className="text-blue-200 text-sm text-center sm:text-lg">
                  Kumpulan dokumen produk hukum resmi Dewan Perwakilan Mahasiswa
                  Universitas Nurul Jadid.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari judul dokumen undang-undang..............."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Error State */}
          {error && !loading && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              <div>
                <p className="text-sm font-medium text-red-700">Gagal memuat data</p>
                <p className="text-xs text-red-500 mt-0.5">{error}</p>
                <p className="text-xs text-red-400 mt-2">
                  Pastikan: (1) Backend Laravel berjalan di <code className="bg-red-100 px-1 rounded">http://127.0.0.1:8000</code>, 
                  (2) CORS di Laravel sudah mengizinkan origin frontend, 
                  (3) Route <code className="bg-red-100 px-1 rounded">/api/produkhukums</code> tidak memerlukan auth.
                </p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-40" />
              ))}
            </div>
          ) : filteredProduk.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredProduk.map((produk, idx) => (
                <Link
                  key={produk.id}
                  to={`/produkhukum/${produk.id}`}
                  className="fade-up group bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 flex gap-4 items-start
                        hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className="flex-shrink-0 w-14 h-14 bg-blue-50 group-hover:bg-blue-100 rounded-xl
                                  flex flex-col items-center justify-center transition-colors duration-300">
                    <svg className="w-6 h-6 text-blue-800" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                        clipRule="evenodd"/>
                    </svg>
                    {produk.file && (
                      <span className="text-[9px] font-bold text-blue-700 mt-0.5 leading-none">
                        {getFileExtension(produk.file)}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg leading-snug
                                   group-hover:text-blue-900 transition-colors duration-200 line-clamp-2 mb-1.5">
                      {produk.judul}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                      {truncateText(produk.abstract, 120)}
                    </p>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"/>
                        </svg>
                        {new Date(produk.created_at).toLocaleDateString("id-ID", {
                          day: "numeric", month: "long", year: "numeric"
                        })}
                      </span>
                      <span className="text-xs font-medium text-blue-800 group-hover:underline flex items-center gap-1">
                        Lihat Selengkapnya
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {searchQuery ? "Dokumen tidak ditemukan" : "Belum ada produk hukum"}
              </h3>
              <p className="text-sm text-gray-400">
                {searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : "Dokumen akan segera ditambahkan."}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
