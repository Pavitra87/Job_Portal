import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./authenticated/AuthContext";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { BrowserRouter } from "react-router-dom";
import "./i18n";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <React.Suspense fallback={<div>Loading translations...</div>}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.Suspense>
  </BrowserRouter>
);
