import React from "react";
import "./category.css";
import category from "../../data/data";

const Category = () => {
  return (
    <div className="category">
      <div className="category-contain">
        <div className="category-heading">
          <h1>Categories</h1>
        </div>
        <div className="category-details">
          <div className="category-title">
            {category.map((categ, index) => (
              <div key={index} className="category-item">
                <h4>{categ.name}</h4>
                <img src={categ.img} alt={categ.name} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
