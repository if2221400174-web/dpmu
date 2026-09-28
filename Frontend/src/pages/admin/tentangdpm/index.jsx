import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteTentangDpm, getTentangDpm } from "../../../_sevices/tentangdpm";

export default function AdminTentangDpm() {
  const [tentangDpms, setTentangDpm] = useState([]);
  const [openDropdownId, setOpenDropdwnId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const [tentangDpmData] = await Promise.all([getTentangDpm()]);
      setTentangDpm(tentangDpmData);
    };
    fetchData();
  }, []);

  const toggleDropdwn = (id) => {
    setOpenDropdwnId(openDropdownId === id ? null : id);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure will delete");
    if (confirmDelete) {
      await deleteTentangDpm(id);
      setTentangDpm(tentangDpms.filter((tentangDpm) => tentangDpm.id !== id));
    }
  };

  const filteredTentang = tentangDpms.filter(
    (tentang) =>
      tentang.tujuan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tentang.fungsi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tentang.visi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tentang.misi?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render teks biasa atau list bernomor vertikal
  const renderContent = (text) => {
    if (!text) return <span className="text-gray-400 italic text-sm">Belum diisi</span>;

    const isNumbered = /^\d+\.\s/.test(text.trim());

    if (isNumbered) {
      const lines = text.split("\n").filter((l) => l.trim());
      return (
        <ol className="space-y-2">
          {lines.map((line, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
              <span className="flex-shrink-0 w-5 h-5 rounded-full text-gray-600 text-xs font-semibold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span className="leading-relaxed">{line.replace(/^\d+\.\s*/, "")}</span>
            </li>
          ))}
        </ol>
      );
    }

    return (
      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
        {text}
      </p>
    );
  };

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Tentang DPM
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Kelola informasi profil organisasi DPM
            </p>
          </div>

          {/* Action Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="w-full lg:w-96">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                  </div>
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 dark:text-white transition-all duration-200"
                    placeholder="Cari informasi DPM..."
                  />
                </div>
              </div>
              <Link
                to={`/admin/tentangdpm/create`}
                className="flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-medium rounded-lg text-sm px-4 py-2.5 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] w-full lg:w-auto"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
                </svg>
                <span>Tambah</span>
              </Link>
            </div>
          </div>

          {/* Content */}
          {filteredTentang.length > 0 ? (
            <div className="space-y-6">
              {filteredTentang.map((tentangDpm) => (
                <div
                  key={tentangDpm.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                          </svg>
                        </div>
                      </div>

                      {/* Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => toggleDropdwn(tentangDpm.id)}
                          className="p-2 text-gray hover:bg-white/20 rounded-lg transition-all duration-200"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"/>
                          </svg>
                        </button>
                        {openDropdownId === tentangDpm.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 z-50 animate-fadeIn">
                            <div className="py-1">
                              <Link
                                to={`/admin/tentangdpm/edit/${tentangDpm.id}`}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors duration-150"
                                onClick={() => setOpenDropdwnId(null)}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                </svg>
                                Edit Informasi
                              </Link>
                              <button
                                onClick={() => { handleDelete(tentangDpm.id); setOpenDropdwnId(null); }}
                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                                Hapus
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      {/* Tujuan */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                            </svg>
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">Tujuan</h4>
                        </div>
                        <div className="pl-11">
                          {renderContent(tentangDpm.tujuan)}
                        </div>
                      </div>

                      {/* Fungsi */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                            </svg>
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">Fungsi</h4>
                        </div>
                        <div className="pl-11">
                          {renderContent(tentangDpm.fungsi)}
                        </div>
                      </div>

                      {/* Visi */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                            </svg>
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">Visi</h4>
                        </div>
                        <div className="pl-11">
                          {renderContent(tentangDpm.visi)}
                        </div>
                      </div>

                      {/* Misi */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                            </svg>
                          </div>
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">Misi</h4>
                        </div>
                        <div className="pl-11">
                          {renderContent(tentangDpm.misi)}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      to={`/admin/tentangdpm/edit/${tentangDpm.id}`}
                      className="inline-flex items-center gap-2 text-blue-900 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                      <span>Edit Informasi</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Tidak ada informasi</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {searchQuery ? "Tidak ada hasil yang sesuai dengan pencarian" : "Belum ada informasi tentang DPM"}
              </p>
              {!searchQuery && (
                <Link
                  to="/admin/tentangdpm/create"
                  className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-medium rounded-lg text-sm px-6 py-3 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
                  </svg>
                  Tambah Informasi
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </>
  );
}