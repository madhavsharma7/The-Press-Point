import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & About */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <h2 className="font-headline text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                The Press Point<span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-500 mt-2"></span>
              </h2>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Delivering verified journalism, breaking stories, and in-depth reporting across global business, technology, and science. Your trusted source for what matters.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-900/50 dark:hover:text-indigo-400 transition">
                <i className="fa-brands fa-twitter"></i>
              </a>
              <a href="https://github.com/SauravKanchan/NewsAPI" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-900/50 dark:hover:text-indigo-400 transition">
                <i className="fa-brands fa-github"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-900/50 dark:hover:text-indigo-400 transition">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Categories</h3>
            <ul className="space-y-3">
              {['Business', 'Entertainment', 'Health', 'Science', 'Sports', 'Technology'].map((cat) => (
                <li key={cat}>
                  <Link to={`/${cat === 'Business' ? 'Bus' : cat === 'Entertainment' ? 'Enter' : cat === 'Technology' ? 'Tech' : cat}`} className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/Save" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition">Saved Articles</Link></li>
              <li><Link to="/Sub" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition">Subscribe & Plans</Link></li>
              <li><Link to="/login" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition">Sign In</Link></li>
              <li><button type="button" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition">Privacy Policy</button></li>
              <li><button type="button" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition">Terms of Service</button></li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Newsletter</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
              Get the best of The Press Point delivered to your inbox daily.
            </p>
            <form className="mt-2" onSubmit={(e) => e.preventDefault()}>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-l-lg px-4 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-lg text-sm font-medium transition shadow-sm">
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 dark:text-slate-500 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} The Press Point. All Rights Reserved.
          </p>
          <p className="text-slate-500 dark:text-slate-500 text-sm flex items-center gap-1">
            Made with <i className="fa-solid fa-heart text-red-500 text-xs"></i> for Journalism
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
