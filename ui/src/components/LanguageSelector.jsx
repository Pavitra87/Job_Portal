import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./langselector.css";
import { MdLanguage } from "react-icons/md";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";

const languages = [
  { code: "en", lang: "English" },
  { code: "ka", lang: "ಕನ್ನಡ" },
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(
    languages.find((lang) => lang.code === i18n.language) || languages[0]
  );

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setSelectedLanguage(languages.find((lang) => lang.code === lng));
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    document.body.dir = i18n.dir();
  }, [i18n.language]);

  return (
    <div className="lang-selector">
      <div
        className="lang-selector-header"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <MdLanguage style={{ fontSize: "20px", color: "#000e" }} />
        <span style={{ color: " #0052b0" }}>{selectedLanguage.lang}</span>
        {isDropdownOpen ? (
          <RiArrowDropUpLine style={{ fontSize: "20px" }} />
        ) : (
          <RiArrowDropDownLine style={{ fontSize: "20px" }} />
        )}
      </div>
      {isDropdownOpen && (
        <ul className="lang-dropdown">
          {languages.map((language) => (
            <li
              key={language.code}
              className={
                language.code === selectedLanguage.code ? "active" : ""
              }
              onClick={() => changeLanguage(language.code)}
            >
              {language.lang}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSelector;
