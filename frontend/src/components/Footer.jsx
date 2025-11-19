import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full bg-gradient-to-r from-primary/10 via-gray-50 to-primary/10 mt-10 shadow-inner">
      <div className="max-w-7xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between py-6 gap-3">
        <p className="text-gray-600 text-xs sm:text-sm text-center sm:text-left w-full flex items-center gap-2 justify-center sm:justify-start">
          <span className="flex items-center gap-1">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="inline-block text-primary">
              <circle cx="10" cy="10" r="9" stroke="#3778fa" strokeWidth="2" />
              <path
                d="M11 7.41421L13.5858 10L11 12.5858"
                stroke="#3778fa"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M7 10H13" stroke="#3778fa" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>
              &copy; {year} <span className="font-semibold text-primary">Blog | Nico Aramy</span>
            </span>
          </span>
          <span className="hidden sm:inline text-gray-300 mx-2">|</span>
          <span className="italic text-primary/70 hidden sm:inline">Stay curious. Stay inspired.</span>
        </p>
        <div className="flex flex-wrap gap-4 justify-center sm:justify-end w-full">
          <a
            href="https://github.com/naikoo-cmd"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1 text-gray-500 hover:text-primary transition-all duration-150 text-xs sm:text-sm font-medium"
          >
            <svg
              className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.429 2.865 8.187 6.839 9.525.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.466-1.11-1.466-.909-.621.069-.609.069-.609 1.006.07 1.535 1.034 1.535 1.034.893 1.532 2.341 1.09 2.91.834.092-.647.349-1.09.636-1.341-2.22-.253-4.555-1.112-4.555-4.951 0-1.093.39-1.987 1.029-2.686-.103-.253-.446-1.272.098-2.652 0 0 .84-.27 2.75 1.025a9.564 9.564 0 0 1 2.5-.336c.848.004 1.705.115 2.5.337 1.909-1.297 2.747-1.025 2.747-1.025.545 1.38.202 2.399.1 2.652.64.7 1.028 1.593 1.028 2.686 0 3.847-2.338 4.695-4.566 4.944.359.31.68.922.68 1.858 0 1.341-.013 2.423-.013 2.754 0 .267.18.578.688.48C19.138 20.205 22 16.448 22 12.02 22 6.484 17.523 2 12 2z" />
            </svg>
            GitHub
          </a>
          <a
            href="mailto:aramynico@gmail.com"
            className="group flex items-center gap-1 text-gray-500 hover:text-primary transition-all duration-150 text-xs sm:text-sm font-medium"
          >
            <svg
              className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 7l9 6 9-6" />
            </svg>
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
