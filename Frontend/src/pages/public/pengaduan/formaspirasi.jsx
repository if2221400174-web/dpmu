import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPengaduan } from "../../../_sevices/pengaduans";

const FAKULTAS_PRODI = {
  "Program Pascasarjana": [
    "S2 Pendidikan Agama Islam",
    "S2 Manajemen Pendidikan Islam",
    "S3 Studi Islam"
  ],
  "Agama Islam": [
    "S1 Komunikasi dan Penyiaran Islam",
    "S1 Ilmu Alqur'an dan Tafsir",
    "S1 Pendidikan Agama Islam",
    "S1 Pendidikan Bahasa Arab",
    "S1 Hukum Keluarga (Ahwal Syakhshiyah)",
    "S1 Manajemen Pendidikan Islam",
    "S1 Pendidikan Guru Madrasah Ibtidaiyah",
    "S1 Ekonomi Syari'ah",
    "S1 Perbankan Syariah"
  ],
  "Teknik": [
    "S1 Teknik Elektro",
    "S1 Teknik Informatika",
    "S1 Teknologi Informasi"
  ],
  "Kesehatan": [
    "S1 Ilmu Keperawatan",
    "D3 Kebidanan",
    "Profesi Ners"
  ],
  "Sosial dan Humaniora": [
    "S1 Ekonomi",
    "S1 Hukum",
    "S1 Pendidikan Matematika",
    "S1 Pendidikan Bahasa Inggris"
  ]
};

export default function PublikAspirasi() {
  const [formData, setFormdata] = useState({
    prodi: "",
    fakultas: "",
    deskripsi_masalah: "",
    foto_bukti: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [availableProdi, setAvailableProdi] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "fakultas") {
      setFormdata((prev) => ({ ...prev, fakultas: value, prodi: "" }));
      setAvailableProdi(FAKULTAS_PRODI[value] || []);
    } else if (name === "foto_bukti") {
      const file = files[0];
      if (file) {
        setFormdata((prev) => ({ ...prev, foto_bukti: file }));
        const reader = new FileReader();
        reader.onloadend = () => setPreviewImage(reader.result);
        reader.readAsDataURL(file);
      }
    } else {
      setFormdata((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = new FormData();
      for (const key in formData) {
        payload.append(key, formData[key]);
      }
      await createPengaduan(payload);
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

  const handleReset = () => {
    setFormdata({ prodi: "", fakultas: "", deskripsi_masalah: "", foto_bukti: null });
    setPreviewImage(null);
    setAvailableProdi([]);
  };

  const handleRemoveImage = () => {
    setFormdata((prev) => ({ ...prev, foto_bukti: null }));
    setPreviewImage(null);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Pengaduan Terkirim!</h2>
          <p className="text-sm text-gray-500 mb-6">
            Pengaduan Anda telah berhasil dikirim. DPM akan menindaklanjuti laporan Anda secepatnya.
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
            Aspirasi & Pengaduan
          </h1>
          <p className="text-blue-200 text-sm text-center sm:text-base max-w-xl mx-auto">
            Laporkan masalah atau keluhan Anda kepada DPM Universitas Nurul Jadid.
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
                  Sampaikan pengaduan Anda dengan jelas dan lengkapi dengan bukti foto jika ada. Pengaduan Anda akan ditindaklanjuti oleh DPM.
                </p>
              </div>

              {/* Fakultas & Prodi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <label htmlFor="fakultas" className="block text-sm font-semibold text-gray-900">
                        Fakultas
                      </label>
                      <p className="text-xs text-gray-500">Pilih fakultas terlebih dahulu</p>
                    </div>
                  </div>
                  <select name="fakultas" id="fakultas" value={formData.fakultas} onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition-all duration-200"
                    required
                  >
                    <option value="">-- Pilih Fakultas --</option>
                    {Object.keys(FAKULTAS_PRODI).map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                      </svg>
                    </div>
                    <div>
                      <label htmlFor="prodi" className="block text-sm font-semibold text-gray-900">
                        Program Studi
                      </label>
                      <p className="text-xs text-gray-500">
                        {formData.fakultas ? "Pilih program studi" : "Pilih fakultas dulu"}
                      </p>
                    </div>
                  </div>
                  <select name="prodi" id="prodi" value={formData.prodi} onChange={handleChange}
                    disabled={!formData.fakultas}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  >
                    <option value="">{formData.fakultas ? "-- Pilih Program Studi --" : "-- Pilih Fakultas Dulu --"}</option>
                    {availableProdi.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Deskripsi Masalah */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <label htmlFor="deskripsi_masalah" className="block text-sm font-semibold text-gray-900">Deskripsi Masalah</label>
                    <p className="text-xs text-gray-500">Jelaskan masalah yang Anda alami</p>
                  </div>
                </div>
                <textarea
                  name="deskripsi_masalah" id="deskripsi_masalah"
                  value={formData.deskripsi_masalah} onChange={handleChange}
                  rows="6"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-4 resize-none transition-all duration-200"
                  placeholder="Jelaskan masalah yang Anda alami secara detail..."
                  required
                />
              </div>

              {/* Foto Bukti */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900">Foto Bukti</label>
                    <p className="text-xs text-gray-500">Upload bukti pendukung (opsional)</p>
                  </div>
                </div>

                {previewImage && (
                  <div className="relative mb-4">
                    <img src={previewImage} alt="Preview" className="w-full h-56 object-cover rounded-lg border-2 border-gray-300"/>
                    <button type="button" onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                    </button>
                  </div>
                )}

                <label htmlFor="foto_bukti"
                  className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-200"
                >
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                    </svg>
                    <p className="text-sm text-gray-500"><span className="font-semibold">Klik untuk upload</span> atau drag and drop</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG atau GIF (Maks. 5MB)</p>
                  </div>
                  <input id="foto_bukti" type="file" name="foto_bukti" accept="image/*" onChange={handleChange} className="hidden"/>
                </label>
              </div>

              {/* Tips */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                <ul className="text-sm text-amber-800 space-y-1">
                  <p className="font-semibold text-amber-800 space-y-1">PASTIKAN PENGADUAN ANDA MEMENUHI KRITERIA BERIKUT:</p>
                  <li>• Jelaskan masalah dengan detail dan kronologis</li>
                  <li>• Sertakan bukti foto jika memungkinkan</li>
                  <li>• Gunakan bahasa yang jelas</li>
                  <li>• Cantumkan informasi lengkap (waktu, tempat, dll)</li>
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
