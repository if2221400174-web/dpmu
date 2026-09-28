import { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";
import { login, useDecodeToken} from "../../_sevices/auth";


export default function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("accessToken");
  const decodedData = useDecodeToken(token)

  const handleChange = (e) => {
    const {name, value} = e.target 

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    setError(null)
    try {
      const response = await login(formData)
      

      //cek pengarahan pada laman admin. setelah login
      if (response.user.role ==="admin") {
        localStorage.setItem("accessToken", response.token)
        localStorage.setItem("userInfo", JSON.stringify(response.user))
        return navigate('/admin')
      } else {
        localStorage.setItem("accessToken", response.token)
        localStorage.setItem("userInfo", JSON.stringify(response.user))
        return navigate('/')
      }

      // return navigate (response.user.role ==="admin" ? "/admin": "/") 

    } catch (error) {
      setError(error?.response?.data?.message)
    } finally{
      setLoading(false)
    }
  }

  console.log(decodedData)
  useEffect(() => {
    if (token && decodedData && decodedData.success) {
      navigate("/admin")
    }
  }, [token, decodedData, navigate])

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">

              {/* Logo di atas form */}
              <div className="flex justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" // Ganti dengan URL/logo kamu
                  alt="Logo"
                  className="w-20 h-20 mb-4"
                />
              </div>

              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
                Login
              </h1>

              {error && (
                <div className="text-red-500 text-sm">{error.message || "email atau pasword salah"}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" action="#">
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required=""
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="*********"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required=""
                  />
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  {loading ? "loading..." : "Sign in"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
