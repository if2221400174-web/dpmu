import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deletePengaduan, getPengaduan } from "../../../_sevices/pengaduans";
import { pengaduanImageStorage } from "../../../_api";

export default function AdminPengaduan() {
  const [pengaduans, setPengaduans] = useState([]);
  const [openDropdownId, setOpenDropdwnId] = useState(null);
  const [viewMode, setViewMode] = useState("card");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const [pengaduanData] = await Promise.all([getPengaduan()]);
      // Urutkan dari terbaru ke terlama
      const sorted = [...(pengaduanData || [])].sort((a, b) => {
        const dateA = new Date(a.created_at || a.tanggal || 0);
        const dateB = new Date(b.created_at || b.tanggal || 0);
        return dateB - dateA;
      });
      setPengaduans(sorted);
    };

    fetchData();
  }, []);

  const toggleDropdwn = (id) => {
    setOpenDropdwnId(openDropdownId === id ? null : id);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure will delete");

    if (confirmDelete) {
      await deletePengaduan(id);
      setPengaduans(pengaduans.filter((pengaduan) => pengaduan.id !== id));
    }
  };

  const filteredPengaduan = pengaduans.filter(
    (pengaduan) =>
      pengaduan.prodi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pengaduan.fakultas?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pengaduan.deskripsi_masalah?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Pengaduan Mahasiswa
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Kelola pengaduan dan masalah dari mahasiswa
            </p>
          </div>

          {/* Action Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search Bar */}
              <div className="w-full lg:w-96">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 dark:text-white transition-all duration-200"
                    placeholder="Cari pengaduan..."
                  />
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-3 w-full lg:w-auto">
                {/* View Toggle */}
                <div className="hidden sm:flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("card")}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                      viewMode === "card"
                        ? "bg-white dark:bg-gray-600 text-blue-900 dark:text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 12a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zM11 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zM11 12a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                      viewMode === "table"
                        ? "bg-white dark:bg-gray-600 text-blue-900 dark:text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                {/* Add Button */}
                <Link
                  to={`/admin/pengaduan/create`}
                  className="flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-medium rounded-lg text-sm px-4 py-2.5 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] flex-1 sm:flex-initial"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span>Tambah</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Content */}
          {viewMode === "card" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPengaduan.length > 0 ? (
                filteredPengaduan.map((pengaduan) => (
                  <div
                    key={pengaduan.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
                  >
                    {/* Image */}
                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                      {pengaduan.foto_bukti ? (
                        <>
                          <img
                            src={`${pengaduanImageStorage}/${pengaduan.foto_bukti}`}
                            alt="Bukti Pengaduan"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextElementSibling.style.display = "flex";
                            }}
                          />
                          <div className="w-full h-full flex flex-col items-center justify-center" style={{ display: "none" }}>
                            <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Gambar tidak dapat dimuat</span>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                          <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs text-gray-500 dark:text-gray-400">Tidak ada foto</span>
                        </div>
                      )}

                      {/* Action Dropdown */}
                      <div className="absolute top-3 right-3">
                        <div className="relative">
                          <button
                            onClick={() => toggleDropdwn(pengaduan.id)}
                            className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 shadow-md"
                          >
                            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                          </button>

                          {openDropdownId === pengaduan.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 z-50 animate-fadeIn">
                              <div className="py-1">
                                <Link
                                  to={`/admin/pengaduan/edit/${pengaduan.id}`}
                                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors duration-150"
                                  onClick={() => setOpenDropdwnId(null)}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Edit Pengaduan
                                </Link>
                                <button
                                  onClick={() => {
                                    handleDelete(pengaduan.id);
                                    setOpenDropdwnId(null);
                                  }}
                                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Hapus Pengaduan
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Badge */}
                      <div className="absolute bottom-3 left-3">
                        <span className="px-3 py-1 bg-orange-600/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                          Pengaduan
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      {/* Prodi & Fakultas */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded">
                            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Prodi</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{pengaduan.prodi}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Fakultas</p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{pengaduan.fakultas}</p>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 dark:border-gray-700"></div>

                      {/* Date */}
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span>{formatDate(pengaduan.created_at || pengaduan.tanggal)}</span>
                      </div>

                      {/* Description */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Deskripsi Masalah:</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                          {pengaduan.deskripsi_masalah || "-"}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                        <Link
                          to={`/admin/pengaduan/edit/${pengaduan.id}`}
                          className="text-blue-900 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-200 inline-flex items-center gap-1"
                        >
                          Lihat Detail
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Tidak ada pengaduan</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    {searchQuery ? "Tidak ada hasil yang sesuai dengan pencarian" : "Belum ada pengaduan yang masuk"}
                  </p>
                  {!searchQuery && (
                    <Link
                      to="/admin/pengaduan/create"
                      className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-medium rounded-lg text-sm px-6 py-3 transition-all duration-200"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Tambah Pengaduan
                    </Link>
                  )}
                </div>
              )}
            </div>
          ) : (
            // Table View
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-4">Prodi</th>
                      <th scope="col" className="px-6 py-4">Fakultas</th>
                      <th scope="col" className="px-6 py-4">Deskripsi Masalah</th>
                      <th scope="col" className="px-6 py-4">Foto Bukti</th>
                      <th scope="col" className="px-6 py-4"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPengaduan.length > 0 ? (
                      filteredPengaduan.map((pengaduan) => (
                        <tr key={pengaduan.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                          <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {pengaduan.prodi}
                          </th>
                          <td className="px-6 py-4">{pengaduan.fakultas}</td>
                          <td className="px-6 py-4">{truncateText(pengaduan.deskripsi_masalah, 100)}</td>
                          <td className="px-6 py-4">
                            {pengaduan.foto_bukti ? (
                              <>
                                <img
                                  src={`${pengaduanImageStorage}/${pengaduan.foto_bukti}`}
                                  alt="Bukti"
                                  className="w-16 h-16 object-cover rounded-lg"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.nextElementSibling.style.display = "flex";
                                  }}
                                />
                                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center" style={{ display: "none" }}>
                                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              </>
                            ) : (
                              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 relative">
                            <button
                              onClick={() => toggleDropdwn(pengaduan.id)}
                              className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none dark:text-gray-400 dark:hover:text-gray-100 transition-all duration-150"
                              type="button"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                              </svg>
                            </button>

                            {openDropdownId === pengaduan.id && (
                              <div className="absolute right-0 mt-2 z-10 w-48 bg-white rounded-lg shadow-xl border border-gray-200 dark:bg-gray-700 dark:border-gray-600 animate-fadeIn" style={{ top: "100%", right: "0" }}>
                                <div className="py-1">
                                  <Link
                                    to={`/admin/pengaduan/edit/${pengaduan.id}`}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-150"
                                    onClick={() => setOpenDropdwnId(null)}
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                  </Link>
                                  <button
                                    onClick={() => {
                                      handleDelete(pengaduan.id);
                                      setOpenDropdwnId(null);
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors duration-150"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-12 text-gray-500 dark:text-gray-400">
                          <div className="flex flex-col items-center">
                            <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-lg font-medium">
                              {searchQuery ? "Tidak ada hasil yang sesuai" : "Data tidak ditemukan"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </>
  );
}
