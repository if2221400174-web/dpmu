import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBeritaDpm } from "../../../_sevices/beritadpm";
import { beritaImageStorage } from "../../../_api";

const stripHtml = (html) => {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim();
};

const truncate = (text, max) => {
  const clean = stripHtml(text);
  return clean.length <= max ? clean : clean.substring(0, max) + "...";
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
};

export default function PublikBeritaDpm() {
  const [berita_dpms, setBeritaDpm] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  const sortByNewest = (arr) =>
    [...arr].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  useEffect(() => {
    getBeritaDpm()
      .then((data) => {
        if (Array.isArray(data)) setBeritaDpm(sortByNewest(data));
        else if (data && Array.isArray(data.data)) setBeritaDpm(sortByNewest(data.data));
        else setBeritaDpm([]);
        setError(null);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || err?.message || "Gagal memuat data");
        setBeritaDpm([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = berita_dpms.filter((b) =>
    stripHtml(b.judul).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hero = filtered[0];
  const secondary = filtered.slice(1, 4);
  const rest = filtered.slice(4);

  const ImgBox = ({ src, alt, className }) => (
    <div className={`bg-gray-100 overflow-hidden ${className}`}>
      {src ? (
        <img
          src={`${beritaImageStorage}/${src}`}
          alt={alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.style.display = "none"; e.target.parentNode.classList.add("no-img"); }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
          <svg className="w-10 h-10 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
          </svg>
        </div>
      )}
    </div>
  );

  const SkeletonCard = ({ tall }) => (
    <div className={`animate-pulse bg-white rounded-xl overflow-hidden ${tall ? "h-80" : "h-48"}`}>
      <div className={`bg-gray-200 ${tall ? "h-52" : "h-28"}`}/>
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/3"/>
        <div className="h-4 bg-gray-200 rounded w-full"/>
        <div className="h-4 bg-gray-200 rounded w-2/3"/>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        .no-img { background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.45s ease both; }
      `}</style>

      <div className="min-h-screen bg-gray-50">

        {/* ── Hero Banner ── */}
        <div className="bg-blue-900 relative overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
            <h1 className="text-white font-semibold text-3xl sm:text-4xl lg:text-5xl mb-3">INFORMASI DPM U</h1>
            <p className="text-blue-200 text-sm sm:text-base mx-auto">
              Berita dan informasi terkini dari Dewan Perwakilan Mahasiswa Universitas Nurul Jadid.
            </p>
          </div>
        </div>

        {/* ── Search Bar ── */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
                <input
                  type="text" value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari berita..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Error */}
          {error && !loading && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2"><SkeletonCard tall /></div>
                <div className="space-y-4">
                  <SkeletonCard /><SkeletonCard /><SkeletonCard />
                </div>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {searchQuery ? "Berita tidak ditemukan" : "Belum ada berita"}
              </h3>
              <p className="text-sm text-gray-400">
                {searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : "Berita akan segera ditambahkan."}
              </p>
            </div>
          ) : (
            <div className="space-y-8">

              {/* ── Section 1: Hero + 3 berita kanan ── */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Hero berita utama */}
                {hero && (
                  <Link
                    to={`/informasi/${hero.id}`}
                    className="fade-up group lg:col-span-2 bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
                  >
                    <ImgBox src={hero.foto_berita} alt={stripHtml(hero.judul)} className="h-64 sm:h-80 w-full"/>
                    <div className="p-5">
                      <span className="inline-block text-xs font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full mb-3">
                        Informasi terbaru
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-blue-900 leading-snug mb-2 transition-colors duration-200">
                        {stripHtml(hero.judul)}
                      </h2>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                        {truncate(hero.isi_berita, 160)}
                      </p>
                      <span className="text-xs text-gray-400 flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                        </svg>
                        {formatDate(hero.created_at)}
                      </span>
                    </div>
                  </Link>
                )}

                {/* 3 berita kanan */}
                <div className="flex flex-col gap-4">
                  {secondary.map((b, i) => (
                    <Link
                      key={b.id}
                      to={`/informasi/${b.id}`}
                      className="fade-up group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 flex gap-0"
                      style={{ animationDelay: `${(i + 1) * 80}ms` }}
                    >
                      <ImgBox src={b.foto_berita} alt={stripHtml(b.judul)} className="w-28 h-full flex-shrink-0 min-h-[90px]"/>
                      <div className="p-3 flex flex-col justify-center">
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-900 line-clamp-2 leading-snug mb-1.5 transition-colors duration-200">
                          {stripHtml(b.judul)}
                        </h3>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                          </svg>
                          {formatDate(b.created_at)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* ── Section 2: Grid 4 kolom (berita lainnya) ── */}
              {rest.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1 h-6 bg-blue-900 rounded-full"/>
                    <h2 className="text-lg font-bold text-gray-900">Berita Lainnya</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {rest.map((b, i) => (
                      <Link
                        key={b.id}
                        to={`/informasi/${b.id}`}
                        className="fade-up group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        <ImgBox src={b.foto_berita} alt={stripHtml(b.judul)} className="h-40 w-full"/>
                        <div className="p-3">
                          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-900 line-clamp-2 leading-snug mb-2 transition-colors duration-200">
                            {stripHtml(b.judul)}
                          </h3>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                            </svg>
                            {formatDate(b.created_at)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </>
  );
}
