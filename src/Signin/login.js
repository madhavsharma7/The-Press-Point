import { useState } from "react";
import "./login.css";
import "./media-login.css";
import { useNavigate } from 'react-router-dom';

const AuthContainer = () => {
  const [isActive, setIsActive] = useState(false);
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('https://the-press-point.onrender.com/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      console.log('✅ Signup success', data);
    } else {
      console.error('❌ Signup failed', data.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setLoginEmail('');
        setLoginPassword('');
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate('/'); // redirect to homepage
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error connecting to server');
    }
  };

  return (
    <div id="main">
      <div className={isActive ? "container active" : "container"}>
        {/* Sign Up Form */}
        <div className="form-container sign-up">
          <form onSubmit={handleSignup}>
            <h1>Create Account</h1>
            <div className="social-icons">
              <a className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
              <a className="icon"><i className="fa-brands fa-facebook-f"></i></a>
              <a className="icon"><i className="fa-brands fa-github"></i></a>
              <a className="icon"><i className="fa-brands fa-linkedin-in"></i></a>
            </div>
            <span>or use your email for registration</span>
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
            <h1>Sign In</h1>
            <div className="social-icons">
              <a className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
              <a className="icon"><i className="fa-brands fa-facebook-f"></i></a>
              <a className="icon"><i className="fa-brands fa-github"></i></a>
              <a className="icon"><i className="fa-brands fa-linkedin-in"></i></a>
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
            <a className="forget" href="#">Forget Your Password?</a>
            <button type="submit">Sign In</button>
            {message && <p className="message">{message}</p>}
          </form>
        </div>

        {/* Toggle Section */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all of site features</p>
              <button className="hidden" onClick={() => setIsActive(false)}>Sign In</button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>Register with your personal details to use all of site features</p>
              <button className="hidden" onClick={() => setIsActive(true)}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;