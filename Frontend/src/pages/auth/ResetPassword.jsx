import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Mengambil token dan email dari URL yang diklik user
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

    try {
      // ⚠️ GANTI URL INI sesuai dengan domain backend Laravel kamu
      const response = await fetch("http://127.0.0.1:8000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ 
          email, 
          token, 
          password, 
          password_confirmation: passwordConfirmation 
        }),
      });
      
      const data = await response.json();

      if (response.ok) {
        setMessage("Password berhasil diubah! Mengalihkan ke login...");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(data.message || "Terjadi kesalahan.");
      }
    } catch (err) {
      setError("Gagal menghubungi server.");
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return <div className="text-center mt-20 text-red-500 font-bold">Akses ditolak. Link reset tidak valid.</div>;
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md p-6 sm:p-8 dark:bg-gray-800 dark:border-gray-700">
          <h1 className="text-xl font-bold leading-tight text-gray-900 md:text-2xl dark:text-white text-center mb-6">
            Buat Password Baru
          </h1>
          
          {message && <div className="text-green-500 text-sm mb-4 text-center">{message}</div>}
          {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Akun Email</label>
              <input type="email" value={email} disabled className="bg-gray-200 border border-gray-300 text-gray-500 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700" />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password Baru (Min. 8 Karakter)</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ulangi Password Baru</label>
              <input type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required minLength={8} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white" />
            </div>
            <button type="submit" disabled={loading} className="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 mt-4">
              {loading ? "Menyimpan..." : "Simpan Password Baru"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}