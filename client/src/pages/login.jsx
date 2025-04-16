import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true); // Start loading

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${apiUrl}/login`, { email, password });
      const { token, user } = response.data;

      // Save user data
      localStorage.setItem("token", token);
      localStorage.setItem("userName", user.name);

      // Determine redirection path
      const redirectPath = new URLSearchParams(location.search).get("redirect") || "/";
      navigate(redirectPath, { state: { fromLogin: true } });
      window.location.reload();
    } catch (err) {
      console.error("Login error response:", err.response?.data);
      setError(err.response?.data?.error || "An error occurred.");
    } finally {
      setLoading(false); // Stop loading
    }
  };



  return (
    <section>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Log in to your account
            </h1>
            {error && (
              <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800 animate-pulse" role="alert">
                {error}
              </div>
            )}
            <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required
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
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                disabled={loading} // Disable button while loading
              >
                {loading ? "Logging in..." : "Log in"} {/* Show loading text */}
              </button>
            </form>
            {/*<div className="mt-4">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => setError("Google Sign-In failed. Please try again.")}
              />
            </div>*/}
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Don’t have an account?{" "}
              <a
                href="/register"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
