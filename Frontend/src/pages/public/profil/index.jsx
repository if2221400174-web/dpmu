import { useEffect, useState } from "react";
import { getTentangDpm } from "../../../_sevices/tentangdpm";
import { getStrukturDpm } from "../../../_sevices/strukturdpms";
import { strukturImageStorage } from "../../../_api";
import logodpm from '../../../assets/logo-DPM-Unuja.png';

const getInitials = (name) => {
  if (!name) return "??";
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().substring(0, 2);
};

/**
 * Mengurai teks menjadi array item list jika mengandung pola list.
 * Mendukung: newline, "- item", "• item", "* item", "1. item", "1) item"
 * Mengembalikan array string jika terdeteksi list, atau null jika bukan list.
 */
const parseListItems = (text) => {
  if (!text) return null;

  const trimmed = text.trim();

  // Cek apakah ada pola list eksplisit (-, •, *, angka., angka))
  const listLinePattern = /^(\s*[-•*]|\s*\d+[.)]\s)/m;
  const hasExplicitList = listLinePattern.test(trimmed);

  // Cek apakah ada multiple baris (newline)
  const lines = trimmed.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const hasMultipleLines = lines.length > 1;

  if (!hasExplicitList && !hasMultipleLines) return null;

  // Parse setiap baris, bersihkan penanda list di awal
  const items = lines.map((line) =>
    line.replace(/^\s*[-•*]\s*/, "").replace(/^\s*\d+[.)]\s*/, "").trim()
  ).filter(Boolean);

  return items.length > 1 ? items : null;
};

/**
 * Komponen untuk merender nilai teks — list vertikal jika terdeteksi,
 * atau paragraf biasa jika tidak.
 */
const CardValue = ({ value }) => {
  const items = parseListItems(value);

  if (items) {
    return (
      <ol className="mt-1 space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm leading-relaxed">
            <span
              className="text-xs font-medium mt-0.5 text-gray-700"
            >
              {idx + 1}.
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <p className="text-gray-700 text-sm leading-relaxed mt-1">
      {value || "-"}
    </p>
  );
};

export default function PublikProfil() {
  const [tentang, setTentang] = useState(null);
  const [strukturs, setStruktur] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTentangDpm(), getStrukturDpm()])
      .then(([tentangData, strukturData]) => {
        if (Array.isArray(tentangData)) setTentang(tentangData[0] ?? null);
        else if (tentangData?.data) setTentang(Array.isArray(tentangData.data) ? tentangData.data[0] : tentangData.data);
        else setTentang(tentangData);

        if (Array.isArray(strukturData)) setStruktur(strukturData);
        else if (strukturData?.data) setStruktur(Array.isArray(strukturData.data) ? strukturData.data : []);
        else setStruktur([]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const infoCards = tentang ? [
    {
      label: "Tujuan",
      value: tentang.tujuan,
      icon: (
        <img src={logodpm} alt="Logo DPM Unuja" className="w-8 h-8 object-contain" />
      ),
      accent: "#1e0693",
      bg: "#1e0693",
      border: "#ddd6fe",
    },
    {
      label: "Fungsi",
      value: tentang.fungsi,
      icon: (
        <img src={logodpm} alt="Logo DPM Unuja" className="w-8 h-8 object-contain" />
      ),
      accent: "#1e0693",
      bg: "#1e0693",
      border: "#ddd6fe",
    },
    {
      label: "Visi",
      value: tentang.visi,
      icon: (
        <img src={logodpm} alt="Logo DPM Unuja" className="w-8 h-8 object-contain" />
      ),
      accent: "#1e0693",
      bg: "#1e0693",
      border: "#ddd6fe",
    },
    {
      label: "Misi",
      value: tentang.misi,
      icon: (
        <img src={logodpm} alt="Logo DPM Unuja" className="w-8 h-8 object-contain" />
      ),
      accent: "#1b0a6f",
      bg: "#1e0693",
      border: "#ddd6fe",
    },
  ] : [];

  return (
    <>
      <div className="profil-page min-h-screen bg-slate-50">

        {/* ── HERO ── */}
        <div className="relative bg-blue-900 hero-pattern overflow-hidden">
          <div className="relative max-w-5xl mx-auto px-4 sm:px-8 py-20 sm:py-28 text-center fade-in">
            <h1 className="display-font text-white text-4xl sm:text-5xl lg:text-6xl font-semibold">
              PROFIL ORGANISASI
            </h1>
            <p className="text-blue-200 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Dewan Perwakilan Mahasiswa Universitas Nurul Jadid
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-16 space-y-20">

          {/* ── TENTANG DPM ── */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-44"/>)}
            </div>
          ) : tentang && (
            <section>
              <div className="text-center mb-12 fade-up">
                <div className="section-label mx-auto w-fit">Tentang Kami</div>
                <h2 className="display-font text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
                  Landasan Organisasi
                </h2>
                <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm">
                  Fondasi nilai, arah, dan tujuan Dewan Perwakilan Mahasiswa Universitas Nurul Jadid.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {infoCards.map((card, i) => (
                  <div
                    key={card.label}
                    className="info-card fade-up bg-white rounded-2xl border p-7"
                    style={{
                      borderColor: card.border,
                      animationDelay: `${i * 80}ms`,
                    }}
                  >
                    {/* left accent bar */}
                    <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: card.accent, borderRadius: "12px 0 0 12px" }}/>

                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{ background: card.bg, color: card.accent }}>
                        {card.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-bold uppercase tracking-widest mb-2" style={{ color: card.accent }}>
                          {card.label}
                        </p>
                        {/* ── Render list vertikal jika terdeteksi, paragraf biasa jika tidak ── */}
                        <CardValue value={card.value} accent={card.accent} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── DIVIDER ── */}
          {!loading && tentang && strukturs.length > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"/>
              <div className="w-2 h-2 rounded-full bg-blue-900"/>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"/>
            </div>
          )}

          {/* ── STRUKTUR KEPENGURUSAN ── */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-60"/>)}
            </div>
          ) : strukturs.length > 0 && (
            <section>
              <div className="text-center mb-12 fade-up">
                <div className="section-label mx-auto w-fit">Kepengurusan</div>
                <h2 className="display-font text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
                  Pengurus DPM
                </h2>
                <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm">
                  Individu-individu terpilih yang mengemban amanah mewakili suara mahasiswa.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {strukturs.map((s, i) => (
                  <div
                    key={s.id}
                    className="member-card fade-up bg-white rounded-2xl border border-gray-100 overflow-hidden"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    {/* Photo */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-600 to-blue-900">
                      {s.foto ? (
                        <>
                          <img
                            src={`${strukturImageStorage}/${s.foto}`}
                            alt={s.nama}
                            className="member-img w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextElementSibling.style.display = "flex";
                            }}
                          />
                          <div className="w-full h-full items-center justify-center absolute inset-0" style={{ display: "none" }}>
                            <span className="text-4xl font-bold text-white/80">{getInitials(s.nama)}</span>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-4xl font-bold text-white/80">{getInitials(s.nama)}</span>
                        </div>
                      )}
                      {/* Gradient overlay bottom */}
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent"/>
                    </div>

                    {/* Info */}
                    <div className="p-4 text-center">
                      <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 line-clamp-2">
                        {s.nama}
                      </h3>
                      <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-50 rounded-full border border-blue-100">
                        {s.jabatan}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </>
  );
}
