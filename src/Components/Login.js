import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../Components/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ NEW state

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError("");
    setLoading(true); // ✅ start loading

    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("https://skilviu.com/backend/api/v1/login", {
        username: email,
        password: password,
      });

      const { status, data } = response.data;

      if (status) {
        login({
          email: data.email,
          role: data.user_role,
          token: data.token,
        });

        switch (data.user_role) {
          case "Admin":
            navigate("/admindashboard");
            break;
          case "Bdm":
            navigate("/businessdashboard");
            break;
          case "Hrteam":
            navigate("/hrteamdashboard");
            break;
          default:
            setServerError("Unauthorized role");
        }
      } else {
        setServerError("Invalid credentials");
      }
    } catch (error) {
      setServerError("Login failed. Check your credentials or server.");
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login to Your Account</h2>

        {serverError && <p className="text-red-600 text-center mb-4">{serverError}</p>}

        <form onSubmit={handleSubmit} noValidate>
          {/* email */}
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md outline-none focus:ring-2 ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:ring-blue-500`}
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* password */}
          <div className="mb-4 relative">
            <label htmlFor="password" className="block font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 pr-10 border rounded-md outline-none focus:ring-2 ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:ring-blue-500`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-9 right-3 text-gray-600 cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* remember me */}
          <div className="flex items-center justify-between mb-6">
            <label className="inline-flex items-center text-sm">
              <input type="checkbox" className="form-checkbox text-blue-600" />
              <span className="ml-2">Remember me</span>
            </label>
          </div>

          {/* login button with spinner */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center bg-blue-600 text-white font-medium py-2 rounded transition ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
