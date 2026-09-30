import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteBeritaDpm, getBeritaDpm } from "../../../_sevices/beritadpm";
import { beritaImageStorage } from "../../../_api";

export default function AdminBeritaDpm() {
  const [berita_dpms, setBeritaDpm] = useState([]);
  const [openDropdownId, setOpenDropdwnId] = useState(null);
  const [viewMode, setViewMode] = useState("card");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const [beritaDpmData] = await Promise.all([getBeritaDpm()]);
      // Urutkan dari terbaru ke terlama
      const sorted = [...(beritaDpmData || [])].sort((a, b) => {
        const dateA = new Date(a.created_at || a.tanggal || 0);
        const dateB = new Date(b.created_at || b.tanggal || 0);
        return dateB - dateA;
      });
      setBeritaDpm(sorted);
    };

    fetchData();
  }, []);

  const toggleDropdwn = (id) => {
    setOpenDropdwnId(openDropdownId === id ? null : id);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure will delete");

    if (confirmDelete) {
      await deleteBeritaDpm(id);
      setBeritaDpm(berita_dpms.filter((beritaDpm) => beritaDpm.id !== id));
    }
  };

  const stripHtmlTags = (html) => {
    if (!html) return '';
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .trim();
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    const cleanText = stripHtmlTags(text);
    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.substring(0, maxLength) + "...";
  };

  const filteredBerita = berita_dpms.filter((berita) => {
    const cleanTitle = stripHtmlTags(berita.judul || '').toLowerCase();
    const cleanContent = stripHtmlTags(berita.isi_berita || '').toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    return cleanTitle.includes(searchLower) || cleanContent.includes(searchLower);
  });

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Berita DPM
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Kelola dan publikasi berita terbaru dari DPM
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
                    placeholder="Cari berita..."
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
                  to={`/admin/beritadpm/create`}
                  className="flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-medium rounded-lg text-sm px-4 py-2.5 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] flex-1 sm:flex-initial"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span>Tambah Berita</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Content */}
          {viewMode === "card" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBerita.length > 0 ? (
                filteredBerita.map((beritaDpm) => (
                  <div
                    key={beritaDpm.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
                  >
                    {/* Image */}
                    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                      {beritaDpm.foto_berita ? (
                        <>
                          <img
                            src={`${beritaImageStorage}/${beritaDpm.foto_berita}`}
                            alt={beritaDpm.deskripsi_foto || beritaDpm.judul}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextElementSibling.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full flex flex-col items-center justify-center" style={{ display: 'none' }}>
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
                          <span className="text-xs text-gray-500 dark:text-gray-400">Tidak ada gambar</span>
                        </div>
                      )}

                      {/* Action Dropdown */}
                      <div className="absolute top-3 right-3">
                        <div className="relative">
                          <button
                            onClick={() => toggleDropdwn(beritaDpm.id)}
                            className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 shadow-md"
                          >
                            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                          </button>

                          {openDropdownId === beritaDpm.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 z-50 animate-fadeIn">
                              <div className="py-1">
                                <Link
                                  to={`/admin/beritadpm/edit/${beritaDpm.id}`}
                                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors duration-150"
                                  onClick={() => setOpenDropdwnId(null)}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Edit Berita
                                </Link>
                                <button
                                  onClick={() => {
                                    handleDelete(beritaDpm.id);
                                    setOpenDropdwnId(null);
                                  }}
                                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Hapus Berita
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Badge */}
                      <div className="absolute bottom-3 left-3">
                        <span className="px-3 py-1 bg-blue-900/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                          Berita
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2 text-xs text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span>{formatDate(beritaDpm.created_at || beritaDpm.tanggal)}</span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors duration-200">
                        {stripHtmlTags(beritaDpm.judul)}
                      </h3>

                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                        {truncateText(beritaDpm.isi_berita, 150)}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center">
                            <span className="text-xs font-semibold text-white">
                              {beritaDpm.author?.charAt(0).toUpperCase() || "A"}
                            </span>
                          </div>
                          <div className="text-xs">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {beritaDpm.author || "Admin"}
                            </p>
                          </div>
                        </div>

                        <Link
                          to={`/admin/beritadpm/edit/${beritaDpm.id}`}
                          className="text-blue-900 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-200"
                        >
                          Lihat Detail →
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
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Tidak ada berita</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    {searchQuery ? "Tidak ada hasil yang sesuai dengan pencarian" : "Mulai tambahkan berita baru"}
                  </p>
                  {!searchQuery && (
                    <Link
                      to="/admin/beritadpm/create"
                      className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-medium rounded-lg text-sm px-6 py-3 transition-all duration-200"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Tambah Berita Pertama
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
                      <th scope="col" className="px-6 py-4">Judul</th>
                      <th scope="col" className="px-6 py-4">Isi Berita</th>
                      <th scope="col" className="px-6 py-4">Foto berita</th>
                      <th scope="col" className="px-6 py-4">Deskripsi foto</th>
                      <th scope="col" className="px-6 py-4"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBerita.length > 0 ? (
                      filteredBerita.map((beritaDpm) => (
                        <tr
                          key={beritaDpm.id}
                          className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                        >
                          <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {stripHtmlTags(beritaDpm.judul)}
                          </th>
                          <td className="px-6 py-4">{truncateText(beritaDpm.isi_berita, 100)}</td>
                          <td className="px-6 py-4">
                            {beritaDpm.foto_berita ? (
                              <>
                                <img
                                  src={`${beritaImageStorage}/${beritaDpm.foto_berita}`}
                                  alt={beritaDpm.judul}
                                  className="w-16 h-16 object-cover rounded-lg"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextElementSibling.style.display = 'flex';
                                  }}
                                />
                                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center" style={{ display: 'none' }}>
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
                          <td className="px-6 py-4">{truncateText(beritaDpm.deskripsi_foto, 50)}</td>
                          <td className="px-6 py-4 relative">
                            <button
                              onClick={() => toggleDropdwn(beritaDpm.id)}
                              className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none dark:text-gray-400 dark:hover:text-gray-100 transition-all duration-150"
                              type="button"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                              </svg>
                            </button>

                            {openDropdownId === beritaDpm.id && (
                              <div className="absolute right-0 mt-2 z-10 w-48 bg-white rounded-lg shadow-xl border border-gray-200 dark:bg-gray-700 dark:border-gray-600 animate-fadeIn" style={{ top: "100%", right: "0" }}>
                                <div className="py-1">
                                  <Link
                                    to={`/admin/beritadpm/edit/${beritaDpm.id}`}
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
                                      handleDelete(beritaDpm.id);
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
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </>
  );
}
