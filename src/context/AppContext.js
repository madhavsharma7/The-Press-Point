import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // User state
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Saved articles
  const [savedArticles, setSavedArticles] = useState([]);

  // Sync dark mode class with DOM
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (darkMode) {
      root.classList.add("dark");
      body.classList.add("dark");
      body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      body.classList.remove("dark");
      body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  // Sync saved articles with current user
  useEffect(() => {
    if (user && user.name) {
      const savedKey = `savedArticles_${user.name}`;
      try {
        const stored = JSON.parse(localStorage.getItem(savedKey)) || [];
        setSavedArticles(stored);
      } catch {
        setSavedArticles([]);
      }
    } else {
      setSavedArticles([]);
    }
  }, [user]);

  const saveArticle = (article) => {
    if (!user) {
      toast.info("Please sign in to bookmark articles");
      return false;
    }

    const savedKey = `savedArticles_${user.name}`;
    const current = JSON.parse(localStorage.getItem(savedKey)) || [];

    const exists = current.some((a) => a.url === article.url);
    if (exists) {
      toast.info("Article already saved in your bookmarks");
      return false;
    }

    const updated = [article, ...current];
    localStorage.setItem(savedKey, JSON.stringify(updated));
    setSavedArticles(updated);
    toast.success("Article bookmarked successfully!");
    return true;
  };

  const removeArticle = (articleUrl) => {
    if (!user) return;
    const savedKey = `savedArticles_${user.name}`;
    const current = JSON.parse(localStorage.getItem(savedKey)) || [];
    const updated = current.filter((a) => a.url !== articleUrl);
    localStorage.setItem(savedKey, JSON.stringify(updated));
    setSavedArticles(updated);
    toast.success("Article removed from bookmarks");
  };

  const isArticleSaved = (articleUrl) => {
    return savedArticles.some((a) => a.url === articleUrl);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("google_token");
    setUser(null);
    setSavedArticles([]);
    toast.success("Logged out successfully");
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        logout,
        darkMode,
        toggleTheme,
        savedArticles,
        saveArticle,
        removeArticle,
        isArticleSaved,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
