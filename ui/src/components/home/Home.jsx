import React from "react";
import "./home.css";
import banner from "../../assets/home-banner.jpg";
import { Link } from "react-router-dom";
import Category from "../../pages/category/Category";
import Footer from "../footer/Footer";

const Home = () => {
  return (
    <>
      <div className="home_container">
        <div className="home_contain">
          <div className="left">
            <div className="title">
              <h1>Find the Perfect Job Right Here in Your City</h1>
            </div>
            <div className="subtitle">
              <h2>
                Browse hundreds of local job opportunities and start your carear
                close to home.Your future is just around the corner!{" "}
              </h2>
            </div>
            <div className="serch-btn">
              <button>
                <Link to="/jobs">Find Job</Link>
              </button>
            </div>
          </div>

          <div className="right">
            <img src={banner} alt="" />
          </div>
        </div>
      </div>
      <Category />
      <Footer />
    </>
  );
};

export default Home;
