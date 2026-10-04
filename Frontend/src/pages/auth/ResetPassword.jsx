import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Mengambil token dan email dari URL yang diklik user dari dalam emailnya
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    // Validasi Frontend: Pastikan password sama sebelum dikirim ke server
    if (password !== passwordConfirmation) {
      setError("Password Baru dan Ulangi Password Baru tidak sama!");
      setLoading(false);
      return;
    }

    try {
      // Mengarah langsung ke server Azure
      const response = await fetch("https://dpmu-backend-d2gbcvg8deh2egat.southeastasia-01.azurewebsites.net/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ 
          email, 
          token, 
          password 
        }), 
      });
      
      const data = await response.json();

      if (response.ok) {
        setMessage("✅ " + data.message + " Mengalihkan ke login...");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(data.message || "Terjadi kesalahan.");
      }
    } catch (err) {
      setError("Gagal menghubungi server. Pastikan internet stabil.");
    } finally {
      setLoading(false);
    }
  };

  // Jika ada orang iseng mengakses halaman ini tanpa link khusus dari email
  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-lg font-bold shadow-sm border border-red-200">
          Akses ditolak. Link reset tidak valid atau Anda belum meminta Lupa Password.
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-xl shadow-lg dark:border sm:max-w-md p-6 sm:p-8 dark:bg-gray-800 dark:border-gray-700">
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center mb-6">
            Buat Password Baru
          </h1>
          
          {/* Kotak Notifikasi Sukses */}
          {message && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 flex items-center gap-3">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          {/* Kotak Notifikasi Error */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-center gap-3">
              <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">Akun Email</label>
              <input 
                type="email" 
                value={email} 
                disabled 
                className="bg-gray-200 border border-gray-300 text-gray-500 text-sm rounded-lg block w-full p-3 dark:bg-gray-700 dark:border-gray-600 cursor-not-allowed" 
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">Password Baru (Min. 8 Karakter)</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                minLength={8} 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:text-white transition-all"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">Ulangi Password Baru</label>
              <input 
                type="password" 
                value={passwordConfirmation} 
                onChange={(e) => setPasswordConfirmation(e.target.value)} 
                required 
                minLength={8} 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:text-white transition-all"
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full text-white bg-blue-600 hover:bg-blue-700 font-bold rounded-lg text-sm px-5 py-3 shadow-md disabled:opacity-70 mt-2 transition-all"
            >
              {loading ? "Menyimpan..." : "Simpan Password Baru"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}