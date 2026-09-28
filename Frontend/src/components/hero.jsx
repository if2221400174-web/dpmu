import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import bgdpm from "../assets/bg 1.jpeg";
import bgdpm2 from "../assets/bg 2.jpg";
import bgdpm3 from "../assets/bg 3.jpeg";
import { getBeritaDpm } from "../_sevices/beritadpm";
import { getKeputusan } from "../_sevices/keputusan";
import { beritaImageStorage } from "../_api";
import { getProdukHukum } from "../_sevices/produkhukum";

const BG_IMAGES = [bgdpm, bgdpm2, bgdpm3];

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [infoCards, setInfoCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Slideshow
  const [bgIndex, setBgIndex] = useState(0);
  const [sliding, setSliding] = useState(false);
  const [direction, setDirection] = useState("next"); // "next" | "prev"
  const [nextIndex, setNextIndex] = useState(null);
  const autoTimer = useRef(null);

  // Search
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [allData, setAllData] = useState({ informasi: [], produkHukum: [], keputusan: [] });

  // ── Data loading ──────────────────────────────────
  useEffect(() => {
    getBeritaDpm()
      .then((data) => {
        const sorted = [...data]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 4);
        setInfoCards(sorted);
        setAllData((prev) => ({ ...prev, informasi: data }));
      })
      .catch(() => setInfoCards([]))
      .finally(() => setLoading(false));

    getProdukHukum()
      .then((data) => setAllData((prev) => ({ ...prev, produkHukum: data })))
      .catch(() => {});

    getKeputusan()
      .then((data) => setAllData((prev) => ({ ...prev, keputusan: data })))
      .catch(() => {});
  }, []);

  // ── Slide logic ───────────────────────────────────
  const goTo = useCallback(
    (target, dir) => {
      if (sliding || target === bgIndex) return;
      setDirection(dir);
      setNextIndex(target);
      setSliding(true);
    },
    [sliding, bgIndex]
  );

  const goNext = useCallback(() => {
    goTo((bgIndex + 1) % BG_IMAGES.length, "next");
  }, [bgIndex, goTo]);

  const goPrev = useCallback(() => {
    goTo((bgIndex - 1 + BG_IMAGES.length) % BG_IMAGES.length, "prev");
  }, [bgIndex, goTo]);

  // After slide animation ends, commit the new index
  const handleSlideEnd = () => {
    if (nextIndex !== null) {
      setBgIndex(nextIndex);
      setNextIndex(null);
    }
    setSliding(false);
  };

  // Auto-play
  const resetTimer = useCallback(() => {
    clearInterval(autoTimer.current);
    autoTimer.current = setInterval(goNext, 4500);
  }, [goNext]);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(autoTimer.current);
  }, [resetTimer]);

  const handleDotClick = (i) => {
    const dir = i > bgIndex ? "next" : "prev";
    goTo(i, dir);
    resetTimer();
  };

  const handleArrow = (fn) => {
    fn();
    resetTimer();
  };

  // ── Search ────────────────────────────────────────
  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    setSearchLoading(true);
    setShowModal(true);

    const matchInformasi = allData.informasi.filter(
      (item) =>
        item.judul?.toLowerCase().includes(q) 
    );
    const matchProdukHukum = allData.produkHukum.filter(
      (item) =>
        item.judul?.toLowerCase().includes(q)
    );
    const matchKeputusan = allData.keputusan.filter(
      (item) =>
        item.judul?.toLowerCase().includes(q)
    );

    setSearchResults({ informasi: matchInformasi, produkHukum: matchProdukHukum, keputusan: matchKeputusan });
    setSearchLoading(false);
  };

  const totalResults = searchResults
    ? searchResults.informasi.length + searchResults.produkHukum.length + searchResults.keputusan.length
    : 0;

  // ── CSS offset helpers ────────────────────────────
  // current slide: slides out; next slide: comes in

  return (
    <>
      <style>{`
        /* ── Slide keyframes ── */
        @keyframes slideInFromRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0%);   }
        }
        @keyframes slideInFromLeft {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0%);    }
        }
        @keyframes slideOutToLeft {
          from { transform: translateX(0%);   }
          to   { transform: translateX(-100%); }
        }
        @keyframes slideOutToRight {
          from { transform: translateX(0%);   }
          to   { transform: translateX(100%); }
        }

        .slide-current-next { animation: slideOutToLeft  2s cubic-bezier(.77,0,.18,1) forwards; }
        .slide-current-prev { animation: slideOutToRight 2s cubic-bezier(.77,0,.18,1) forwards; }
        .slide-next-next    { animation: slideInFromRight 2s cubic-bezier(.77,0,.18,1) forwards; }
        .slide-next-prev    { animation: slideInFromLeft  2s cubic-bezier(.77,0,.18,1) forwards; }

        /* ── Marquee ── */
        @keyframes marquee {
          from { transform: translateX(100%); }
          to   { transform: translateX(-100%); }
        }
        .marquee-outer { overflow: hidden; width: 100%; }
        .marquee-track {
          display: flex; width: max-content;
          animation: marquee 28s linear infinite;
          white-space: nowrap; will-change: transform;
        }
        .marquee-track:hover { animation-play-state: paused; }
        .marquee-item { padding: 0 3rem; font-size: clamp(0.8rem, 1.8vw, 1rem); }

        /* ── Fade-up ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up   { animation: fadeUp 0.7s ease both; }
        .fade-up-2 { animation: fadeUp 0.7s 0.15s ease both; }

        /* ── Skeleton ── */
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }
        .skeleton {
          background: linear-gradient(90deg,#e2e8f0 25%,#f8fafc 50%,#e2e8f0 75%);
          background-size: 400px 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 1rem;
        }

        /* ── Arrow buttons ── */
        .slide-arrow {
          position: absolute; top: 42%; transform: translateY(-50%);
          z-index: 10;
          width: 35px; height: 35px;
          color: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 1s, transform 0.2s;
        }
        .slide-arrow:hover {
          transform: translateY(-50%) scale(1);
        }
        .slide-arrow-left  { left:  10px; }
        .slide-arrow-right { right: 10px; }

        /* ── Dots ── */
        .dot-indicator {
          width: 8px; height: 8px; border-radius: 50%;
          background: rgba(255,255,255,0.45);
          cursor: pointer; transition: background 0.3s, width 0.3s;
          border: none; padding: 0;
        }
        .dot-indicator.active {
          background: #fff;
          width: 22px;
          border-radius: 4px;
        }

        /* ── Search modal ── */
        .search-modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.55);
          z-index: 200;
          display: flex; align-items: flex-start; justify-content: center;
          padding: 80px 16px 24px;
          overflow-y: auto;
        }
        .search-modal {
          background: #fff;
          border-radius: 1.25rem;
          width: 100%; max-width: 680px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.18);
          overflow: hidden;
        }
        .search-modal-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #e5e7eb;
          display: flex; align-items: center; justify-content: space-between;
        }
        .result-section-title {
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: #6b7280;
          padding: 0.75rem 1.5rem 0.5rem;
        }
        .result-item {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 0.75rem 1.5rem;
          border-bottom: 1px solid #f3f4f6;
          text-decoration: none; color: inherit;
          transition: background 0.15s;
        }
        .result-item:hover { background: #f0f4ff; }
        .result-icon {
          width: 36px; height: 36px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 2px;
        }
      `}</style>

      <div className="w-full">

        {/* ── Hero dengan Slide Transition ──────────────── */}
        <div
          className="relative flex flex-col items-center justify-center overflow-hidden"
          style={{ minHeight: "clamp(340px, 55vh, 600px)" }}
        >
          {/* ── Slides ── */}
          {/* Current slide */}
          <img
            key={`current-${bgIndex}`}
            src={BG_IMAGES[bgIndex]}
            alt={`Background ${bgIndex + 1}`}
            className={`absolute inset-0 w-full h-full object-cover ${
              sliding
                ? direction === "next"
                  ? "slide-current-next"
                  : "slide-current-prev"
                : ""
            }`}
            style={{ zIndex: 1 }}
          />

          {/* Incoming slide */}
          {sliding && nextIndex !== null && (
            <img
              key={`next-${nextIndex}`}
              src={BG_IMAGES[nextIndex]}
              alt={`Background ${nextIndex + 1}`}
              className={direction === "next" ? "slide-next-next" : "slide-next-prev"}
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "cover",
                zIndex: 2,
              }}
              onAnimationEnd={handleSlideEnd}
            />
          )}

          {/* Gradient overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/40 to-transparent"
            style={{ zIndex: 5 }}
          />

          {/* ── Arrow Left ── */}
          <button
            className="slide-arrow slide-arrow-left"
            onClick={() => handleArrow(goPrev)}
            aria-label="Foto sebelumnya"
            style={{ zIndex: 20 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* ── Arrow Right ── */}
          <button
            className="slide-arrow slide-arrow-right"
            onClick={() => handleArrow(goNext)}
            aria-label="Foto berikutnya"
            style={{ zIndex: 20 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* ── Content ── */}
          <div
            className="relative w-full max-w-4xl mx-auto px-4 sm:px-8 text-center py-14 sm:py-20 pb-16"
            style={{ zIndex: 5 }}
          >
            <h1
              className="fade-up text-white font-serif leading-tight tracking-wide drop-shadow-2xl mb-3"
              style={{ fontSize: "clamp(1.1rem, 3.5vw, 2.6rem)" }}
            >
              DEWAN PERWAKILAN MAHASISWA<br />
              UNIVERSITAS NURUL JADID
            </h1>

            <form onSubmit={handleSearch} className="fade-up-2 max-w-xl mx-auto w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Temukan informasi, produk hukum, keputusan..."
                  className="w-full px-5 py-3 sm:py-4 pr-14 rounded-full text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/60 shadow-2xl bg-white/70 text-sm sm:text-base"
                />
                <button
                  type="submit"
                  className="absolute right-8 top-10 transform -translate-y-1/2 text-gray-500 hover:text-blue-900"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Dot indicators */}
            <div className="flex items-center justify-center gap-2 mt-5">
              {BG_IMAGES.map((_, i) => (
                <button
                  key={i}
                  className={`dot-indicator ${bgIndex === i ? "active" : ""}`}
                  onClick={() => handleDotClick(i)}
                  aria-label={`Foto ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Running text */}
          <div className="absolute bottom-0 left-0 right-0 bg-blue-900/95 py-2" style={{ zIndex: 5 }}>
            <div className="marquee-outer">
              <div className="marquee-track">
                {[0, 1].map((i) => (
                  <span key={i} className="marquee-item text-white font-medium select-none">
                    Selamat datang di website Dewan Perwakilan Mahasiswa Universitas Nurul Jadid,
                    dapatkan informasi lainnya seputar aktivitas kami!
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Informasi Terbaru ──────────────────────────── */}
        <div className="bg-white py-5 sm:py-7">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center mb-5 text-blue-900">
              Informasi Terbaru
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-5">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="skeleton" style={{ paddingBottom: "133%" }} />
                ))
              ) : infoCards.length > 0 ? (
                infoCards.map((card) => (
                  <Link
                    key={card.id}
                    to={`/informasi/${card.id}`}
                    className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative overflow-hidden bg-gray-200" style={{ paddingBottom: "133%" }}>
                      <img
                        src={`${beritaImageStorage}/${card.foto_berita}`}
                        alt={card.judul}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = `https://placehold.co/300x400/1e3a8a/FFFFFF?text=${encodeURIComponent(card.judul)}`;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-900/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                        <h3
                          className="text-white font-bold leading-snug line-clamp-3"
                          style={{ fontSize: "clamp(0.75rem, 1.6vw, 1rem)" }}
                        >
                          {card.judul}
                        </h3>
                      </div>
                    </div>
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400 rounded-2xl transition-colors duration-300 pointer-events-none" />
                  </Link>
                ))
              ) : (
                <p className="col-span-4 text-center text-gray-400 py-16">
                  Belum ada informasi tersedia.
                </p>
              )}
            </div>

            <div className="text-center">
              <Link
                to="/informasi"
                className="inline-block px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-xs sm:text-base"
              >
                Dapatkan informasi lainnya
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search Result Modal ──────────────────────── */}
      {showModal && (
        <div className="search-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="search-modal" onClick={(e) => e.stopPropagation()}>

            <div className="search-modal-header">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Hasil pencarian: "<span className="text-blue-800">{searchQuery}</span>"
                </p>
                {!searchLoading && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {totalResults > 0 ? `${totalResults} hasil ditemukan` : "Tidak ada hasil"}
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div style={{ maxHeight: "65vh", overflowY: "auto" }}>
              {searchLoading ? (
                <div className="flex items-center justify-center py-16">
                  <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                </div>
              ) : totalResults === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                  <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-gray-500 font-medium">Tidak ada hasil untuk "{searchQuery}"</p>
                  <p className="text-gray-400 text-sm mt-1">Coba kata kunci lain</p>
                </div>
              ) : (
                <>
                  {searchResults.informasi.length > 0 && (
                    <>
                      <p className="result-section-title">Informasi ({searchResults.informasi.length})</p>
                      {searchResults.informasi.map((item) => (
                        <Link key={item.id} to={`/informasi/${item.id}`} className="result-item" onClick={() => setShowModal(false)}>
                          <div className="result-icon" style={{ background: "#dbeafe" }}>
                            <svg className="w-5 h-5" style={{ color: "#1e40af" }} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{item.judul}</p>
                            {item.created_at && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                {new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                              </p>
                            )}
                          </div>
                          <svg className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      ))}
                    </>
                  )}

                  {searchResults.produkHukum.length > 0 && (
                    <>
                      <p className="result-section-title">Produk Hukum ({searchResults.produkHukum.length})</p>
                      {searchResults.produkHukum.map((item) => (
                        <Link key={item.id} to={`/produkhukum/${item.id}`} className="result-item" onClick={() => setShowModal(false)}>
                          <div className="result-icon" style={{ background: "#dcfce7" }}>
                            <svg className="w-5 h-5" style={{ color: "#166534" }} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 2a1 1 0 000 2h2a1 1 0 000-2h-2zM4 6a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{item.judul || item.tentang}</p>
                            {item.nomor && <p className="text-xs text-gray-400 mt-0.5">No. {item.nomor}</p>}
                          </div>
                          <svg className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      ))}
                    </>
                  )}

                  {searchResults.keputusan.length > 0 && (
                    <>
                      <p className="result-section-title">Keputusan ({searchResults.keputusan.length})</p>
                      {searchResults.keputusan.map((item) => (
                        <Link key={item.id} to={`/keputusan/${item.id}`} className="result-item" onClick={() => setShowModal(false)}>
                          <div className="result-icon" style={{ background: "#fef3c7" }}>
                            <svg className="w-5 h-5" style={{ color: "#92400e" }} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{item.judul || item.tentang}</p>
                            {item.nomor && <p className="text-xs text-gray-400 mt-0.5">No. {item.nomor}</p>}
                          </div>
                          <svg className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}