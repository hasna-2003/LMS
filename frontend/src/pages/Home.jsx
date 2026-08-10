import React from "react";
import Layout from "../components/Layout";
import Banner from "../components/Banner";
import HomeCourses from "../components/HomeCourses";

const Home = () => {
  return (
    <Layout>
      <Banner />
      <HomeCourses />
    </Layout>
  );
};

export default Home;
