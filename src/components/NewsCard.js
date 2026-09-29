import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const NewsCard = ({ article, onRemove }) => {
  const navigate = useNavigate();

  const getUser = () => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const checkIsSaved = () => {
    const user = getUser();
    if (!user || !user.name) return false;
    try {
      const savedKey = `savedArticles_${user.name}`;
      const saved = JSON.parse(localStorage.getItem(savedKey)) || [];
      return saved.some((a) => a.url === article.url);
    } catch {
      return false;
    }
  };

  const [saved, setSaved] = useState(checkIsSaved);

  // Handle fallback image if none provided or fails to load
  const [imgSrc, setImgSrc] = useState(
    article.urlToImage || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  );

  const handleError = () => {
    setImgSrc("https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
  };

  const handleReadMore = (e) => {
    const user = getUser();
    if (!user) {
      e.preventDefault();
      toast.info("Please sign in to read full articles");
      navigate("/login");
    }
  };

  const handleBookmarkToggle = () => {
    const user = getUser();
    if (!user) {
      toast.info("Please sign in to bookmark articles");
      navigate("/login");
      return;
    }

    const savedKey = `savedArticles_${user.name}`;
    let current = [];
    try {
      current = JSON.parse(localStorage.getItem(savedKey)) || [];
    } catch {}

    if (saved) {
      const updated = current.filter((a) => a.url !== article.url);
      localStorage.setItem(savedKey, JSON.stringify(updated));
      setSaved(false);
      toast.success("Article removed from bookmarks");
      window.dispatchEvent(new Event("bookmarkUpdated"));
      if (onRemove) {
        onRemove(article.url);
      }
    } else {
      const exists = current.some((a) => a.url === article.url);
      if (exists) {
        toast.info("Article already saved in your bookmarks");
        return;
      }
      const updated = [article, ...current];
      localStorage.setItem(savedKey, JSON.stringify(updated));
      setSaved(true);
      toast.success("Article bookmarked successfully!");
      window.dispatchEvent(new Event("bookmarkUpdated"));
    }
  };

  const formattedDate = article.publishedAt 
    ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Recent';

  const sourceName = article.source?.name || 'Press Point News';

  return (
    <article className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300">
      
      {/* Image Container with Zoom effect */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img 
          src={imgSrc} 
          onError={handleError}
          alt={article.title || "News"} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
          loading="lazy"
        />
        
        {/* Bookmark absolute overlay button */}
        <button 
          onClick={handleBookmarkToggle}
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur shadow-sm flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition transform hover:scale-110 active:scale-95"
          title={saved ? "Remove Bookmark" : "Save Article"}
        >
          <i className={`${saved ? 'fa-solid text-indigo-600 dark:text-indigo-400' : 'fa-regular'} fa-bookmark text-lg`}></i>
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 md:p-6">
        
        {/* Meta line */}
        <div className="flex items-center gap-3 mb-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">{sourceName}</span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
          <span>{formattedDate}</span>
        </div>

        {/* Title */}
        <h3 className="font-headline text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-snug mb-3 line-clamp-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {article.title || "Untitled"}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6 flex-1 leading-relaxed">
          {article.description || "No description available for this article."}
        </p>

        {/* Footer actions */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/50">
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={handleReadMore}
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            Read Story <i className="fa-solid fa-arrow-right-long text-xs group-hover:translate-x-1 transition-transform"></i>
          </a>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
