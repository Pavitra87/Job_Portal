import React from "react";
import "./home.css";
import banner from "../../assets/home-banner.jpg";
import { Link } from "react-router-dom";
import Category from "../../pages/category/Category";
import Footer from "../footer/Footer";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  return (
    <>
      <div className="home_container">
        <div className="home_contain">
          <div className="left">
            <div className="title">
              <h1>
                Find the Perfect Job Right Here <br /> in Your City
              </h1>
            </div>
            <div className="subtitle">
              <h2>
                Browse hundreds of local job opportunities and start your carear
                close to home.
                <br />
                Your future is just around the corner!{" "}
              </h2>
            </div>
            <div className="button">
              <Link>Get Started</Link>
            </div>
          </div>
        </div>
      </div>
      <Category />
      <Footer />
    </>
  );
};

export default Home;
