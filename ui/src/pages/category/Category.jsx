import React from "react";
import "./category.css";
import category from "../../data/data";
import { useTranslation } from "react-i18next";

const Category = () => {
  const { t } = useTranslation();
  return (
    <div className="category" id="category">
      <div className="category-contain">
        <div className="category-heading">
          <span className="line1"></span>
          <h1>{t("category.title")}</h1>
          <span className="line2"> </span>
        </div>
        <div className="category-details">
          <div className="category-title">
            {category.map((categ, index) => (
              <div key={index} className="category-item">
                <img src={categ.img} alt={categ.name} />
                <h4>{t(categ.name)}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
