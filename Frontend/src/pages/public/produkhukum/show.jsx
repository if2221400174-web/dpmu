import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { showProdukHukum } from "../../../_sevices/produkhukum";
import { hukumfiletorage } from "../../../_api";

export default function ShowProdukHukum() {
  const { id } = useParams();
  const [produk, setProduk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await showProdukHukum(id);
        setProduk(data);
      } catch (err) {
        console.error("showProdukHukum error:", err);
        setError("Gagal memuat detail produk hukum.");
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
          <Link to="/produkhukum" className="mt-6 inline-flex items-center rounded-lg bg-blue-900 px-4 py-2 text-sm text-white hover:bg-blue-800">
            Kembali ke Daftar Produk Hukum
          </Link>
        </div>
      </div>
    );
  }

  if (!produk) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-24 px-4">
        <div className="max-w-2xl w-full rounded-3xl bg-white border border-gray-200 p-8 shadow-sm text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Data tidak ditemukan</h2>
          <p className="text-sm text-gray-500">Produk hukum yang diminta tidak tersedia.</p>
          <Link to="/produkhukum" className="mt-6 inline-flex items-center rounded-lg bg-blue-900 px-4 py-2 text-sm text-white hover:bg-blue-800">
            Kembali ke Daftar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          to="/produkhukum"
          className="inline-flex items-center gap-2 text-blue-900 hover:text-blue-700 mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Produk Hukum
        </Link>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-8 space-y-6">
            <div className="rounded-3xl border border-gray-100 bg-gray-50 p-5">
              <h2 className="text-xl text-center font-bold text-gray-900 uppercase tracking-widest">Detail Dokumen</h2>
              <div className="mt-4 text-md text-gray-900 space-y-3">
                <p>
                  <span className="font-semibold">Judul:</span> {produk.judul}
                </p>
                <p>
                  <span className="font-semibold">Abstrak:</span> {produk.abstract}
                </p>
                <p>
                  <span className="font-semibold">Status:</span> {produk.status || "-"}
                </p>
                <p>
                  <span className="font-semibold">Tanggal Ditetapkan:</span>{" "}
                  {produk.tanggal_ditetapkan
                    ? new Date(produk.tanggal_ditetapkan).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "-"}
                </p>
              </div>
            </div>

            {produk.file && (
              <div className="rounded-3xl border border-gray-100 bg-white p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">File</p>
                  <p className="mt-2 text-base font-medium text-gray-900">{getFileExtension(produk.file)}</p>
                </div>
                <a
                  href={`${hukumfiletorage}/${produk.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-blue-900 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 transition"
                >
                  Buka / Unduh File
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
