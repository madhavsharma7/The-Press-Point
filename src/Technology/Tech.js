import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Tech.css";
import "./media-tech.css";
import { Link } from "react-router-dom";
import face from "../assets/img/login-avatar.png";
import { toast } from "react-toastify";

// https://gnews.io/api/v4/top-headlines?category=technology&apikey=${API_KEY}

// Replace with your actual API key
const API_KEY = "773dcaa65d9b9a5df06b87e05a18b242";
const API_URL = ` https://gnews.io/api/v4/top-headlines?category=technology&apikey=${API_KEY}`;

function Headlines() {
    const [headlines, setHeadlines] = useState([]);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const [savedArticles, setSavedArticles] = useState([]);

    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });

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

    return (
        <div id="container">
            {/* Navbar */}
            <div className="navbar">
                <header>
                    <nav id="search">
                        <ul>
                            <li><input type="text" placeholder="Search" /></li>
                            <div>
                                <li>
                                    <h1 className="logo">
                                        <Link to="/">The Press <span className="logo-part">Point</span></Link>
                                    </h1>
                                </li>
                            </div>
                            <div>
                                <li>
                                    {/* Conditional rendering based on login status */}
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
                                    {/* <Link to="/login">Login</Link> */}
                                    {user ? (
                                        <div className="sidebar-user">
                                            <span className="sidebar-username">Hi, {user.name}</span>
                                            <i
                                                className="fa-solid fa-right-to-bracket logout-icon"
                                                onClick={handleLogout}
                                                title="Log Out"
                                            ></i>

                                            {/* <button className="sidebar-logout" onClick={handleLogout}>
                                                Log Out
                                            </button> */}
                                        </div>
                                    ) : (
                                        <Link to="/login">Login</Link>
                                    )}
                                    <Link to="/Save">Saved Articles</Link>
                                    <Link to="Sub">Subscribe</Link>
                                </div>
                            </div>
                        </ul>
                    </nav>
                </header>

                <div id="navbar-items">
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
                                    <p className="readmore">
                                        <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
                                    </p>
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
            <div id="foote">
                <div className="navbar-items-foote">
                    <p className="foote-logo">The Press Point</p>
                    <p className="foote-copyright">Copyright &copy; 2025 The Press Point All Rights Reserved</p>
                </div>
            </div>
        </div>
    );
}

export default Headlines;
