import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./world.css";
import "./media.css";

const API_KEY = "773dcaa65d9b9a5df06b87e05a18b242";
const HEADLINES_URL = ``;
const SEARCH_URL = ``;

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
        <div id="container-main">
            {/* Navbar */}
            <div className="navbar-main">
                <header>
                    <nav id="search-bar">
                        <ul>
                            <li><input type="text" placeholder="Search..." /></li>
                            <div>
                                <li>
                                    <h1 className="logo-name">
                                        <a href="/">the rish <span className="logo-namepart">news.</span>
                                        </a>
                                    </h1>
                                </li>
                            </div>
                            <div>
                                <li>
                                    <a className="sign_in" href="/login">Sign in</a>
                                </li>
                            </div>
                            <li>
                                <a className="subscribe" href="/subscribe">Subscribe</a>
                            </li>
                        </ul>
                    </nav>
                </header>
                <div id="navbar_items">
                    <ul>
                        <li><Link to="/home">Home</Link></li>
                        <li><Link to="/world">World</Link></li>
                        <li><Link to="/nation">Nation</Link></li>
                        <li><Link to="/business">Business</Link></li>
                        <li><Link to="/technology">Technology</Link></li>
                        <li><Link to="/entertainment">Entertainment</Link></li>
                        <li><Link to="/sports">Sports</Link></li>
                        <li><Link to="/science">Science</Link></li>
                        <li><Link to="/health">Health</Link></li>
                    </ul>
                </div>
            </div>

            {/* News Container */}
            <main id="news_container">
                <h1>Top Headlines</h1>
                <hr className="title_hr" />
                <div id="headlines_container">
                    {headlines.length > 0 ? (
                        headlines.map((article, index) => (
                            <div key={index} className="headline_item">
                                <img className="image" src={article.urlToImage || "fallback-image.jpg"} alt={article.title} style={{ width: "100%", maxWidth: "500px" }} />
                                <h2 className="news-title">{article.title}</h2>
                                <p className="description">{article.description}</p>
                                <p className="readmore-button"><a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a></p>
                                <hr />
                            </div>
                        ))
                    ) : (
                        <p>No Headlines Available.</p>
                    )}
                </div>

                <h1 className="latestnews">Latest News</h1>
                <hr className="title-hr" />
                <div id="search-bar-container">
                    {searchResults.length > 0 ? (
                        searchResults.map((article, index) => (
                            <div key={index} className="news-item">
                                <img className="img-news" src={article.urlToImage || "fallback-image.jpg"} alt={article.title} style={{ width: "100%", maxWidth: "500px" }} />
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
                    <p className="footer-logo-name">the rish news.</p>
                    <p className="footer-copyright">Copyright &copy; 2025 the rish news. All Rights Reserved</p>
                </div>
            </div>
        </div>
    );
}

export default App;
