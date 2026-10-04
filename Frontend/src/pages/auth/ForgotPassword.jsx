import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      // Mengarah ke server Azure
      const response = await fetch("https://dpmu-backend-d2gbcvg8deh2egat.southeastasia-01.azurewebsites.net/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setEmail(""); // Kosongkan form setelah sukses agar tidak dispam
      } else {
        // Tangkap penolakan dari "Satpam" exists:users,email
        setError(data.message || "Terjadi kesalahan.");
      }
    } catch (err) {
      setError("Gagal menghubungi server. Pastikan internet stabil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-xl shadow-lg dark:border sm:max-w-md p-6 sm:p-8 dark:bg-gray-800 dark:border-gray-700">
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white text-center mb-2">
            Lupa Password
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">
            Masukkan email yang terdaftar dan kami akan mengirimkan link untuk mereset password.
          </p>

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
              <label className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">Email Anda</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:text-white transition-all"
                placeholder="nama@email.com"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full text-white bg-blue-600 hover:bg-blue-700 font-bold rounded-lg text-sm px-5 py-3 shadow-md disabled:opacity-70 transition-all"
            >
              {loading ? "Memeriksa Email..." : "Kirim Link Reset"}
            </button>
            <div className="text-sm text-center mt-6">
              <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-800 hover:underline">
                ← Kembali ke Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}