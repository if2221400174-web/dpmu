import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showStrukturDpm, updateStrukturDpm } from "../../../_sevices/strukturdpms";
import { strukturImageStorage } from "../../../_api";

export default function StrukturEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormdata] = useState({
    nama: "",
    jabatan: "",
    foto: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [strukturDpmData] = await Promise.all([showStrukturDpm(id)]);

        console.log("strukturDpmData:", strukturDpmData);

        setFormdata({
          nama: strukturDpmData.data.nama,
          jabatan: strukturDpmData.data.jabatan,
          foto: null,
          _method: "PUT",
        });

        // Set existing image for preview
        if (strukturDpmData.data.foto) {
          setExistingImage(`${strukturImageStorage}/${strukturDpmData.data.foto}`);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Gagal memuat data");
        navigate("/admin/strukturdpm");
      }
    };

    fetchData();
  }, [id, navigate]);

  console.log("form data", formData);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "foto") {
      const file = files[0];
      if (file) {
        setFormdata({
          ...formData,
          foto: file,
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
        if (key === "foto") {
          if (formData.foto instanceof File) {
            payload.append("foto", formData.foto);
          }
        } else {
          payload.append(key, formData[key]);
        }
      }
      await updateStrukturDpm(id, payload);
      navigate("/admin/strukturdpm");
    } catch (error) {
      console.log(error);
      alert("edit struktur error");
    }
  };

  const handleReset = () => {
    setFormdata({
      nama: "",
      jabatan: "",
      foto: null,
    });
    setPreviewImage(null);
  };

  const handleRemoveImage = () => {
    setFormdata({
      ...formData,
      foto: null,
    });
    setPreviewImage(null);
  };

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
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
                Edit Pengurus
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Perbarui data pengurus DPM
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/strukturdpm")}
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Preview Card */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-6">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Preview Profil
                  </h3>
                </div>

                {/* Profile Preview */}
                <div className="p-6">
                  {/* Photo Preview */}
                  <div className="relative mb-4">
                    <div className="w-full h-48 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-lg overflow-hidden">
                      {previewImage || existingImage ? (
                        <img
                          src={previewImage || existingImage}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <span className="text-4xl font-bold text-white">
                              {getInitials(formData.nama)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info Preview */}
                  <div className="text-center space-y-3">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                      {formData.nama || "Nama Pengurus"}
                    </h4>

                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                      <svg
                        className="w-4 h-4 text-blue-600 dark:text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                      </svg>
                      <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                        {formData.jabatan || "Jabatan"}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                      Preview akan update saat Anda mengubah data
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
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
                            Anda sedang mengedit data pengurus. Pastikan perubahan sudah sesuai sebelum menyimpan.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Nama */}
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
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <label
                            htmlFor="nama"
                            className="block text-sm font-semibold text-gray-900 dark:text-white"
                          >
                            Nama Lengkap <span className="text-red-500">*</span>
                          </label>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Nama lengkap pengurus
                          </p>
                        </div>
                      </div>
                      <input
                        type="text"
                        name="nama"
                        value={formData.nama}
                        onChange={handleChange}
                        id="nama"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-all duration-200"
                        placeholder="Contoh: Ahmad Fauzi"
                        required
                      />
                    </div>

                    {/* Jabatan */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <svg
                            className="w-5 h-5 text-blue-600 dark:text-blue-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                              clipRule="evenodd"
                            />
                            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                          </svg>
                        </div>
                        <div>
                          <label
                            htmlFor="jabatan"
                            className="block text-sm font-semibold text-gray-900 dark:text-white"
                          >
                            Jabatan <span className="text-red-500">*</span>
                          </label>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Posisi dalam kepengurusan
                          </p>
                        </div>
                      </div>
                      <input
                        type="text"
                        name="jabatan"
                        id="jabatan"
                        value={formData.jabatan}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-all duration-200"
                        placeholder="Contoh: Ketua DPM"
                        required
                      />
                    </div>

                    {/* Foto */}
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
                            Foto Profil
                          </label>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Upload foto baru (opsional)
                          </p>
                        </div>
                      </div>

                      {/* Preview Current/New */}
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
                          htmlFor="foto"
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
                              PNG, JPG (MAX. 3MB) - Foto formal/profesional
                            </p>
                          </div>
                          <input
                            id="foto"
                            type="file"
                            name="foto"
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
                      Simpan Perubahan
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
