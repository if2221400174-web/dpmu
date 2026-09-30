import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showPengaduan, updatePengaduan } from "../../../_sevices/pengaduans";
import { pengaduanImageStorage } from "../../../_api";

// Data Fakultas dan Prodi
const FAKULTAS_PRODI = {
  "Program Pascasarjana": [
    "S2 Pendidikan Agama Islam",
    "S2 Manajemen Pendidikan Islam",
    "S3 Studi Islam"
  ],
  "Fakultas Agama Islam": [
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
  "Fakultas Teknik": [
    "S1 Teknik Elektro",
    "S1 Teknik Informatika",
    "S1 Teknologi Informasi"
  ],
  "Fakultas Kesehatan": [
    "S1 Ilmu Keperawatan",
    "D3 Kebidanan",
    "Profesi Ners"
  ],
  "Fakultas Sosial dan Humaniora": [
    "S1 Ekonomi",
    "S1 Hukum",
    "S1 Pendidikan Matematika",
    "S1 Pendidikan Bahasa Inggris"
  ]
};

export default function PengaduanEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormdata] = useState({
    prodi: "",
    fakultas: "",
    deskripsi_masalah: "",
    foto_bukti: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [availableProdi, setAvailableProdi] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pengaduanData] = await Promise.all([showPengaduan(id)]);

        console.log("pengaduanData:", pengaduanData);

        setFormdata({
          prodi: pengaduanData.data.prodi,
          fakultas: pengaduanData.data.fakultas,
          deskripsi_masalah: pengaduanData.data.deskripsi_masalah,
          foto_bukti: null,
          _method: "PUT",
        });

        // Set available prodi berdasarkan fakultas yang ada
        if (pengaduanData.data.fakultas) {
          setAvailableProdi(FAKULTAS_PRODI[pengaduanData.data.fakultas] || []);
        }

        // Set existing image for preview
        if (pengaduanData.data.foto_bukti) {
          setExistingImage(`${pengaduanImageStorage}/${pengaduanData.data.foto_bukti}`);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Gagal memuat data");
        navigate("/admin/pengaduan");
      }
    };

    fetchData();
  }, [id, navigate]);

  console.log("form data", formData);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "fakultas") {
      // Update fakultas dan reset prodi
      setFormdata({
        ...formData,
        fakultas: value,
        prodi: "" // Reset prodi saat fakultas berubah
      });
      // Set available prodi berdasarkan fakultas yang dipilih
      setAvailableProdi(FAKULTAS_PRODI[value] || []);
    } else if (name === "foto_bukti") {
      const file = files[0];
      if (file) {
        setFormdata({
          ...formData,
          foto_bukti: file,
        });
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormdata({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      for (const key in formData) {
        if (key === "foto_bukti") {
          if (formData.foto_bukti instanceof File) {
            payload.append("foto_bukti", formData.foto_bukti);
          }
        } else {
          payload.append(key, formData[key]);
        }
      }

      await updatePengaduan(id, payload);
      navigate("/admin/pengaduan");
    } catch (error) {
      console.log(error);
      alert("edit pengaduan error");
    }
  };

  const handleReset = () => {
    setFormdata({
      prodi: "",
      fakultas: "",
      deskripsi_masalah: "",
      foto_bukti: null,
    });
    setPreviewImage(null);
    setAvailableProdi([]);
  };

  const handleRemoveImage = () => {
    setFormdata({
      ...formData,
      foto_bukti: null,
    });
    setPreviewImage(null);
  };

  if (isLoading) {
    return (
      <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Memuat data...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-4xl px-4 py-6 mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Edit Pengaduan
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Perbarui data pengaduan Anda
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/pengaduan")}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
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
                    <svg
                      className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                        Mode Edit
                      </h3>
                      <p className="text-sm text-blue-800 dark:text-blue-400">
                        Anda sedang mengedit data pengaduan. Pastikan perubahan sudah sesuai sebelum menyimpan.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fakultas & Prodi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Fakultas - Pilih Dulu */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <svg
                          className="w-5 h-5 text-purple-600 dark:text-purple-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <label
                          htmlFor="fakultas"
                          className="block text-sm font-semibold text-gray-900 dark:text-white"
                        >
                          Fakultas <span className="text-red-500">*</span>
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Pilih fakultas terlebih dahulu
                        </p>
                      </div>
                    </div>
                    <select
                      name="fakultas"
                      id="fakultas"
                      value={formData.fakultas}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-all duration-200"
                      required
                    >
                      <option value="">-- Pilih Fakultas --</option>
                      {Object.keys(FAKULTAS_PRODI).map((fakultas) => (
                        <option key={fakultas} value={fakultas}>
                          {fakultas}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Prodi - Muncul Setelah Fakultas Dipilih */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <svg
                          className="w-5 h-5 text-blue-600 dark:text-blue-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                      </div>
                      <div>
                        <label
                          htmlFor="prodi"
                          className="block text-sm font-semibold text-gray-900 dark:text-white"
                        >
                          Program Studi <span className="text-red-500">*</span>
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formData.fakultas ? "Pilih program studi" : "Pilih fakultas terlebih dahulu"}
                        </p>
                      </div>
                    </div>
                    <select
                      name="prodi"
                      id="prodi"
                      value={formData.prodi}
                      onChange={handleChange}
                      disabled={!formData.fakultas}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      required
                    >
                      <option value="">
                        {formData.fakultas ? "-- Pilih Program Studi --" : "-- Pilih Fakultas Dulu --"}
                      </option>
                      {availableProdi.map((prodi) => (
                        <option key={prodi} value={prodi}>
                          {prodi}
                        </option>
                      ))}
                    </select>
                    {!formData.fakultas && (
                      <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Pilih fakultas terlebih dahulu
                      </p>
                    )}
                  </div>
                </div>

                {/* Deskripsi Masalah */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                      <svg
                        className="w-5 h-5 text-red-600 dark:text-red-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <label
                        htmlFor="deskripsi_masalah"
                        className="block text-sm font-semibold text-gray-900 dark:text-white"
                      >
                        Deskripsi Masalah
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Jelaskan masalah yang Anda alami
                      </p>
                    </div>
                  </div>
                  <textarea
                    name="deskripsi_masalah"
                    id="deskripsi_masalah"
                    value={formData.deskripsi_masalah}
                    onChange={handleChange}
                    rows="6"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-all duration-200 resize-none"
                    placeholder="Jelaskan masalah Anda secara detail..."
                    required
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {formData.deskripsi_masalah.length} karakter
                  </p>
                </div>

                {/* Foto Bukti */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <svg
                        className="w-5 h-5 text-green-600 dark:text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                        Foto Bukti
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Upload bukti baru (opsional)
                      </p>
                    </div>
                  </div>

                  {/* Preview Image */}
                  {(previewImage || existingImage) && (
                    <div className="relative mb-4">
                      <img
                        src={previewImage || existingImage}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-lg"
                        title="Remove Image"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Upload Button */}
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="foto_bukti"
                      className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 transition-all duration-200"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-10 h-10 mb-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG or GIF (MAX. 5MB)
                        </p>
                      </div>
                      <input
                        id="foto_bukti"
                        type="file"
                        name="foto_bukti"
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Warning Box */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <div className="flex gap-3">
                    <svg
                      className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-300 mb-1">
                        Perhatian
                      </h3>
                      <p className="text-sm text-amber-800 dark:text-amber-400">
                        Perubahan yang Anda simpan akan menggantikan data sebelumnya. Pastikan data yang Anda masukkan sudah benar.
                      </p>
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
                    <path
                      fillRule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Reset
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-900 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-900 dark:hover:bg-blue-800 dark:focus:ring-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Simpan
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
