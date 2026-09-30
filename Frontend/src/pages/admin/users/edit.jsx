import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showUser, updateUser } from "../../../_sevices/auth";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [UserData] = await Promise.all([showUser(id)]);

        console.log("UserData:", UserData);

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

  console.log("form data", formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Only include password if user wants to update it
      const submitData = { ...formData };
      if (!updatePassword || !submitData.password) {
        delete submitData.password;
      }

      await updateUser(id, submitData);
      console.log("User updated:", submitData);
      navigate("/admin/users");
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Validation errors:", error.response.data);
        alert(JSON.stringify(error.response.data.message));
      } else {
        console.error(error);
        alert("edit user error");
      }
    }
  };

  const handleReset = () => {
    setFormdata({
      email: "",
      password: "",
      role: "user",
    });
    setShowPassword(false);
    setUpdatePassword(false);
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
        <div className="max-w-2xl px-4 py-6 mx-auto">
          {/* Header */}
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
                        Anda sedang mengedit data user. Kosongkan password jika tidak ingin mengubahnya.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <svg
                        className="w-5 h-5 text-blue-600 dark:text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-gray-900 dark:text-white"
                      >
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Email untuk login user
                      </p>
                    </div>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-all duration-200"
                    placeholder="contoh@example.com"
                    required
                  />
                </div>

                {/* Update Password Toggle */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <input
                    type="checkbox"
                    id="updatePassword"
                    checked={updatePassword}
                    onChange={(e) => setUpdatePassword(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="updatePassword"
                    className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
                  >
                    Update Password
                  </label>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    (Centang jika ingin mengubah password)
                  </span>
                </div>

                {/* Password - Only show if updatePassword is checked */}
                {updatePassword && (
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
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <label
                          htmlFor="password"
                          className="block text-sm font-semibold text-gray-900 dark:text-white"
                        >
                          Password Baru <span className="text-red-500">*</span>
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Minimal 8 karakter
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3 pr-12 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-all duration-200"
                        placeholder="Masukkan password baru"
                        minLength="8"
                        required={updatePassword}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                            />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {formData.password.length} karakter
                    </p>
                  </div>
                )}

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
                        Perubahan yang Anda simpan akan menggantikan data sebelumnya.
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
