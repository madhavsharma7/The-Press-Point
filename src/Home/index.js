import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import "./media-home.css";
import face from "../assets/img/login-avatar.png";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { toast } from "react-toastify";

const API_KEY = "56ed5976ed140580a93a61871fa125bd";
const category = "general";

// ✅ Mediastack API endpoint for top headlines
const HEADLINES_URL = `https://api.mediastack.com/v1/news?access_key=${API_KEY}&categories=${category}&countries=in&languages=en&limit=12`;

function App() {
    const [headlines, setHeadlines] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState("example");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const [savedArticles, setSavedArticles] = useState([]);
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error("Failed to parse user:", error);
            }
        }
    }, []);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    useEffect(() => {
        if (user) {
            const savedKey = `savedArticles_${user.name}`;
            const saved = JSON.parse(localStorage.getItem(savedKey)) || [];
            setSavedArticles(saved);
        } else {
            setSavedArticles([]);
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

    // ✅ Fetch headlines & search results from Mediastack
    useEffect(() => {
        fetch(HEADLINES_URL)
            .then((response) => response.json())
            .then((data) => {
                console.log("Headlines from Mediastack:", data);
                setHeadlines(data.data || []);
            })
            .catch((error) => console.error("Error fetching headlines:", error));
        const API_KEY = "56ed5976ed140580a93a61871fa125bd";
        const SEARCH_URL = `https://api.mediastack.com/v1/news?access_key=${API_KEY}&keywords=${searchQuery}&countries=in&languages=en&limit=12`;

        const SEARCH_URL = `https://api.mediastack.com/v1/news?access_key=${API_KEY}&keywords=${searchQuery}&countries=in&languages=en&limit=12`;

        fetch(SEARCH_URL)
            .then((response) => response.json())
            .then((data) => {
                console.log("Search results from Mediastack:", data);
                setSearchResults(data.data || []);
            })
            .catch((error) => console.error("Error fetching search results:", error));
    }, [searchQuery]);

    const handleSearch = (e) => {
        if (e.key === "Enter" && e.target.value.trim() !== "") {
            setSearchQuery(e.target.value.trim());
        }
    };

    return (
        <div id="container">
            {/* Navbar */}
            <div className="navbar">
                <header>
                    <nav id="search">
                        <ul>
                            <li>
                                <input
                                    type="text"
                                    placeholder="Search"
                                    onKeyDown={handleSearch}
                                />
                            </li>
                            <div>
                                <li>
                                    <h1 className="logo">
                                        <Link className="logo-first" to="/">
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
                                        <div className="sidebar-user">
                                            <Link to="/login" className="sidebar-username">
                                                Login
                                            </Link>
                                        </div>
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
                        <li><Link to="/" data-category="home">Home</Link></li>
                        <li><Link to="/Bus" data-category="business">Business</Link></li>
                        <li><Link to="/Tech" data-category="technology">Technology</Link></li>
                        <li><Link to="/Enter" data-category="entertainment">Entertainment</Link></li>
                        <li><Link to="/Sports" data-category="sports">Sports</Link></li>
                        <li><Link to="/Science" data-category="science">Science</Link></li>
                        <li><Link to="/Health" data-category="health">Health</Link></li>
                    </ul>
                </div>
            </div>

            {/* News Container */}
            <main id="news-container">
                <h1>Top Headlines</h1>
                <hr className="title-hr" />
                <div id="headlines-container">
                    {headlines.length > 0 ? (
                        headlines.map((article, index) => (
                            <div key={index} className="headline-item">
                                <img
                                    className="img"
                                    src={article.image || "https://via.placeholder.com/400x200?text=No+Image"}
                                    alt={article.title || "No Title"}
                                />
                                <h2 className="title">{article.title || "Untitled"}</h2>
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
                                    <p className="save-for-home">
                                        <button onClick={() => handleSave(article)}>Save Article</button>
                                    </p>
                                </div>
                                <hr />
                            </div>
                        ))
                    ) : (
                        <p className="news-error">No Headlines Available.</p>
                    )}
                </div>

                {/* Latest News */}
                <h1 className="latest">Latest News</h1>
                <hr className="title-hr" />
                <div id="search-container">
                    {searchResults.length > 0 ? (
                        searchResults.map((article, index) => (
                            <div key={index} className="news-item">
                                <div className="img-container">
                                    <img
                                        className="img-news"
                                        src={article.image || "https://via.placeholder.com/400x200?text=No+Image"}
                                        alt={article.title || "No Title"}
                                    />
                                </div>
                                <h2 className="h2-news">{article.title || "Untitled"}</h2>
                                <p className="p-news">{article.description || "No description available."}</p>
                                <div className="article-button-two">
                                    <div className="readmore-news">
                                        <a
                                            href={article.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => handleReadMore(e, article.url)}
                                        >
                                            Read more
                                        </a>
                                    </div>
                                    <p className="save-latest">
                                        <button onClick={() => handleSave(article)}>Save Article</button>
                                    </p>
                                </div>
                                <hr />
                            </div>
                        ))
                    ) : (
                        <p className="news-error">No Latest News Available</p>
                    )}
                </div>
            </main>

            {/* Footer */}
            <div id="footers-home">
                <div className="navbar-items-footers-home">
                    <p className="footers-logo-home">The Press Point</p>
                    <p className="footers-copyright-home">
                        &copy; 2025 The Press Point All Rights Reserved
                    </p>
                </div>
            </div>
        </div>
    );
}

export default App;
