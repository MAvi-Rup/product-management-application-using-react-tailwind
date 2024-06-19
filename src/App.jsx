import React, { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LoginPage from "./components/Paages/LoginPage";
import ProductPage from "./components/Paages/ProductPage";
import RegisterPage from "./components/Paages/RegistrationPage";
import Footer from "./components/shared/Footer";
import Header from "./components/shared/Header";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<ProductPage />} />
        <Route
          path="/login"
          element={<LoginPage setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
