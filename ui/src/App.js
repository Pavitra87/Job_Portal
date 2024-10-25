import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import Home from "./components/home/Home";
import Category from "./pages/category/Category";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/category" element={<Category />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
