import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Busi.css";
import "./media-busi.css";
import face from "../assets/img/login-avatar.png";
import { toast } from "react-toastify";

// ✅ Mediastack API Configuration
const API_KEY = "56ed5976ed140580a93a61871fa125bd";
const API_URL = `https://api.mediastack.com/v1/news?access_key=${API_KEY}&categories=business&countries=in&languages=en&limit=25`;

function Headlines() {
    const [headlines, setHeadlines] = useState([]);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const [savedArticles, setSavedArticles] = useState([]);

    // ✅ Get user info from local storage
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    // ✅ Load saved articles for current user
    useEffect(() => {
        if (user) {
            const savedKey = `savedArticles_${user.name}`;
            const saved = JSON.parse(localStorage.getItem(savedKey)) || [];
            setSavedArticles(saved);
        } else {
            setSavedArticles([]);
        }
    }, [user]);

    // ✅ Save article
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

    // ✅ Handle “Read more” click
    const handleReadMore = (e, url) => {
        if (!user) {
            e.preventDefault();
            toast("Please log in to read the article.");
            navigate("/login");
        }
    };

    // ✅ Logout handler
    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("savedArticles");
        setUser(null);
        setSavedArticles([]);
        toast("Logged out successfully");
        navigate("/");
    };

    // ✅ Fetch Business News
    useEffect(() => {
        fetch(API_URL)
            .then((response) => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then((data) => {
                console.log("Business News Response:", data);
                setHeadlines(data.data || []);
            })
            .catch((error) => {
                console.error("Error fetching headlines:", error);
                setError("Failed to load business news. Please try again later.");
            });
    }, []);

    return (
        <div id="container">
            {/* ================== Navbar ================== */}
            <div className="navbar">
                <header>
                    <nav id="search">
                        <ul>
                            <li>
                                <input type="text" placeholder="Search" />
                            </li>
                            <div>
                                <li>
                                    <h1 className="logo">
                                        <Link to="/">
                                            The Press <span className="logo-part">Point</span>
                                        </Link>
                                    </h1>
                                </li>
                            </div>
                            <div>
                                <li>
                                    {user ? (
                                        <span id="logout-button-outer" className="username">
                                            Hi, {user.name}
                                            <i
                                                className="fa-solid fa-right-to-bracket logout-icon"
                                                onClick={handleLogout}
                                                title="Log Out"
                                            ></i>
                                        </span>
                                    ) : (
                                        <Link className="sign-in" id="signin" to="/login">
                                            Sign in
                                        </Link>
                                    )}
                                </li>
                            </div>
                            <div id="right-navbar">
                                <li>
                                    <Link to="/Save" className="save-article">
                                        <i className="fa-solid fa-bookmark"></i>
                                    </Link>
                                    <Link className="signin-icon1" to="/Login">
                                        <img src={face} alt="Login" />
                                    </Link>
                                    <Link className="sub" to="Sub">
                                        Subscribe
                                    </Link>
                                </li>

                                <div
                                    className={`hamburger ${sidebarOpen ? "active" : ""}`}
                                    onClick={toggleSidebar}
                                >
                                    <span className="line"></span>
                                    <span className="line"></span>
                                    <span className="line"></span>
                                </div>

                                {/* Sidebar */}
                                <div className={`sidebar ${sidebarOpen ? "active" : ""}`}>
                                    {user ? (
                                        <div className="sidebar-user">
                                            <span className="sidebar-username">Hi, {user.name}</span>
                                            <i
                                                className="fa-solid fa-right-to-bracket logout-icon"
                                                onClick={handleLogout}
                                                title="Log Out"
                                            ></i>
                                        </div>
                                    ) : (
                                        <Link to="/login">Login</Link>
                                    )}
                                    <Link to="/Save">Saved Articles</Link>
                                    <Link to="/Sub">Subscribe</Link>
                                </div>
                            </div>
                        </ul>
                    </nav>
                </header>

                {/* Navbar Items */}
                <div id="navbar-items">
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/Bus">Business</Link></li>
                        <li><Link to="/Tech">Technology</Link></li>
                        <li><Link to="/Enter">Entertainment</Link></li>
                        <li><Link to="/Sports">Sports</Link></li>
                        <li><Link to="/Science">Science</Link></li>
                        <li><Link to="/Health">Health</Link></li>
                    </ul>
                </div>
            </div>

            {/* ================== News Section ================== */}
            <main id="news-container">
                <h1>Business Headlines</h1>
                <hr className="title-hr" />

                <div id="headlines-container">
                    {error ? (
                        <p>{error}</p>
                    ) : headlines.length > 0 ? (
                        headlines.map((article, index) => (
                            <div key={index} className="headline-item">
                                {/* ✅ Show No Image Available box if image is missing */}
                                {article.image && article.image.startsWith("http") ? (
                                    <img
                                        className="img"
                                        src={article.image}
                                        alt={article.title || "No Title"}
                                        onError={(e) =>
                                        (e.target.src =
                                            "https://via.placeholder.com/400x200?text=No+Image")
                                        }
                                    />
                                ) : (
                                    <div className="no-image">
                                        No Image Available
                                    </div>
                                )}

                                <h2 className="news-title">{article.title}</h2>
                                <p className="description">
                                    {article.description || "No description available."}
                                </p>

                                <div className="article-button">
                                    <p className="readmore-button">
                                        <a
                                            href={article.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => handleReadMore(e, article.url)}
                                        >
                                            Read more
                                        </a>
                                    </p>
                                    <p className="save-for-business">
                                        <button onClick={() => handleSave(article)}>
                                            Save Article
                                        </button>
                                    </p>
                                </div>
                                <hr />
                            </div>
                        ))
                    ) : (
                        <p>No business news available.</p>
                    )}
                </div>
            </main>

            {/* ================== Footer ================== */}
            <div id="footer-first">
                <div className="navbar-items-footer">
                    <p className="footer-logo-name">The Press Point</p>
                    <p className="footer-copyrights">
                        &copy; 2025 The Press Point All Rights Reserved
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Headlines;
