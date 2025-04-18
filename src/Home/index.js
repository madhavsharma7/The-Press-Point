import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import "./media-home.css";
import face from "../assets/img/login-avatar.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import {toast } from 'react-toastify';

const API_KEY = "773dcaa65d9b9a5df06b87e05a18b242";
const category = "category";
const HEADLINES_URL = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=in&max=5&apikey=${API_KEY}`;
const SEARCH_URL = `https://gnews.io/api/v4/search?q=example&lang=en&country=in&max=5&apikey=${API_KEY}`;

function App() {
    const [headlines, setHeadlines] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [user, setUser] = useState(null);

    const handleSave = (article) => {
        const saved = JSON.parse(localStorage.getItem("savedArticles")) || [];
        const isDuplicate = saved.some((a) => a.url === article.url);

        if (!isDuplicate) {
            saved.push(article);
            localStorage.setItem("savedArticles", JSON.stringify(saved));
            toast("Article saved!");
        } else {
            toast("Article already saved.");
        }
    };

    useEffect(() => {
        fetch(HEADLINES_URL)
            .then((response) => response.json())
            .then((data) => setHeadlines(data.articles || []))
            .catch((error) => console.error("Error fetching headlines:", error));

        fetch(SEARCH_URL)
            .then((response) => response.json())
            .then((data) => setSearchResults(data.articles || []))
            .catch((error) => console.error("Error fetching search results:", error));

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

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
                                    {user ? (
                                        <span className="username">
                                            Hi, {user.name}
                                            <FontAwesomeIcon
                                                icon={faRightFromBracket}
                                                style={{ marginLeft: "10px", cursor: "pointer" }}
                                                title="Logout"
                                                onClick={() => {
                                                    localStorage.removeItem("user");
                                                    window.location.reload();
                                                }}
                                            />
                                        </span>
                                    ) : (
                                        <Link className="sign_in" to="/Login">Sign in</Link>
                                    )}
                                </li>
                            </div>
                            <div id="right-navbar">
                                <li>
                                    <Link to="/Save" className="save-article"><i className="fa-solid fa-bookmark"></i></Link>

                                    <Link className="signin-icon1" to="/Login">
                                        <img src={face} alt="Login" />
                                    </Link>
                                    <Link className="sub" to="Sub">Subscribe</Link>
                                    <div className="bar"><i className="fa-solid fa-bars"></i></div>
                                </li>
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

            {/* News Container */}
            <main id="news-container">
                <h1>Top Headlines</h1>
                <hr className="title-hr" />
                <div id="headlines-container">
                    {headlines.length > 0 ? (
                        headlines.map((article, index) => (
                            <div key={index} className="headline-item">
                                <img className="img" src={article.image || "fallback-image.jpg"} alt={article.title} />
                                <h2 className="title">{article.title}</h2>
                                <p className="desc">{article.description}</p>
                                <div className="article-button">
                                    <p className="readmore">
                                        <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
                                    </p>
                                    <p className="save">
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

                <h1 className="latest">Latest News</h1>
                <hr className="title-hr" />
                <div id="search-container">
                    {searchResults.length > 0 ? (
                        searchResults.map((article, index) => (
                            <div key={index} className="news-item">
                                <div className="img-container">
                                    <img className="img-news" src={article.image || "fallback-image.jpg"} alt={article.title} />
                                </div>
                                <h2 className="h2-news">{article.title}</h2>
                                <p className="p-news">{article.description}</p>
                                <div className="article-button-two">
                                <div className="readmore-news">
                                    <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
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
