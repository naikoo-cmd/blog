import React, { useState } from "react";
import Header from "../components/Header";
import BlogList from "../components/BlogList";
import SubscriptionsBlog from "../components/SubscriptionsBlog";
import Footer from "../components/Footer";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Search is handled in BlogList component via props
  };

  return (
    <>
      <Header 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
      />
      <BlogList searchQuery={searchQuery} />
      <SubscriptionsBlog />
      <Footer />
    </>
  );
};
export default Home;
