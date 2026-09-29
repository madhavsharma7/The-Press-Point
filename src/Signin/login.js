import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { toast } from "react-toastify";

const AuthContainer = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const API_BASE = "https://the-press-point.onrender.com";

  // Check URL params for user data (OAuth redirect)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get("user");
    const emailParam = params.get("email");

    if (userParam && emailParam) {
      const userData = { name: userParam, email: emailParam };
      localStorage.setItem("user", JSON.stringify(userData));
      window.dispatchEvent(new Event("storage"));
      window.history.replaceState({}, document.title, "/");
      navigate("/");
    }
  }, [navigate]);

  // Google Sign-In setup
  useEffect(() => {
    const initGoogleAuth = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id:
            "98047572173-vcdm3gt2mbfa29og5t6ba576oti1cgpe.apps.googleusercontent.com",
          callback: (response) => {
            const decoded = jwtDecode(response.credential);
            const userData = { name: decoded.name, email: decoded.email };

            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("google_token", response.credential);
            window.dispatchEvent(new Event("storage"));

            toast.success(`Welcome back, ${decoded.name}!`);
            navigate("/", { replace: true });
          },
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-btn-login"),
          { theme: "outline", size: "large", width: 280, shape: "pill" },
        );
        window.google.accounts.id.renderButton(
          document.getElementById("google-btn-signup"),
          { theme: "outline", size: "large", width: 280, shape: "pill" },
        );
      }
    };

    // Small delay to ensure google script is loaded
    const timeoutId = setTimeout(initGoogleAuth, 500);
    return () => clearTimeout(timeoutId);
  }, [navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPassword,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Signup successful! Please sign in.");
        setIsSignUp(false);
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("storage"));
        toast.success(`Welcome back, ${data.user.name}!`);
        navigate("/");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Main Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden relative min-h-[550px] transition-all duration-500">
            {/* ---------------- LOGIN FORM ---------------- */}
            <div
              className={`absolute inset-0 p-8 md:p-10 flex flex-col justify-center transition-all duration-500 transform ${
                isSignUp
                  ? "-translate-x-full opacity-0 pointer-events-none"
                  : "translate-x-0 opacity-100"
              }`}
            >
              <h2 className="text-3xl font-headline font-bold text-slate-900 dark:text-white mb-2 text-center">
                Welcome Back
              </h2>
              <p className="text-slate-500 text-sm text-center mb-8">
                Sign in to continue to The Press Point.
              </p>

              <div
                className="flex justify-center mb-6"
                id="google-btn-login"
              ></div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-slate-900 text-slate-500">
                    Or continue with email
                  </span>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md transition disabled:opacity-70 flex justify-center items-center"
                >
                  {loading ? (
                    <i className="fa-solid fa-spinner fa-spin"></i>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
                Don't have an account?{" "}
                <button
                  onClick={() => setIsSignUp(true)}
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  Sign up
                </button>
              </p>
            </div>

            {/* ---------------- SIGNUP FORM ---------------- */}
            <div
              className={`absolute inset-0 p-8 md:p-10 flex flex-col justify-center transition-all duration-500 transform ${
                !isSignUp
                  ? "translate-x-full opacity-0 pointer-events-none"
                  : "translate-x-0 opacity-100"
              }`}
            >
              <h2 className="text-3xl font-headline font-bold text-slate-900 dark:text-white mb-2 text-center">
                Create Account
              </h2>
              <p className="text-slate-500 text-sm text-center mb-8">
                Join The Press Point for verified news.
              </p>

              <div
                className="flex justify-center mb-6"
                id="google-btn-signup"
              ></div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-slate-900 text-slate-500">
                    Or register with email
                  </span>
                </div>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md transition disabled:opacity-70 mt-2 flex justify-center items-center"
                >
                  {loading ? (
                    <i className="fa-solid fa-spinner fa-spin"></i>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                Already have an account?{" "}
                <button
                  onClick={() => setIsSignUp(false)}
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AuthContainer;
