import React from "react";

const Header = () => {
  return (
    <div className="mx-8 sm:mx-16 xl:mx-24 relative">
      <div className="text-center mt-20 mb-8">
        <div className="inline-flex items-ceenter justify-center gap-4 px-6 py-1.5 mb-4 border border-primary/40 bg-primary/10 rounded-full text-sm text-primary">
          <p>
            <span className="mx-1">New: AI Features integrated</span>
            <span role="img" aria-label="star" className="text-primary">
              ⭐
            </span>
          </p>
        </div>
        <h1 className="text-3xl sm:text-6xl font-semibold sm:leading-16 text-gray-700">
          Build and share your <span className="text-primary">blog</span> with ease.
        </h1>
        <p className="my-6 sm:my-8 max-w-2xl m-auto max-sm:text-xs text-gray-500">
          Express yourself freely—share ideas, stories, or anything you like. Whether it’s a single thought or a
          thousand words, your journey begins here.
        </p>
        <form className="flex justify-between max-w-lg max:sm:scale-75 mx-auto border border-gray-300 bg-white rounded overflow-hidden">
          <input type="text" placeholder="Search for blogs" required className="w-full pl-4 outline-none" />
          <button
            type="submit"
            className="bg-primary text-white px-8 py-2 m-1.5 rounded hover:scale-105 transition-all cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default Header;
