import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NewsCard from "../components/NewsCard";

function Save() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [savedArticles, setSavedArticles] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user"));
      if (!u || !u.name) return [];
      return JSON.parse(localStorage.getItem(`savedArticles_${u.name}`)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const refreshSaved = () => {
      try {
        const u = JSON.parse(localStorage.getItem("user"));
        setUser(u);
        if (u && u.name) {
          const stored = JSON.parse(localStorage.getItem(`savedArticles_${u.name}`)) || [];
          setSavedArticles(stored);
        } else {
          setSavedArticles([]);
        }
      } catch {
        setUser(null);
        setSavedArticles([]);
      }
    };

    window.addEventListener("bookmarkUpdated", refreshSaved);
    window.addEventListener("storage", refreshSaved);
    return () => {
      window.removeEventListener("bookmarkUpdated", refreshSaved);
      window.removeEventListener("storage", refreshSaved);
    };
  }, []);

  const handleRemove = (url) => {
    setSavedArticles((prev) => prev.filter((a) => a.url !== url));
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <Header />

      <main className="flex-1 container mx-auto px-4 lg:px-8 py-8 md:py-12">
        <div className="mb-10">
          <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Saved Articles
          </h1>
          <div className="w-24 h-1.5 bg-indigo-600 dark:bg-indigo-500 rounded-full"></div>
        </div>

        {!user ? (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <i className="fa-solid fa-lock text-4xl text-slate-400 mb-4"></i>
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Sign in to view your bookmarks</h3>
            <p className="text-slate-500 mt-2">Create an account or sign in to save and read articles later.</p>
          </div>
        ) : savedArticles.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <i className="fa-regular fa-bookmark text-4xl text-slate-400 mb-4"></i>
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">No saved articles yet</h3>
            <p className="text-slate-500 mt-2">Articles you bookmark will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {savedArticles.map((article, index) => (
              <NewsCard key={article.url || index} article={article} onRemove={handleRemove} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Save;
