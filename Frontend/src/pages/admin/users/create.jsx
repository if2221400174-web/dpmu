import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userCreate, verifyOtpCreate } from "../../../_sevices/auth";

export default function CreateUser() {
  const [formData, setFormdata] = useState({
    email: "",
    password: "",
    role: "admin", // Default role
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  // STATE BARU UNTUK SISTEM OTP
  const [step, setStep] = useState(1); // 1 = Input Form, 2 = Input OTP
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata({
      ...formData,
      [name]: value,
    });
  };

  // STEP 1: Meminta Kode OTP
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage(""); 

    try {
      const response = await userCreate(formData);
      
      // Jika Backend memberikan sinyal butuh OTP, pindah ke layar Step 2
      if (response.require_otp) {
        setSuccessMessage("✅ " + response.message);
        setStep(2); // Pindah ke input OTP
      }

    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.message || "Terjadi kesalahan validasi data.");
      } else {
        alert("Gagal menghubungi server.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: Memverifikasi OTP dan Menyimpan ke Database
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");
    
    try {
      // Kirim email dan OTP ke Backend untuk dicek
      await verifyOtpCreate({ email: formData.email, otp: otp });
      
      setSuccessMessage("✅ Berhasil! Email asli, user telah tersimpan permanen di database.");
      
      setTimeout(() => {
        navigate("/admin/users");
      }, 3000);

    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.message || "Kode OTP Salah atau sudah kedaluwarsa.");
      } else {
        alert("Gagal memverifikasi OTP.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormdata({ email: "", password: "", role: "admin" });
    setShowPassword(false);
    setSuccessMessage("");
    setStep(1);
    setOtp("");
  };

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-2xl px-4 py-6 mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Tambah User Baru
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Buat akun pengguna baru untuk sistem (Wajib Email Asli)
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/users")}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            
            {/* Notifikasi Global */}
            {successMessage && (
              <div className="m-6 mb-0 bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 flex items-center gap-3 shadow-sm transition-all duration-500 ease-in-out">
                <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium">{successMessage}</p>
              </div>
            )}

            {/* ======================= */}
            {/* TAMPILAN STEP 1: FORM   */}
            {/* ======================= */}
            {step === 1 && (
              <form onSubmit={handleSubmitForm} onReset={handleReset}>
                <div className="p-6 space-y-6">
                  
                  {/* Info Box */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex gap-3">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                          Sistem Validasi OTP Aktif
                        </h3>
                        <p className="text-sm text-blue-800 dark:text-blue-400">
                          Data tidak akan disimpan ke Database sebelum alamat email dibuktikan menggunakan kode OTP.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Email Input */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 transition-all duration-200"
                      placeholder="contoh@example.com"
                      required
                    />
                  </div>

                  {/* Password Input */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 pr-12 dark:bg-gray-700 transition-all duration-200"
                        placeholder="Minimal 8 karakter"
                        minLength="8"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                      >
                        {showPassword ? "Sembunyikan" : "Lihat"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-900 rounded-lg hover:bg-blue-800 disabled:opacity-75"
                  >
                    {isLoading ? "Mengirim OTP..." : "Kirim OTP Verifikasi"}
                  </button>
                </div>
              </form>
            )}

            {/* ======================= */}
            {/* TAMPILAN STEP 2: OTP    */}
            {/* ======================= */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp}>
                <div className="p-8 space-y-6 text-center">
                  
                  <div className="inline-block p-4 bg-blue-100 rounded-full text-blue-600 mb-2">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Verifikasi OTP</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Masukkan 6 digit kode yang telah dikirim ke <br/>
                    <strong className="text-blue-600 dark:text-blue-400 text-lg">{formData.email}</strong>
                  </p>

                  <div className="flex justify-center mt-6">
                    <input
                      type="text"
                      maxLength="6"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))} // Hanya terima angka
                      className="text-center tracking-[1em] font-mono text-3xl font-black bg-gray-50 border-2 border-gray-300 text-gray-900 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 block w-2/3 p-4 uppercase dark:bg-gray-700 dark:text-white transition-all shadow-inner"
                      placeholder="••••••"
                      required
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Kode akan kedaluwarsa dalam 10 menit.</p>
                </div>

                <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900"
                  >
                    ← Kembali / Ganti Email
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || otp.length < 6}
                    className="inline-flex items-center gap-2 px-8 py-3 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-75 shadow-lg transform hover:-translate-y-0.5 transition-all"
                  >
                    {isLoading ? "Memverifikasi..." : "Verifikasi & Simpan"}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </section>
    </>
  );
}