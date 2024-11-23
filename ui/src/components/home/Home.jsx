import React from "react";
import Slider from "react-slick";
import "./home.css";
import slide from "../../data/slide";
import { Link } from "react-router-dom";
import Category from "../../pages/category/Category";
import Footer from "../footer/Footer";

const Home = () => {
  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  console.log("imges", slide);
  return (
    <div className="home">
      <div className="home_container">
        <div className="home_slider">
          <Slider {...settings}>
            {slide.map((image, index) => (
              <div key={index} className="slide_item">
                <img
                  src={image.img}
                  // alt={`Slide ${index}`}
                  className="slider_image"
                />
                <div className="overlay"></div>
              </div>
            ))}
          </Slider>
        </div>
        {/* Content Over the Slider */}
        <div className="home_content">
          <div className="left">
            <div className="title">
              <h1>
                Find the Perfect Job Right Here <br /> in Your City
              </h1>
            </div>
            <div className="subtitle">
              <h2>
                Browse hundreds of local job opportunities and start your career
                close to home.
                <br />
                Your future is just around the corner!
              </h2>
            </div>
            <div className="button">
              <Link to="/login">Get Started</Link>
            </div>
          </div>
        </div>
      </div>
      <Category />
      <Footer />
    </div>
  );
};

export default Home;
