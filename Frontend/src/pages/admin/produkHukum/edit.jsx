import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showProdukHukum, updateProdukHukum } from "../../../_sevices/produkhukum";

export default function ProdukHukumEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormdata] = useState({
    judul: "",
    abstract: "",
    status: "",
    tanggal_ditetapkan: "",
    file: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      const produkHukumData = await showProdukHukum(id);

      // showProdukHukum sudah unwrap .data di service,
      // jadi langsung akses propertinya tanpa .data lagi
      setFormdata({
        judul: produkHukumData.judul ?? "",
        abstract: produkHukumData.abstract ?? "",
        status: produkHukumData.status ?? "",
        tanggal_ditetapkan: produkHukumData.tanggal_ditetapkan ?? "",
        file: produkHukumData.file ?? null,
        _method: "PUT",
      });
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      setFormdata((prev) => ({ ...prev, file: files[0] }));
    } else {
      setFormdata((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      for (const key in formData) {
        if (key === "file") {
          if (formData.file instanceof File) {
            payload.append("file", formData.file);
          }
        } else {
          payload.append(key, formData[key]);
        }
      }
      await updateProdukHukum(id, payload);
      navigate("/admin/produkhukum");
    } catch (error) {
      console.log(error);
      alert("Gagal menyimpan perubahan");
    }
  };

  const handleReset = () => {
    setFormdata({
      judul: "",
      abstract: "",
      status: "",
      tanggal_ditetapkan: "",
      file: null,
    });
  };

  return (
    <>
      <section className="bg-white dark:bg-gray-900">
        <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Edit Produk Hukum
          </h2>
          <form onSubmit={handleSubmit} onReset={handleReset}>
            <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">

              <div className="w-full">
                <label htmlFor="judul" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Judul
                </label>
                <input
                  type="text"
                  name="judul"
                  id="judul"
                  value={formData.judul}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Judul produk hukum"
                  required
                />
              </div>

              <div className="w-full">
                <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Status
                </label>
                <input
                  type="text"
                  name="status"
                  id="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Status"
                  required
                />
              </div>

              <div className="w-full">
                <label htmlFor="tanggal_ditetapkan" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Tanggal Ditetapkan
                </label>
                <input
                  type="date"
                  name="tanggal_ditetapkan"
                  id="tanggal_ditetapkan"
                  value={formData.tanggal_ditetapkan}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>

              <div className="w-full">
                <label htmlFor="abstract" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Abstract
                </label>
                <textarea
                  name="abstract"
                  id="abstract"
                  value={formData.abstract}
                  onChange={handleChange}
                  rows={4}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Abstract"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="file" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  File {formData.file && !(formData.file instanceof File) && (
                    <span className="ml-2 text-xs text-gray-500 font-normal">
                      (File saat ini: <span className="text-blue-600">{formData.file}</span> — kosongkan jika tidak ingin mengganti)
                    </span>
                  )}
                </label>
                <input
                  type="file"
                  name="file"
                  id="file"
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

            </div>

            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Simpan
              </button>
              <button
                type="reset"
                className="text-gray-600 inline-flex items-center hover:text-white border border-gray-600 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-gray-500 dark:text-gray-500 dark:hover:text-white dark:hover:bg-gray-600"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}