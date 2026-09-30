import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { kritikDpmCreate } from "../../../_sevices/kritikdpms";

export default function CreateKritikDpm() {
  const [formData, setFormdata] = useState({
    kritik: "",
    saran: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = new FormData();
      for (const key in formData) {
        payload.append(key, formData[key]);
      }
      await kritikDpmCreate(formData);
      console.log("payload", payload);
      navigate("/admin/kritik_dpm");
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Validation errors:", error.response.data);
        alert(JSON.stringify(error.response.data.message));
      } else {
        console.error(error);
        alert("Unexpected error occurred");
      }
    }
  };

  console.log(formData);

  const handleReset = () => {
    setFormdata({
      kritik: "",
      saran: "",
    });
  };

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-4xl px-4 py-6 mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Tambah Kritik & Saran
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sampaikan kritik dan saran untuk DPM
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/kritik_dpm")}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali
            </button>
          </div>

          <form onSubmit={handleSubmit} onReset={handleReset}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Form Content */}
              <div className="p-6 space-y-6">
                {/* Info Box */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex gap-3">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                        Panduan Pengisian
                      </h3>
                      <p className="text-sm text-blue-800 dark:text-blue-400">
                        Sampaikan kritik dan saran Anda dengan jelas dan konstruktif untuk membantu DPM menjadi lebih baik.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Kritik Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                      <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <label
                        htmlFor="kritik"
                        className="block text-sm font-semibold text-gray-900 dark:text-white"
                      >
                        Kritik Anda
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Sampaikan hal-hal yang perlu diperbaiki
                      </p>
                    </div>
                  </div>
                  <textarea
                    id="kritik"
                    name="kritik"
                    value={formData.kritik}
                    onChange={handleChange}
                    rows="5"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-all duration-200 resize-none"
                    placeholder="Contoh: Saya merasa koordinasi antar divisi masih kurang optimal, terutama dalam hal komunikasi informasi kegiatan..."
                    required
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {formData.kritik.length} karakter
                  </p>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-white dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400">
                      dan
                    </span>
                  </div>
                </div>

                {/* Saran Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div>
                      <label
                        htmlFor="saran"
                        className="block text-sm font-semibold text-gray-900 dark:text-white"
                      >
                        Saran Anda
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Berikan solusi atau ide perbaikan
                      </p>
                    </div>
                  </div>
                  <textarea
                    id="saran"
                    name="saran"
                    value={formData.saran}
                    onChange={handleChange}
                    rows="5"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-all duration-200 resize-none"
                    placeholder="Contoh: Sebaiknya dibuat grup koordinasi khusus dan jadwal meeting rutin setiap minggu untuk membahas progress kegiatan..."
                    required
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {formData.saran.length} karakter
                  </p>
                </div>

                {/* Tips Box */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <div className="flex gap-3">
                    <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-300 mb-1">
                        Tips untuk Kritik & Saran yang Baik
                      </h3>
                      <ul className="text-sm text-amber-800 dark:text-amber-400 space-y-1">
                        <li>• Sampaikan dengan bahasa yang sopan dan konstruktif</li>
                        <li>• Berikan contoh konkret untuk memperjelas</li>
                        <li>• Fokus pada solusi, bukan hanya masalah</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-between gap-4 px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                <button
                  type="reset"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700 transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Reset
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-900 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-900 dark:hover:bg-blue-800 dark:focus:ring-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Kirim Kritik & Saran
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
