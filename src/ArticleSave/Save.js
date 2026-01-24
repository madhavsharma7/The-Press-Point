import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Save.css";
import face from "../assets/img/login-avatar.png";
import "./media-save.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { toast } from "react-toastify";

function Save() {
  const [headlines, setHeadlines] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("india");
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [savedArticles, setSavedArticles] = useState([]);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    if (user) {
      const savedKey = `savedArticles_${user.name}`;
      const saved = JSON.parse(localStorage.getItem(savedKey)) || [];
      setSavedArticles(saved);
    } else {
      setSavedArticles([]); // Clear saved articles if no user
    }
  }, [user]);

  const handleReadMore = (e, url) => {
    if (!user) {
      e.preventDefault();
      toast("Please log in to read the article.");
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("savedArticles");
    setUser(null);
    setSavedArticles([]);
    toast("Logged out successfully");
    navigate("/");
  };

  const handleDelete = (url) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast("Please log in first.");
      return;
    }

    const savedKey = `savedArticles_${user.name}`;
    const existingArticles = JSON.parse(localStorage.getItem(savedKey)) || [];
    const updatedArticles = existingArticles.filter((a) => a.url !== url);

    localStorage.setItem(savedKey, JSON.stringify(updatedArticles));
    setSavedArticles(updatedArticles);
    toast("Article deleted successfully!");

    // Also update search results if active
    if (searchQuery) {
      const updatedSearch = updatedArticles.filter((article) =>
        article.title?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setSearchResults(updatedSearch);
    }
  };

  // Low-level Search Logic (Filters Saved Articles)
  useEffect(() => {
    if (headlines.length > 0 && searchQuery.trim() !== "") {
      const filtered = headlines.filter((article) =>
        article.title?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setSearchResults(filtered);
    }
  }, [searchQuery, headlines]);

  const [inputValue, setInputValue] = useState("");

  const handleSearchInput = (e) => {
    setInputValue(e.target.value);
  };

  const triggerSearch = () => {
    const query = inputValue.trim();
    if (query === "") return;

    const filtered = headlines.filter((article) =>
      article.title?.toLowerCase().includes(query.toLowerCase()),
    );

    if (filtered.length === 0) {
      toast.error("News not available");
      return;
    }

    console.log("Searching for:", query);
    setSearchQuery(query);
    setTimeout(() => {
      const element = document.getElementById("search-results-title");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      triggerSearch();
    }
  };

  const isUserSearch = searchQuery !== "india";
  const defaultNews = headlines.filter((article) =>
    article.title?.toLowerCase().includes("india"),
  );

  return (
    <div id="container">
      {/* ================== Navbar ================== */}
      <div className="navbar">
        <div className="navbar-top">
          {/* Search Bar */}
          <div className="navbar-search">
            <i
              className="fa-solid fa-magnifying-glass search-icon"
              title="Search"
              onClick={() => setSearchOpen(!searchOpen)}
            ></i>

            <input
              type="text"
              placeholder="Search news..."
              value={inputValue}
              onChange={handleSearchInput}
              onKeyDown={handleKeyDown}
              className={searchOpen ? "search-input active" : "search-input"}
            />
          </div>

          {/* Logo */}
          <div className="navbar-logo">
            <Link to="/">The Press Point</Link>
          </div>

          {/* User & Actions */}
          <div className="navbar-actions">
            {user ? (
              <div className="user-profile">
                <span className="username" onClick={handleLogout}>
                  Hi, {user.name}
                </span>
                <button
                  className="logout-btn"
                  onClick={handleLogout}
                  title="Log Out"
                >
                  <i className="fa-solid fa-right-from-bracket"></i>
                </button>
              </div>
            ) : (
              <Link className="auth-btn" to="/login">
                Sign In
              </Link>
            )}

            <Link to="/Save" className="action-icon" title="Saved Articles">
              <i className="fa-regular fa-bookmark"></i>
            </Link>

            <button
              className="theme-toggle"
              onClick={toggleTheme}
              title="Switch Theme"
            >
              <i
                className={darkMode ? "fa-solid fa-sun" : "fa-solid fa-moon"}
              ></i>
            </button>

            <Link to="/Sub" className="subscribe-btn">
              Subscribe
            </Link>

            <div
              className={`hamburger ${sidebarOpen ? "active" : ""}`}
              onClick={toggleSidebar}
            >
              <span className="line"></span>
              <span className="line"></span>
              <span className="line"></span>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <div className={`sidebar-home ${sidebarOpen ? "active-home" : ""}`}>
          <div className="sidebar-header-home">
            {user ? (
              <>
                <span className="sidebar-user-home" onClick={handleLogout}>
                  Hi, {user.name}
                </span>
                <button
                  className="logout-btn-sidebar-home"
                  onClick={handleLogout}
                  title="Log Out"
                >
                  <i className="fa-solid fa-right-from-bracket"></i>
                </button>
              </>
            ) : (
              <Link className="login-resp-home" to="/login">
                Log In
              </Link>
            )}
          </div>

          <div className="sidebar-menu"></div>
          <Link to="/" onClick={toggleSidebar}>
            Home
          </Link>
          <Link to="/Bus" onClick={toggleSidebar}>
            Business
          </Link>
          <Link to="/Tech" onClick={toggleSidebar}>
            Technology
          </Link>
          <Link to="/Enter" onClick={toggleSidebar}>
            Entertainment
          </Link>
          <Link to="/Sports" onClick={toggleSidebar}>
            Sports
          </Link>
          <Link to="/Science" onClick={toggleSidebar}>
            Science
          </Link>
          <Link to="/Health" onClick={toggleSidebar}>
            Health
          </Link>
          <Link to="/Save">Saved Articles</Link>
          <Link to="/Sub">Subscribe</Link>
        </div>

        {/* Navbar Navigation Links (Desktop) */}
        <div className="navbar-links">
          <ul>
            <li>
              <Link to="/" data-category="home">
                Home
              </Link>
            </li>
            <li>
              <Link to="/Wor" data-category="world">
                World
              </Link>
            </li>
            <li>
              <Link to="/International" data-category="nation">
                Nation
              </Link>
            </li>
            <li>
              <Link to="/Bus" data-category="business">
                Business
              </Link>
            </li>
            <li>
              <Link to="/Tech" data-category="technology">
                Technology
              </Link>
            </li>
            <li>
              <Link to="/Enter" data-category="entertainment">
                Entertainment
              </Link>
            </li>
            <li>
              <Link to="/Sports" data-category="sports">
                Sports
              </Link>
            </li>
            <li>
              <Link to="/Science" data-category="science">
                Science
              </Link>
            </li>
            <li>
              <Link to="/Health" data-category="health">
                Health
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Saved Articles Section */}
      <main id="news-container">
        {/* Search Results Section */}
        {isUserSearch && (
          <>
            <h1 className="latest-search" id="search-results-title">
              Search Results
            </h1>
            <hr className="title-hr-search" />
            <div id="search-results-box">
              {searchResults.length > 0 ? (
                searchResults.map((article, index) => (
                  <div key={index} className="news-item-search">
                    <div className="img-container-search">
                      <img
                        className="img-news-search"
                        src={
                          article.image ||
                          article.urlToImage ||
                          "https://via.placeholder.com/400x200?text=No+Image"
                        }
                        alt={article.title || "No Title"}
                      />
                    </div>
                    <h2 className="h2-news">{article.title || "Untitled"}</h2>
                    <p className="p-news">
                      {article.description || "No description available."}
                    </p>
                    <div className="article-button-two">
                      <div className="readmore-news-search ">
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => handleReadMore(e, article.url)}
                        >
                          Read more
                        </a>
                      </div>
                      <div
                        className="delete-article"
                        onClick={() => handleDelete(article.url)}
                      >
                        <a>Delete</a>
                      </div>
                    </div>
                    <hr />
                  </div>
                ))
              ) : (
                <p className="news-error">No Search Results Available</p>
              )}
            </div>
          </>
        )}

        <h1>Saved Articles</h1>
        <hr className="title-hr" />
        <div className="articles-grid">
          {savedArticles.length > 0 ? (
            savedArticles.map((article, index) => (
              <div key={index} className="headline-item-save">
                <img
                  className="img-save"
                  src={
                    article.image ||
                    article.urlToImage ||
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={article.title}
                />

                <h2 className="title-save">{article.title}</h2>
                <p className="desc-save">{article.description}</p>
                <div className="article-button-save">
                  <div className="readmore-news-submit">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => handleReadMore(e, article.url)}
                    >
                      Read more
                    </a>
                  </div>
                  <div
                    className="delete-article"
                    onClick={() => handleDelete(article.url)}
                  >
                    <a>Delete</a>
                  </div>
                </div>
                <hr />
              </div>
            ))
          ) : (
            <p className="news-error">No saved articles yet.</p>
          )}
        </div>
      </main>

      {/* Footer */}
      <div id="footers-save">
        <div className="navbar-items-footers-save">
          <p className="footers-logo-save">The Press Point</p>
          <p className="footer-copyright-save">
            &copy; 2025 The Press Point All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
}

export default Save;
