import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { kritikDpmCreate } from "../../../_sevices/kritikdpms";

export default function PublikKritikSaran() {
  const [formData, setFormdata] = useState({ kritik: "", saran: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await kritikDpmCreate(formData);
      setSubmitted(true);
    } catch (error) {
      if (error.response?.data) {
        alert(JSON.stringify(error.response.data.message));
      } else {
        alert("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => setFormdata({ kritik: "", saran: "" });

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Terima Kasih!</h2>
          <p className="text-sm text-gray-500 mb-6">
            Kritik dan saran Anda telah berhasil dikirim. DPM akan mempertimbangkan masukan Anda.
          </p>
          <button
            onClick={() => navigate("/pengaduan")}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="relative bg-blue-900 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h1 className="text-white font-semibold text-center text-3xl sm:text-4xl leading-tight mb-3">
            Kritik & Saran
          </h1>
          <p className="text-blue-200 text-sm text-center sm:text-base max-w-xl mx-auto">
            Sampaikan kritik dan saran Anda untuk DPM Universitas Nurul Jadid.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

        {/* Kembali */}
        <button
          onClick={() => navigate("/pengaduan")}
          className="inline-flex items-center gap-2 text-blue-900 hover:text-blue-700 mb-6 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Kembali
        </button>

        <form onSubmit={handleSubmit} onReset={handleReset}>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 space-y-6">

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <p className="text-sm text-center text-blue-800">
                  Sampaikan kritik dan saran Anda dengan jelas dan konstruktif untuk membantu DPM menjadi lebih baik.
                </p>
              </div>

              {/* Kritik */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <label htmlFor="kritik" className="block text-sm font-semibold text-gray-900">Kritik Anda</label>
                    <p className="text-xs text-gray-500">Sampaikan hal-hal yang perlu diperbaiki</p>
                  </div>
                </div>
                <textarea
                  id="kritik" name="kritik" value={formData.kritik} onChange={handleChange} rows="5"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-4 resize-none transition-all duration-200"
                  placeholder="Sampaikan hal-hal yang perlu diperbaiki oleh DPM..."
                  required
                />
              </div>

              {/* Saran */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                  <div>
                    <label htmlFor="saran" className="block text-sm font-semibold text-gray-900">Saran Anda</label>
                    <p className="text-xs text-gray-500">Rekomendasikan solusi atau ide perbaikan</p>
                  </div>
                </div>
                <textarea
                  id="saran" name="saran" value={formData.saran} onChange={handleChange} rows="5"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-4 resize-none transition-all duration-200"
                  placeholder="Berikan solusi atau ide untuk perbaikan DPM..."
                  required
                />
              </div>

              {/* Tips */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                <ul className="text-sm text-amber-800 space-y-1">
                  <p className="font-semibold text-amber-800 space-y-1">PASTIKAN KRITIK DAN SARAN ANDA MEMENUHI KRITERIA BERIKUT:</p>
                  <li>• Sampaikan dengan bahasa yang konstruktif</li>
                  <li>• Berikan contoh konkret untuk memperjelas hal yang perlu diperbaiki</li>
                  <li>• Rekomendasikan solusi yang realistis</li>
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-4 px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button type="reset"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                </svg>
                Reset
              </button>
              <button type="submit" disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-900 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 transition-all duration-200 shadow-md disabled:opacity-60"
              >
                {loading ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                )}
                {loading ? "Mengirim..." : "Kirim"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}