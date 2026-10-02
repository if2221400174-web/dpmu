import { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom"; // <-- Tambahan Link & params
import { login, useDecodeToken } from "../../_sevices/auth";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Menangkap pesan sukses dari URL (contoh: /login?verified=true)
  const verified = searchParams.get("verified");

  const token = localStorage.getItem("accessToken");
  const decodedData = useDecodeToken(token);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await login(formData);

      // Cek pengarahan pada laman admin setelah login
      if (response.user.role === "admin") {
        localStorage.setItem("accessToken", response.token);
        localStorage.setItem("userInfo", JSON.stringify(response.user));
        return navigate("/admin");
      } else {
        localStorage.setItem("accessToken", response.token);
        localStorage.setItem("userInfo", JSON.stringify(response.user));
        return navigate("/");
      }
    } catch (error) {
      // Menangkap error dari backend dengan lebih akurat
      setError(error?.response?.data?.message || "Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && decodedData && decodedData.success) {
      navigate("/admin");
    }
  }, [token, decodedData, navigate]);

  return (
    <>
      {/* Background Gradient Halus */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 min-h-screen flex items-center justify-center p-4">
        
        {/* Card Login */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl dark:bg-gray-800 dark:border-gray-700 overflow-hidden border border-gray-100">
          <div className="p-8 space-y-6">
            
            {/* Bagian Header (Logo & Teks) */}
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="p-3 bg-blue-50 rounded-full dark:bg-gray-700">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" // Ganti dengan URL/logo kamu
                  alt="Logo"
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
                Selamat Datang
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Silakan login untuk masuk ke dasbor DPM
              </p>
            </div>

            {/* Notifikasi Email Sukses Diverifikasi */}
            {verified && (
              <div className="p-3 text-sm font-medium text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800 text-center border border-green-200 animate-pulse">
                Email berhasil diverifikasi! Silakan login.
              </div>
            )}

            {/* Notifikasi Error (Gagal Login / Belum Verifikasi) */}
            {error && (
              <div className="p-3 text-sm font-medium text-red-600 bg-red-50 rounded-lg dark:bg-red-900/30 dark:text-red-400 text-center border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" action="#">
              {/* Input Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Alamat Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="nama@email.com"
                  required=""
                />
              </div>

              {/* Input Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Password
                  </label>
                  
                  {/* TOMBOL LUPA PASSWORD */}
                  <Link 
                    to="/forgot-password" 
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 transition-all"
                  >
                    Lupa password?
                  </Link>
                </div>
                
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  required=""
                />
              </div>

              {/* Tombol Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center transition-all duration-200 transform hover:scale-[1.02] shadow-md dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-70 disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </>
                ) : (
                  "Masuk ke Akun"
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}