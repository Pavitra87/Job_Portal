import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./authenticated/AuthContext";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { BrowserRouter } from "react-router-dom";
import "./i18n";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <React.Suspense fallback="loading....">
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.Suspense>
  </BrowserRouter>
);
