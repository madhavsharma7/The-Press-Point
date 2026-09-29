import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Header = ({ onSearch }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });

  const [savedArticles, setSavedArticles] = useState([]);

  // Sync dark mode class with DOM
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (darkMode) {
      root.classList.add("dark");
      body.classList.add("dark");
      body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      body.classList.remove("dark");
      body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  // Sync user and saved articles count with localStorage
  useEffect(() => {
    const syncState = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        setUser(parsedUser);

        if (parsedUser && parsedUser.name) {
          const savedKey = `savedArticles_${parsedUser.name}`;
          const stored = JSON.parse(localStorage.getItem(savedKey)) || [];
          setSavedArticles(stored);
        } else {
          setSavedArticles([]);
        }
      } catch {
        setUser(null);
        setSavedArticles([]);
      }
    };

    syncState();
    window.addEventListener("storage", syncState);
    window.addEventListener("bookmarkUpdated", syncState);

    return () => {
      window.removeEventListener("storage", syncState);
      window.removeEventListener("bookmarkUpdated", syncState);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("google_token");
    setUser(null);
    setSavedArticles([]);
    toast.success("Logged out successfully");
    window.dispatchEvent(new Event("bookmarkUpdated"));
  };
  const [searchOpen, setSearchOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      if (onSearch) {
        onSearch(inputValue.trim());
      } else {
        navigate(`/?search=${encodeURIComponent(inputValue.trim())}`);
      }
      setSearchOpen(false);
    }
  };

  const handleLogoClick = () => {
    setInputValue("");
    if (onSearch) {
      onSearch("");
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Business", path: "/Bus" },
    { name: "Entertainment", path: "/Enter" },
    { name: "Health", path: "/Health" },
    { name: "Science", path: "/Science" },
    { name: "Sports", path: "/Sports" },
    { name: "Technology", path: "/Tech" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left: Search & Mobile Menu */}
          <div className="flex items-center gap-4 flex-1">
            <button
              className="lg:hidden text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              onClick={() => setSidebarOpen(true)}
            >
              <i className="fa-solid fa-bars text-xl"></i>
            </button>

            <div className="hidden lg:flex items-center relative group">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>

              <div
                className={`absolute left-full ml-2 flex items-center bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden transition-all duration-300 ${
                  searchOpen ? "w-64 opacity-100" : "w-0 opacity-0"
                }`}
              >
                <form onSubmit={handleSearch} className="flex w-full">
                  <input
                    type="text"
                    placeholder="Search news..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full bg-transparent px-4 py-2 text-sm text-slate-900 dark:text-white outline-none placeholder-slate-500"
                  />
                  <button
                    type="submit"
                    className="px-4 text-slate-500 hover:text-indigo-500"
                  >
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Center: Brand Logo */}
          <div className="flex-shrink-0 text-center flex-1 lg:flex-none">
            <Link 
              to="/" 
              onClick={handleLogoClick}
              className="inline-block group transition transform active:scale-95"
              title="The Press Point Home"
            >
              <h1 className="font-headline text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center justify-center gap-2">
                The Press Point
                <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-500 mb-4 inline-block group-hover:scale-125 transition-transform"></span>
              </h1>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-3 md:gap-5 flex-1">
            <button
              onClick={toggleTheme}
              className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Toggle theme"
            >
              <i
                className={`fa-solid ${
                  darkMode ? "fa-sun" : "fa-moon"
                } text-lg`}
              ></i>
            </button>

            <Link
              to="/Save"
              className="relative text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition group"
              title="Saved Articles"
            >
              <i className="fa-regular fa-bookmark text-lg"></i>
              {savedArticles.length > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
                  {savedArticles.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="text-slate-500 hover:text-red-500 transition"
                  title="Sign Out"
                >
                  <i className="fa-solid fa-right-from-bracket"></i>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                Sign In
              </Link>
            )}

            <Link
              to="/Sub"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-sm hover:shadow transition"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Category Nav */}
      <nav className="hidden lg:block border-t border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4 lg:px-8">
          <ul className="flex items-center justify-center space-x-8">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`block py-3 text-sm font-medium uppercase tracking-wider transition border-b-2 ${
                    location.pathname === link.path
                      ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                      : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Search Bar (Expandable) */}
      {searchOpen && (
        <div className="lg:hidden px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
          <form onSubmit={handleSearch} className="flex relative">
            <input
              type="text"
              placeholder="Search news..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-full pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              autoFocus
            />
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          </form>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
          ></div>

          <div className="absolute inset-y-0 left-0 w-3/4 max-w-sm bg-white dark:bg-slate-900 shadow-2xl flex flex-col h-full transform transition-transform duration-300">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <Link
                to="/"
                onClick={() => {
                  setSidebarOpen(false);
                  handleLogoClick();
                }}
                className="font-headline text-xl font-bold text-slate-900 dark:text-white flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                title="The Press Point Home"
              >
                The Press Point
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-500 mb-2 inline-block"></span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-slate-500 hover:text-slate-900 dark:hover:text-white p-2"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Welcome back,
                      </p>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {user.name}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setSidebarOpen(false);
                    }}
                    className="text-slate-500 hover:text-red-500 p-2"
                  >
                    <i className="fa-solid fa-right-from-bracket"></i>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setSidebarOpen(false)}
                  className="block w-full py-2.5 px-4 text-center text-sm font-medium text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm"
                >
                  Sign In
                </Link>
              )}
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-3">
              <div className="space-y-1 mb-6">
                <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Categories
                </p>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                      location.pathname === link.path
                        ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="space-y-1">
                <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Quick Links
                </p>
                <Link
                  to="/Save"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <i className="fa-regular fa-bookmark w-5"></i> Saved Articles
                  {savedArticles.length > 0 && (
                    <span className="ml-auto bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 py-0.5 px-2 rounded-full text-xs">
                      {savedArticles.length}
                    </span>
                  )}
                </Link>
                <Link
                  to="/Sub"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <i className="fa-regular fa-envelope w-5"></i> Subscribe
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
