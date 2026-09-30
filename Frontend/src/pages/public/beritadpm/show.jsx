import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { showBeritaDpm } from "../../../_sevices/beritadpm";
import { beritaImageStorage } from "../../../_api";

// Konversi konten — kalau plain text (tidak ada tag HTML), bungkus tiap baris jadi <p>
const formatContent = (content) => {
  if (!content) return "";
  const hasHtmlTags = /<[a-z][\s\S]*>/i.test(content);
  if (hasHtmlTags) return content;
  return content
    .split(/\n\s*\n/)
    .map((para) => `<p>${para.replace(/\n/g, "<br/>")}</p>`)
    .join("");
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
};

const formatTime = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString("id-ID", {
    hour: "2-digit", minute: "2-digit",
  }) + " WIB";
};

export default function ShowBeritaDpm() {
  const { id } = useParams();
  const [berita, setBerita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const raw = await showBeritaDpm(id);
        setBerita(raw?.data ?? raw);
      } catch (err) {
        setError("Gagal memuat berita.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(berita?.judul || "Berita DPM UNUJA");

  const shareLinks = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${shareTitle}%20${shareUrl}`,
      color: "bg-green-500 hover:bg-green-600",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
    },
    {
      label: "Telegram",
      href: `https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`,
      color: "bg-sky-500 hover:bg-sky-600",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
    },
  ];

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-pulse w-full max-w-3xl mx-auto px-4 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/3"/>
        <div className="h-10 bg-gray-200 rounded w-full"/>
        <div className="h-72 bg-gray-200 rounded-2xl"/>
        {[...Array(5)].map((_, i) => <div key={i} className="h-4 bg-gray-200 rounded w-full"/>)}
      </div>
    </div>
  );

  if (error || !berita) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-red-200 p-8 max-w-md w-full text-center">
        <p className="text-red-600 mb-4">{error || "Berita tidak ditemukan."}</p>
        <Link to="/informasi" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 text-white text-sm rounded-lg hover:bg-blue-800 transition">
          Kembali ke Informasi lainnya
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {/* Kembali */}
        <Link to="/informasi" className="inline-flex items-center gap-2 text-blue-900 hover:text-blue-700 mb-6 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Kembali ke Informasi lainnya
        </Link>

        <article className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

          {/* Foto */}
          {berita.foto_berita && (
            <div className="relative">
              <img
                src={`${beritaImageStorage}/${berita.foto_berita}`}
                alt={berita.deskripsi_foto || berita.judul}
                className="w-full h-64 sm:h-96 object-cover"
                onError={(e) => { e.target.parentNode.style.display = "none"; }}
              />
              {berita.deskripsi_foto && (
                <p className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs px-4 py-2 backdrop-blur-sm">
                  {berita.deskripsi_foto}
                </p>
              )}
            </div>
          )}

          <div className="p-6 sm:p-8">

            {/* Judul */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug mb-3">
              {berita.judul}
            </h1>

            {/* Meta: tanggal + waktu */}
            <p className="text-sm text-gray-500 mb-4">
              {formatDate(berita.created_at)}, {formatTime(berita.created_at)}
            </p>

            {/* Tombol Share */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm font-medium text-gray-600 mr-1">Bagikan:</span>
              {shareLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white transition-all duration-200 ${s.color}`}
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 mb-6"/>

            {/* Isi Berita — render HTML dengan paragraf benar */}
            <div
              className="berita-content text-gray-700 text-[15px] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formatContent(berita.isi_berita) }}
            />

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-900 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {berita.author?.charAt(0).toUpperCase() || "D"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{berita.author || "DPM UNUJA"}</p>
                  <p className="text-xs text-gray-400">Penulis</p>
                </div>
              </div>
              <Link to="/informasi" className="text-sm text-blue-900 hover:underline flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                </svg>
                Informasi lainnya
              </Link>
            </div>
          </div>
        </article>
      </div>

      <style>{`
        /* Paragraf */
        .berita-content p {
          margin-bottom: 1.25rem;
          line-height: 1.8;
        }
        .berita-content p:last-child {
          margin-bottom: 0;
        }
        /* Heading */
        .berita-content h1,
        .berita-content h2,
        .berita-content h3,
        .berita-content h4 {
          font-weight: 700;
          color: #1e3a5f;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }
        .berita-content h1 { font-size: 1.5rem; }
        .berita-content h2 { font-size: 1.25rem; }
        .berita-content h3 { font-size: 1.1rem; }
        /* Blockquote */
        .berita-content blockquote {
          border-left: 4px solid #1e40af;
          padding: 0.75rem 1rem;
          margin: 1.5rem 0;
          background: #eff6ff;
          border-radius: 0 8px 8px 0;
          font-style: italic;
          color: #374151;
        }
        /* List */
        .berita-content ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
        .berita-content ol { list-style: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
        .berita-content li { margin-bottom: 0.4rem; line-height: 1.7; }
        /* Image */
        .berita-content img {
          border-radius: 12px;
          max-width: 100%;
          margin: 1.5rem auto;
          display: block;
        }
        /* Link */
        .berita-content a { color: #1e40af; text-decoration: underline; }
        /* Strong / em */
        .berita-content strong { font-weight: 700; color: #111827; }
        .berita-content em { font-style: italic; }
      `}</style>
    </div>
  );
}
