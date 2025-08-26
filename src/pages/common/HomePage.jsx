 import React from "react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Carousel from "../../components/common/Carousel";

function HomePage() {
  return (
    <div className="homepage">
      <Header />
      <main className="homepage__content">
        <Carousel />
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;


