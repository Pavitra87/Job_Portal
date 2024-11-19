import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", lang: "English" },
  { code: "ka", lang: "Kannada" },
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  useEffect(() => {
    document.body.dir = i18n.dir();
  }, [i18n, i18n.language]);

  return (
    <div className="btn-container">
      {languages.map((lng) => {
        return (
          <button
            className={lng.code === i18n.language ? "selected" : ""}
            key={lng.code}
            onClick={() => changeLanguage(lng.code)}
          >
            {lng.lang}
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSelector;
