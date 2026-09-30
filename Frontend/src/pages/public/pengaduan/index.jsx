import { useState } from "react";
import { Link } from "react-router-dom";

export default function PublikPengaduan() {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Banner */}
      <div className="relative bg-blue-900 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <h1 className="text-white font-semibold text-center text-3xl sm:text-4xl lg:text-5xl leading-tight mb-3">
            LAYANAN LAPORAN KEGIATAN, KRITIK DAN ASPIRASI
          </h1>
          <p className="text-blue-200 text-sm text-center sm:text-lg max-w-xl mx-auto">
            Sampaikan laporan kegiatan, kritik dan saran, atau aspirasi Anda kepada Dewan Perwakilan Mahasiswa
            Universitas Nurul Jadid.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

          <button
            onClick={() => setShowModal(true)}
            className="group bg-white border border-gray-200 rounded-2xl p-8 flex flex-col items-center text-center
                      hover:border-blue-300 hover:shadow-xl transition-all duration-300 w-full text-left"
          >
            <div className="w-16 h-16 bg-blue-50 group-hover:bg-blue-100 rounded-2xl flex items-center justify-center mb-5 transition-colors duration-300">
              <svg className="w-8 h-8 text-blue-800" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  clipRule="evenodd"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-900 transition-colors duration-200 mb-2">
              LAPORAN KEGIATAN
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Laporkan kegiatan anda yang akan dilaksanakan.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-800 group-hover:underline">
              Sampaikan Laporan
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
            </span>
          </button>

          {showModal && (
            <div
              className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
              onClick={() => setShowModal(false)}
            >
              <div
                className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Fitur Belum Tersedia</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Fitur <span className="font-semibold text-gray-700">Laporan Kegiatan</span> saat ini
                  masih belum dibuka. Harap untuk melaporkan kegiatan Anda ke kantor DPM U secara langsung
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-2.5 bg-blue-800 text-white rounded-xl text-sm font-semibold hover:bg-blue-900 transition-colors"
                >
                  Mengerti
                </button>
              </div>
            </div>
          )}
          {/* Kritik & Saran */}
          <Link
            to="/kritik-saran"
            className="group bg-white border border-gray-200 rounded-2xl p-8 flex flex-col items-center text-center
                      hover:border-blue-300 hover:shadow-xl transition-all duration-300"
          >
            <div className="w-16 h-16 bg-blue-50 group-hover:bg-blue-100 rounded-2xl flex items-center justify-center mb-5 transition-colors duration-300">
              <svg className="w-8 h-8 text-blue-800" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  clipRule="evenodd"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-900 transition-colors duration-200 mb-2">
              KRITIK & SARAN
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Sampaikan kritik dan saran Anda untuk membantu DPM U menjadi lebih baik dalam melayani mahasiswa.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-800 group-hover:underline">
              Sampaikan Kritik & Saran
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
            </span>
          </Link>

          <Link
            to="/aspirasi"
            className="group bg-white border border-gray-200 rounded-2xl p-8 flex flex-col items-center text-center
                       hover:border-blue-300 hover:shadow-xl transition-all duration-300"
          >
            <div className="w-16 h-16 bg-blue-50 group-hover:bg-blue-100 rounded-2xl flex items-center justify-center mb-5 transition-colors duration-300">
              <svg className="w-8 h-8 text-blue-800" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-800 transition-colors duration-200 mb-2">
              ASPIRASI
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Laporkan masalah atau keluhan yang Anda alami. Pengaduan Anda akan ditindaklanjuti oleh DPM.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-800 group-hover:underline">
              Sampaikan Aspirasi
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
            </span>
          </Link>

        </div>
      </div>
    </div>
  );
}
