import React, { useState } from "react";

const SubscriptionsBlog = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your subscription logic here
    console.log("Subscribed with email:", email);
    setEmail("");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 my-16 sm:my-20">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">Never Miss a Blog!</h2>
        <p className="text-gray-500 text-sm sm:text-base">
          Join our newsletter to stay updated with fresh blogs, trending tech, and special updates directly in your
          inbox.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
        />
        <button
          type="submit"
          className="px-6 sm:px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 active:bg-primary/95 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 whitespace-nowrap text-sm sm:text-base"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default SubscriptionsBlog;
