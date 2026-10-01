import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { showKeputusan } from "../../../_sevices/keputusan";
import { keputusanfiletorage } from "../../../_api";

export default function ShowKeputusan() {
  const { id } = useParams();
  const [keputusan, setKeputusan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const raw = await showKeputusan(id);
        const data = raw?.data ?? raw;
        setKeputusan(data);
      } catch (err) {
        console.error("showKeputusan error:", err);
        setError("Gagal memuat detail keputusan.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const getFileExtension = (filename) => {
    if (!filename) return "FILE";
    return filename.split(".").pop().toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-24 px-4">
        <div className="animate-pulse rounded-3xl bg-white p-10 shadow-md w-full max-w-3xl">
          <div className="h-8 bg-gray-200 rounded mb-4" />
          <div className="h-4 bg-gray-200 rounded mb-3" />
          <div className="h-4 bg-gray-200 rounded mb-3" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-6" />
          <div className="h-24 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-24 px-4">
        <div className="max-w-2xl w-full rounded-3xl bg-white border border-red-200 p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-red-700 mb-3">Terjadi kesalahan</h2>
          <p className="text-sm text-red-600">{error}</p>
          <Link to="/keputusan" className="mt-6 inline-flex items-center rounded-lg bg-blue-900 px-4 py-2 text-sm text-white hover:bg-blue-800">
            Kembali ke Daftar Keputusan
          </Link>
        </div>
      </div>
    );
  }

  if (!keputusan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-24 px-4">
        <div className="max-w-2xl w-full rounded-3xl bg-white border border-gray-200 p-8 shadow-sm text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Data tidak ditemukan</h2>
          <p className="text-sm text-gray-500">Keputusan yang diminta tidak tersedia.</p>
          <Link to="/keputusan" className="mt-6 inline-flex items-center rounded-lg bg-blue-900 px-4 py-2 text-sm text-white hover:bg-blue-800">
            Kembali ke Daftar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Breadcrumb / Back */}
        <Link
          to="/keputusan"
          className="inline-flex items-center gap-2 text-blue-900 hover:text-blue-700 mb-6 text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Kembali ke Keputusan
        </Link>

        {/* ── 2 Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Kolom Kiri (2/3) ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Card: Materi Pokok */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-900" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                  </svg>
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">
                    Materi Pokok <span className="text-blue-900">Keputusan</span>
                  </h2>
                </div>
              </div>
              <div className="px-6 py-5">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {keputusan.abstract || <span className="text-gray-400 italic">Tidak ada abstrak tersedia.</span>}
                </p>
              </div>
            </div>

            {/* Card: Metadata */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
                <svg className="w-5 h-5 text-blue-900" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">
                  Metadata <span className="text-blue-900">Keputusan</span>
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  { label: "Judul", value: keputusan.judul },
                  {
                    label: "Tanggal Ditetapkan",
                    value: keputusan.tanggal_ditetapkan
                      ? new Date(keputusan.tanggal_ditetapkan).toLocaleDateString("id-ID", {
                          day: "numeric", month: "long", year: "numeric",
                        })
                      : "-",
                  },
                  { label: "Status", value: keputusan.status || "-" },
                ].map((row, i) => (
                  <div
                    key={i}
                    className={`grid grid-cols-3 px-6 py-3 text-sm ${i % 2 === 0 ? "bg-blue-50/40" : "bg-white"}`}
                  >
                    <span className="font-semibold text-blue-900 col-span-1">{row.label}</span>
                    <span className="text-gray-800 col-span-2">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── Kolom Kanan (1/3) ── */}
          <div className="space-y-5">

            {/* Card: File */}
            {keputusan.file && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                  <svg className="w-5 h-5 text-blue-900" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
                    <path d="M8 11a1 1 0 100 2h4a1 1 0 100-2H8zM8 8a1 1 0 100 2h4a1 1 0 100-2H8z"/>
                  </svg>
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">
                    File <span className="text-blue-900">Keputusan</span>
                  </h2>
                </div>
                <div className="px-5 py-4 space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 text-red-700 text-xs font-bold flex-shrink-0">
                      {getFileExtension(keputusan.file)}
                    </span>
                    <p className="text-xs text-gray-600 break-all leading-snug">{keputusan.file}</p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`${keputusanfiletorage}/${keputusan.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-900 px-3 py-2.5 text-xs font-semibold text-white hover:bg-blue-800 transition"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                      Preview
                    </a>
                    <a
                      href={`${keputusanfiletorage}/${keputusan.file}`}
                      download
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-blue-900 px-3 py-2.5 text-xs font-semibold text-blue-900 hover:bg-blue-50 transition"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                      </svg>
                      Download
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Card: Status */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                <svg className="w-5 h-5 text-blue-900" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">
                  Status <span className="text-blue-900">Keputusan</span>
                </h2>
              </div>
              <div className="px-5 py-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                    ${keputusan.status?.toLowerCase() === "berlaku"
                      ? "bg-green-100 text-green-700"
                      : keputusan.status?.toLowerCase() === "tidak berlaku"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-600"
                    }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full inline-block
                    ${keputusan.status?.toLowerCase() === "berlaku"
                      ? "bg-green-500"
                      : keputusan.status?.toLowerCase() === "tidak berlaku"
                      ? "bg-red-500"
                      : "bg-gray-400"
                    }`}
                  />
                  {keputusan.status || "Tidak diketahui"}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}