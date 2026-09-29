import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NewsCard from "../components/NewsCard";
import { toast } from "react-toastify";

const category = "technology";
const country = "in";
const HEADLINES_URL = `https://raw.githubusercontent.com/SauravKanchan/NewsAPI/master/top-headlines/category/${category}/${country}.json`;

function Technology() {
  const [headlines, setHeadlines] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search");
    if (search) {
      setSearchQuery(search);
    } else {
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [location.search]);

  useEffect(() => {
    setLoading(true);
    fetch(HEADLINES_URL)
      .then((response) => response.json())
      .then((data) => {
        setHeadlines(data.articles || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching headlines:", error);
        toast.error("Failed to fetch technology news.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (headlines.length > 0 && searchQuery.trim() !== "") {
      const filtered = headlines.filter((article) =>
        article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    }
  }, [searchQuery, headlines]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const isUserSearch = searchQuery !== "";
  const displayNews = isUserSearch ? searchResults : headlines;

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <Header onSearch={handleSearch} />

      <main className="flex-1 container mx-auto px-4 lg:px-8 py-8 md:py-12">
        <div className="mb-10">
          <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            {isUserSearch ? (
              <>Search Results for "<span className="text-indigo-600 dark:text-indigo-400">{searchQuery}</span>"</>
            ) : (
              "Technology News"
            )}
          </h1>
          <div className="w-24 h-1.5 bg-indigo-600 dark:bg-indigo-500 rounded-full"></div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        ) : (
          <>
            {isUserSearch && searchResults.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <i className="fa-regular fa-folder-open text-4xl text-slate-400 mb-4"></i>
                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">No news found for your search.</h3>
                <button 
                  onClick={() => setSearchQuery("")}
                  className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {displayNews.map((article, index) => (
                  <NewsCard key={index} article={article} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Technology;
