import React from "react";
import Header from "../components/Header";
import BlogCard from "../components/BlogCard";
import BlogList from "../components/BlogList";
import SubscriptionsBlog from "../components/SubscriptionsBlog";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Header />
      <BlogList />
      <BlogCard />
      <SubscriptionsBlog />
      <Footer />
    </>
  );
};
export default Home;
