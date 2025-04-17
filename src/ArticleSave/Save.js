import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Save.css";
import face from "../assets/img/login-avatar.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

function Save() {
    const [savedArticles, setSavedArticles] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("savedArticles")) || [];
        setSavedArticles(saved);

        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
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
                                        <Link className="sign-in" to="/Login">Sign in</Link>
                                    )}
                                </li>
                            </div>
                            <div id="right-navbar">
                                <li>
                                    <Link className="save-article" to="/Save">
                                        <i className="fa-solid fa-bookmark"></i>
                                    </Link>
                                    <Link className="signin-icon1" to="/Login">
                                        <img src={face} alt="Login" />
                                    </Link>
                                    <Link className="sub" to="/Sub">Subscribe</Link>
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

            {/* Saved Articles Section */}
            <main id="news-container">
                <h1>Saved Articles</h1>
                <hr className="title-hr" />
                {savedArticles.length > 0 ? (
                    savedArticles.map((article, index) => (
                        <div key={index} className="headline-item">
                            <img className="img" src={article.image || "fallback-image.jpg"} alt={article.title} />
                            <h2 className="title">{article.title}</h2>
                            <p className="desc">{article.description}</p>
                            <div className="article-button">
                                <p className="readmore">
                                    <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
                                </p>
                            </div>
                            <hr />
                        </div>
                    ))
                ) : (
                    <p className="news-error">No saved articles yet.</p>
                )}
            </main>

            {/* Footer */}
            <div id="footers-home">
                <div className="navbar-items-footers-home">
                    <p className="footers-logo-home">The Press Point</p>
                    <p className="footer-copyright-home">
                        &copy; 2025 The Press Point All Rights Reserved
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Save;
