import { useState, useRef, useEffect } from "react";
import "./login.css"; // Add a CSS file for styling if needed
import "./media.css";

const AuthContainer = () => {
  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef(null);
  const registerBtnRef = useRef(null);
  const loginBtnRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const registerBtn = registerBtnRef.current;
    const loginBtn = loginBtnRef.current;

    const handleRegisterClick = () => container.classList.add("active");
    const handleLoginClick = () => container.classList.remove("active");

    registerBtn.addEventListener("click", handleRegisterClick);
    loginBtn.addEventListener("click", handleLoginClick);

    return () => {
      registerBtn.removeEventListener("click", handleRegisterClick);
      loginBtn.removeEventListener("click", handleLoginClick);
    };
  }, []);

  return (
    <div id="main">
    <div ref={containerRef} className={isActive ? "container active" : "container"}>
      <div className="form-container sign-up">
        <form>
          <h1>Create Account</h1>
          <div className="social-icons">
            <a href="#" className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
            <a href="#" className="icon"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#" className="icon"><i className="fa-brands fa-github"></i></a>
            <a href="#" className="icon"><i className="fa-brands fa-linkedin-in"></i></a>
          </div>
          <span>or use your email for registration</span>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button>Sign Up</button>
        </form>
      </div>

      <div className="form-container sign-in">
        <form className="form-signin">
          <h1>Sign In</h1>
          <div className="social-icons">
            <a href="#" className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
            <a href="#" className="icon"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#" className="icon"><i className="fa-brands fa-github"></i></a>
            <a href="#" className="icon"><i className="fa-brands fa-linkedin-in"></i></a>
          </div>
          <span>or use your email password</span>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <a className="forget" href="#">Forget Your Password?</a>
          <button>Sign In</button>
        </form>
      </div>

      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of site features</p>
            <button ref={loginBtnRef} className="hidden">Sign In</button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Hello, Friend!</h1>
            <p>Register with your personal details to use all of site features</p>
            <button ref={registerBtnRef} className="hidden">Sign Up</button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AuthContainer;
