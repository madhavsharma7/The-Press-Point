import { useState, useEffect } from "react";
import "./login.css";
import "./media-login.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContainer = () => {
  const [isActive, setIsActive] = useState(false);
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const API_BASE = "https://the-press-point.onrender.com";
 
  // Initialize Google Sign-In
  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id:
        "98047572173-vcdm3gt2mbfa29og5t6ba576oti1cgpe.apps.googleusercontent.com",
      callback: handleGoogleLogin,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-btn"),
      {
        theme: "outline",
        size: "large",
        shape: "pill",
        text: "signin_with",
      }
    );
  }, []);

  // Handle Google Sign-In
  const handleGoogleLogin = (response) => {
    console.log("✅ Google Token:", response.credential);

    const decoded = jwtDecode(response.credential); // ✅ Fixed function call
    console.log("🔍 Decoded Google User:", decoded);

    const { name: userName, email: userEmail } = decoded;

    localStorage.setItem("user", JSON.stringify({ name: userName, email: userEmail }));
    localStorage.setItem("google_token", response.credential);
  
    localStorage.setItem("google_token", response.credential);
    navigate("/", { replace: true });
  };

  // After successful login or redirect

  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!signupName || !signupEmail || !signupPassword) {
      setMessage("Please fill in all fields.");
      return;
    }

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
        setMessage(data.message);
        setSignupName("");
        setSignupEmail("");
        setSignupPassword("");
        setIsActive(false);
      } else {
        setMessage(data.message || "Signup failed");
      }
    } catch {
      setMessage("Error connecting to server");
    }
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!loginEmail || !loginPassword) {
      setMessage("Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/", { replace: true });
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch {
      setMessage("Error connecting to server");
    }
  };

  // Handle GitHub Login
  const handleGitHubLogin = () => {

    window.location.href = `http://localhost:5000/auth/github`;
  };

  return (
    <div id="main">
      <div className={isActive ? "container active" : "container"}>
        {/* Sign Up Form */}
        <div className="form-container sign-up">
          <form onSubmit={handleSignup}>
            <h1>Create Account</h1>
            <input
              type="text"
              placeholder="Name"
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              required
            />
            <button type="submit">Sign Up</button>
            {message && <p className="message">{message}</p>}
          </form>
        </div>

        {/* Sign In Form */}
        <div className="form-container sign-in">
          <form onSubmit={handleLogin}>
            <h1 className="signin-topic">Sign In</h1>
            <div className="social-icons">
              <div id="google-btn" className="google-signin-btn"></div>
              <div className="signingit">
                <button type="button" onClick={handleGitHubLogin}>
                  <i className="fa-brands fa-github"></i>Sign in with GitHub
                </button>
              </div>
            </div>
            <span>or use your email and password</span>
            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
            <button type="submit">Sign In</button>
            {message && <p className="message">{message}</p>}
          </form>
        </div>

        {/* Toggle between Sign Up and Sign In */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all of site features</p>
              <button
                className="hidden"
                type="button"
                onClick={() => setIsActive(false)}
              >
                Sign In
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>Register with your personal details to use all of site features</p>
              <button
                className="hidden"
                type="button"
                onClick={() => setIsActive(true)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;
