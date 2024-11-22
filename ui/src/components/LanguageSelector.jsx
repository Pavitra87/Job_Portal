import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./langselector.css";

const languages = [
  { code: "en", lang: "English" },
  { code: "ka", lang: "Kannada" },
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isKannada, setIsKannada] = useState(i18n.language === "ka");

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsKannada(lng === "ka");
  };

  useEffect(() => {
    document.body.dir = i18n.dir();
  }, [i18n.language]);

  return (
    <div className="lang-selector">
      <p>
        <span>Lang</span>/<span>ಭಾಷೆ</span>
      </p>
      <div className="lang">
        <div
          className="btn-container"
          onClick={() => changeLanguage(isKannada ? "en" : "ka")}
        >
          <span
            style={{
              transform: isKannada ? "translateX(15px)" : "translateX(0)",
            }}
          ></span>
        </div>
        <div className="language-label">
          <span>{isKannada ? "ಕ" : "en"}</span>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
