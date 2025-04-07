import React, { useEffect, useState } from "react";
import "./Science.css";
import "./media-science.css";
import { Link } from "react-router-dom";

// https://gnews.io/api/v4/top-headlines?category=science&apikey=${API_KEY}

// Replace with your actual API key
const API_KEY = "773dcaa65d9b9a5df06b87e05a18b242";
const API_URL = `https://gnews.io/api/v4/top-headlines?category=science&apikey=${API_KEY}`;

function Headlines() {
    const [headlines, setHeadlines] = useState([]);
    const [error, setError] = useState(null);

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
                                <li><Link className="sign-in" to="/login">Sign in</Link></li>
                            </div>
                            <li><Link className="sub" to="/subscribe">Subscribe</Link></li>
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
            <div id="footer-science">
                <div className="navbar-items-footer-science">
                    <p className="footer-science-logo">The Press Point</p>
                    <p className="footer-science-copyright">Copyright &copy; 2025 The Press Point All Rights Reserved</p>
                </div>
            </div>
        </div>
    );
}

export default Headlines;
