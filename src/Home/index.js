import React, { useEffect, useState } from "react";
import { Link, Links, BrowserRouter } from "react-router-dom";
import "./style.css";
import "./media.css";

const API_KEY = "773dcaa65d9b9a5df06b87e05a18b242";
const category="category"
const HEADLINES_URL = ``;
const SEARCH_URL = ``

function App() {
    const [headlines, setHeadlines] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        fetch(HEADLINES_URL)
            .then((response) => response.json())
            .then((data) => setHeadlines(data.articles || []))
            .catch((error) => console.error("Error fetching headlines:", error));

        fetch(SEARCH_URL)
            .then((response) => response.json())
            .then((data) => setSearchResults(data.articles || []))
            .catch((error) => console.error("Error fetching search results:", error));
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
                                        <a href="index.html">
                                            the rish <span className="logo-part">news.</span>
                                        </a>
                                    </h1>
                                </li>
                            </div>
                            <div>
                                <li>
                                    <a className="sign-in" href="./Login/index.html">Sign in</a>
                                </li>
                            </div>
                            <li>
                                <a className="sub" href="./Subscribe/index.html">Subscribe</a>
                            </li>
                        </ul>
                    </nav>
                </header>
                <div id="navbar-items">
                    <ul>
                        <BrowserRouter>
                        <li><Link to="/home" data-category="home">Home</Link></li>
                        <li><Link to="/world" data-category="world">World</Link></li>
                        <li><Link to="/nation" data-category="nation">Nation</Link></li>
                        <li><Link to="/business" data-category="business">Business</Link></li>
                        <li><Link to="/technology" data-category="technology">Technology</Link></li>
                        <li><Link to="/entertainment" data-category="entertainment">Entertainment</Link></li>
                        <li><Link to="/sports" data-category="sports">Sports</Link></li>
                        <li><Link to="/science" data-category="science">Science</Link></li>
                        <li><Link to="/health" data-category="health">Health</Link></li>
                        </BrowserRouter>
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
                                <img className="img" src={article.image || "fallback-image.jpg"} alt={article.title} style={{ width: "100%", maxWidth: "500px" }} />
                                <h2 className="title">{article.title}</h2>
                                <p className="desc">{article.description}</p>
                                <p className="readmore"><a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a></p>
                                <hr />
                            </div>
                        ))
                    ) : (
                        <p>No Headlines Available.</p>
                    )}
                </div>

                <h1 className="latestnews">Latest News</h1>
                <hr className="title-hr" />
                <div id="search-container">
                    {searchResults.length > 0 ? (
                        searchResults.map((article, index) => (
                            <div key={index} className="news-item">
                                <img className="img-news" src={article.image || "fallback-image.jpg"} alt={article.title} style={{ width: "100%", maxWidth: "500px" }} />
                                <h2 className="h2-news">{article.title}</h2>
                                <p className="p-news">{article.description}</p>
                                <p className="readmore-news"><a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a></p>
                                <hr />
                            </div>
                        ))
                    ) : (
                        <p>No Latest News Available</p>
                    )}
                </div>
            </main>

            {/* Footer */}
            <div id="footer">
                <div className="navbar-items-footer">
                    <p className="footer-logo">the rish news.</p>
                    <p className="footer-copyright">Copyright &copy; 2025 the rish news. All Rights Reserved</p>
                </div>
            </div>
        </div>
    );
}

export default App;
