import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showUser, updateUser, verifyOtpUpdate } from "../../../_sevices/auth";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormdata] = useState({
    email: "",
    password: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [updatePassword, setUpdatePassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // STATE BARU UNTUK SISTEM OTP
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [UserData] = await Promise.all([showUser(id)]);

        setFormdata({
          email: UserData.data.email,
          password: "",
          role: UserData.data.role || "user",
          _method: "PUT",
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Gagal memuat data");
        navigate("/admin/users");
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata({
      ...formData,
      [name]: value,
    });
  };

  // STEP 1: Mengirim Data (Atau meminta OTP jika Ganti Email)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage("");

    try {
      const submitData = { ...formData };
      if (!updatePassword || !submitData.password) {
        delete submitData.password;
      }

      const response = await updateUser(id, submitData);
      
      // Jika Backend minta OTP (karena email diubah)
      if (response.require_otp) {
        setSuccessMessage("✅ " + response.message);
        setStep(2); // Pindah ke layar OTP
      } else {
        // Jika email TIDAK diubah, maka langsung tersimpan permanen
        setSuccessMessage("✅ " + response.message);
        setTimeout(() => {
          navigate("/admin/users");
        }, 3000);
      }

    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.message || "Terjadi kesalahan validasi data.");
      } else {
        alert("Gagal menghubungi server.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // STEP 2: Memverifikasi OTP dan Update ke Database
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage("");
    
    try {
      await verifyOtpUpdate(id, { otp: otp });
      
      setSuccessMessage("✅ Berhasil! Perubahan telah disimpan permanen di database.");
      
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
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFormdata({
      ...formData,
      password: "",
    });
    setShowPassword(false);
    setUpdatePassword(false);
    setSuccessMessage("");
    setStep(1);
    setOtp("");
  };

  if (isLoading) {
    return (
      <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Memuat data user...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-2xl px-4 py-6 mx-auto">
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Edit User
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Perbarui informasi akun user
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/users")}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
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
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex gap-3">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                          Mode Edit Terproteksi
                        </h3>
                        <p className="text-sm text-blue-800 dark:text-blue-400">
                          Jika Anda mengganti alamat Email, sistem akan meminta verifikasi OTP sebelum perubahan disimpan.
                        </p>
                      </div>
                    </div>
                  </div>

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
                      required
                    />
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200">
                    <input
                      type="checkbox"
                      id="updatePassword"
                      checked={updatePassword}
                      onChange={(e) => setUpdatePassword(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <label htmlFor="updatePassword" className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                      Update Password
                    </label>
                  </div>

                  {updatePassword && (
                    <div>
                      <label htmlFor="password" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Password Baru <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 pr-12 dark:bg-gray-700 transition-all duration-200"
                          placeholder="Masukkan password baru"
                          minLength="8"
                          required={updatePassword}
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
                  )}
                </div>

                <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200">
                  <button type="reset" className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-900 rounded-lg hover:bg-blue-800 shadow-md disabled:opacity-75"
                  >
                    {isSaving ? "Memproses..." : "Simpan Perubahan"}
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
                  
                  <div className="inline-block p-4 bg-amber-100 rounded-full text-amber-600 mb-2">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Verifikasi Email Baru</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Sistem mendeteksi perubahan alamat email. Masukkan 6 digit kode OTP yang telah dikirim ke <br/>
                    <strong className="text-blue-600 dark:text-blue-400 text-lg">{formData.email}</strong>
                  </p>

                  <div className="flex justify-center mt-6">
                    <input
                      type="text"
                      maxLength="6"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))} 
                      className="text-center tracking-[1em] font-mono text-3xl font-black bg-gray-50 border-2 border-gray-300 text-gray-900 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 block w-2/3 p-4 uppercase transition-all shadow-inner"
                      placeholder="••••••"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900"
                  >
                    ← Kembali / Batalkan
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving || otp.length < 6}
                    className="inline-flex items-center gap-2 px-8 py-3 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-75 disabled:hover:scale-100"
                  >
                    {isSaving ? "Memverifikasi..." : "Verifikasi & Simpan"}
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