import {  useState } from "react";
import { useNavigate } from "react-router-dom";
import { createKeputusan } from "../../../_sevices/Keputusan";

export default function KeputusanCreate() {
  const [formData, setFormdata] = useState({
    judul: "",
    abstract: "",
    tanggal_ditetapkan: "",
    file: null,
});

const navigate =useNavigate();


  const handleChange =(e) => {
    const{name, value, files} = e.target;
    if(name === "file"){
      setFormdata({
        ...formData,
        file:files[0],
      });
    } else {
      setFormdata({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) =>{
    e.preventDefault();

    try{
      const payload = new FormData();
      for (const key in formData){
        payload.append(key, formData[key]);
      }
      await createKeputusan(payload);
      navigate("/admin/Keputusan");
    } catch (error) {
    if (error.response && error.response.data) {
      console.error("Validation errors:", error.response.data);
      alert(JSON.stringify(error.response.data.message));
    } else {
      console.error(error);
      alert("Unexpected error occurred");
    }
  }
  }

  console.log(formData)
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
            Tambah
          </h2>
          <form onSubmit={handleSubmit} onReset={handleReset}>
            <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
              <div className="w-full">
                <label
                  htmlFor="judul"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Judul
                </label>
                <input
                  htmlFor="judul"
                  type="text"
                  name="judul"
                  value={formData.judul}
                  onChange={handleChange}
                  id="judul"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="judul"
                  required
                />
              </div>
              <div className="w-full">
                <label
                    htmlFor="status"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Status
                </label>
                <input
                  htmlFor="status"
                  type="text"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  id="status"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="status"
                  required
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="tanggal_ditetapkan"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Tanggal Ditetapkan
                </label>
                <input
                  htmlFor="tanggal_ditetapkan"
                  type="date"
                  name="tanggal_ditetapkan"
                  value={formData.tanggal_ditetapkan}
                  onChange={handleChange}
                  id="tanggal_ditetapkan"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Tanggal Ditetapkan"
                  required
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="abstract"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Abstract
                </label>
                <textarea
                  htmlFor="abstract"
                  type="text"
                  name="abstract"
                  value={formData.abstract}
                  onChange={handleChange}
                  id="abstract"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="abstract"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="file"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  File
                </label>
                <input
                  type="file"
                  name="file"
                  id="file"
                  accept="image/* "
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 "
                >
                </input>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Simpan
              </button>
              <button
                type="reset"
                className="text-gray-600 inline-flex items-center hover:text-white border border-gray-600 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-gray-500 dark:text-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-900"
              >e
                Bersihkan
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
