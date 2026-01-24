import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Inter.css";
import "./media-inter.css";
import { Link } from "react-router-dom";
import face from "../assets/img/login-avatar.png";
import { toast } from "react-toastify";

// https://gnews.io/api/v4/top-headlines?category=international&apikey=${API_KEY}

// Replace with your actual API key
const API_KEY = "773dcaa65d9b9a5df06b87e05a18b242";
const API_URL = `https://gnews.io/api/v4/top-headlines?category=international&apikey=${API_KEY}`;

function Headlines() {
    const [headlines, setHeadlines] = useState([]);
    const [searchResults, setSearchResults] = useState([]); // New
    const [searchQuery, setSearchQuery] = useState(""); // New
    const [inputValue, setInputValue] = useState(""); // New
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const [savedArticles, setSavedArticles] = useState([]);

    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });

    const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

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

    const handleSave = (article) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            toast("Please log in to save articles.");
            return;
        }

        const savedKey = `savedArticles_${user.name}`;
        const existingArticles = JSON.parse(localStorage.getItem(savedKey)) || [];

        const isAlreadySaved = existingArticles.some((a) => a.url === article.url);
        if (isAlreadySaved) {
            toast("Article already saved.");
            return;
        }

        const updatedArticles = [...existingArticles, article];
        localStorage.setItem(savedKey, JSON.stringify(updatedArticles));
        toast("Article saved successfully!");
    };

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

    useEffect(() => {
        fetch(API_URL)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("API Response:", data); // Debugging log
                setHeadlines(data.articles || []);
            })
            .catch((error) => {
                console.error("Error fetching headlines:", error);
                setError("Failed to load headlines. Please try again later.");
            });
    }, []); // Runs once when component mounts

    // ✅ Filter logic for search
    useEffect(() => {
        if (headlines.length > 0 && searchQuery.trim() !== "") {
            const filtered = headlines.filter((article) =>
                article.title?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSearchResults(filtered);
        }
    }, [searchQuery, headlines]);

    const handleSearchInput = (e) => {
        setInputValue(e.target.value);
    };

    const triggerSearch = () => {
        const query = inputValue.trim();
        if (query === "") return;

        const filtered = headlines.filter((article) =>
            article.title?.toLowerCase().includes(query.toLowerCase())
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

    const isUserSearch = searchQuery !== "";

    return (
        <div id="container">
            {/* ================== Navbar ================== */}
            <div className="navbar">
                <div className="navbar-top">
                    {/* Search Bar */}
                    <div className="navbar-search">
                        <i
                            className="fa-solid fa-magnifying-glass search-icon"
                            onClick={triggerSearch}
                            title="Search"
                        ></i>
                        <input
                            type="text"
                            placeholder="Search news..."
                            value={inputValue}
                            onChange={handleSearchInput}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    {/* Logo */}
                    <div className="navbar-logo">
                        <Link to="/">
                            The Press Point
                        </Link>
                    </div>

                    {/* User & Actions */}
                    <div className="navbar-actions">
                        {user ? (
                            <div className="user-profile">
                                <span>Hi, {user.name}</span>
                                <button className="logout-btn" onClick={handleLogout} title="Log Out">
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

                        <button className="theme-toggle" onClick={toggleTheme} title="Switch Theme">
                            <i className={darkMode ? "fa-solid fa-sun" : "fa-solid fa-moon"}></i>
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
                <div className={`sidebar ${sidebarOpen ? "active" : ""}`}>
                    <div className="sidebar-header">
                        {user ? <span>Hi, {user.name}</span> : <Link to="/login">Login</Link>}
                        <span className="close-sidebar" onClick={toggleSidebar}>&times;</span>
                    </div>
                    <Link to="/Save">Saved Articles</Link>
                    <Link to="/Sub">Subscribe</Link>
                    <Link to="/" onClick={toggleSidebar}>Home</Link>
                    <Link to="/Wor" onClick={toggleSidebar}>World</Link>
                    <Link to="/International" onClick={toggleSidebar}>Nation</Link>
                    <Link to="/Bus" onClick={toggleSidebar}>Business</Link>
                    <Link to="/Tech" onClick={toggleSidebar}>Technology</Link>
                    <Link to="/Enter" onClick={toggleSidebar}>Entertainment</Link>
                    <Link to="/Sports" onClick={toggleSidebar}>Sports</Link>
                    <Link to="/Science" onClick={toggleSidebar}>Science</Link>
                    <Link to="/Health" onClick={toggleSidebar}>Health</Link>
                    {user && <button className="sidebar-logout" onClick={handleLogout}>Logout</button>}
                </div>

                {/* Navbar Navigation Links (Desktop) */}
                <div className="navbar-links">
                    <ul>
                        <li><Link to="/" data-category="home">Home</Link></li>
                        <li><Link to="/Wor" data-category="world">World</Link></li>
                        <li><Link to="/International" data-category="nation">Nation</Link></li>
                        <li><Link to="/Bus" data-category="business">Business</Link></li>
                        <li><Link to="/Tech" data-category="technology">Technology</Link></li>
                        <li><Link to="/Enter" data-category="entertainment">Entertainment</Link></li>
                        <li><Link to="/Sports" data-category="sports">Sports</Link></li>
                        <li><Link to="/Science" data-category="science">Science</Link></li>
                        <li><Link to="/Health" data-category="health">Health</Link></li>
                    </ul>
                </div>
            </div>

            {/* News Section */}
            <main id="news-container">

                {/* Search Results Section */}
                {isUserSearch && (
                    <>
                        <h1 className="latest-search" id="search-results-title">Search Results</h1>
                        <hr className="title-hr-search" />
                        <div id="search-results-box">
                            {searchResults.length > 0 ? (
                                searchResults.map((article, index) => (
                                    <div key={index} className="news-item-search">
                                        <div className="img-container-search">
                                            <img
                                                className="img-news-search"
                                                src={article.image || article.urlToImage || "https://via.placeholder.com/400x200?text=No+Image"}
                                                alt={article.title || "No Title"}
                                            />
                                        </div>
                                        <h2 className="h2-news">{article.title || "Untitled"}</h2>
                                        <p className="p-news">{article.description || "No description available."}</p>
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
                                            <p className="save-latest-search">
                                                <button onClick={() => handleSave(article)}>Save Article</button>
                                            </p>
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

                <h1>Top Headlines</h1>
                <hr className="title-hr" />
                <div id="headlines-container">
                    {error ? (
                        <p>{error}</p>
                    ) : (
                        headlines.length > 0 ? (
                            headlines.map((article, index) => (
                                <div key={index} className="headline-item">
                                    <img
                                        className="img"
                                        src={article.image || 'fallback-image.jpg'} // Fallback image if none available
                                        alt={article.title}
                                        style={{ width: '100%', maxWidth: '500px' }}
                                    />
                                    <h2 className="title">{article.title}</h2>
                                    <p className="desc">{article.description || "No description available."}</p>

                                    <div className="article-button">
                                        <p className="readmore">
                                            <a
                                                href={article.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => handleReadMore(e, article.url)}
                                            >
                                                Read more
                                            </a>
                                        </p>
                                        <p className="save-for-intern">
                                            <button onClick={() => handleSave(article)}>
                                                Save Article
                                            </button>
                                        </p>
                                    </div>
                                    <hr />
                                </div>
                            ))
                        ) : (
                            <p>No headlines available.</p>
                        )
                    )}
                </div>
            </main>

            {/* Footer */}
            <div id="foot">
                <div className="navbar-items-foot">
                    <p className="foot-logo">The Press Point</p>
                    <p className="foot-copyright">&copy; 2025 The Press Point All Rights Reserved</p>
                </div>
            </div>
        </div>
    );
}

export default Headlines;
