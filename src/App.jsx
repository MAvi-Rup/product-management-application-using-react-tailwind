import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./components/Paages/LoginPage";
import ProductCartPage from "./components/Paages/ProductCartPage";
import ProductPage from "./components/Paages/ProductPage";
import RegisterPage from "./components/Paages/RegistrationPage";
import SingleProductPage from "./components/Paages/SingleProductPage";
import Footer from "./components/shared/Footer";
import Header from "./components/shared/Header";
import ProtectedRoute from "./components/shared/ProtectedRoute";
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  const accessToken = localStorage.getItem("accessToken");

  const fetchCartItemCount = useCallback(async () => {
    try {
      const response = await axios.get("https://api.zonesparks.org/cart/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.data.length > 0) {
        const itemCount = response.data[0].items.reduce(
          (total, item) => total + item.quantity,
          0
        );
        setCartItemCount(itemCount);
      } else {
        setCartItemCount(0);
      }
    } catch (error) {
      console.error("Error fetching cart item count:", error);
    }
  }, [accessToken]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchCartItemCount();
    }
  }, [isLoggedIn, fetchCartItemCount]);

  return (
    <Router>
      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        cartItemCount={cartItemCount}
        fetchCartItemCount={fetchCartItemCount}
      />
      <Routes>
        <Route
          path="/"
          element={<ProductPage updateCartItemCount={fetchCartItemCount} />}
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <ProductCartPage updateCartItemCount={fetchCartItemCount} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/:productId"
          element={
            <SingleProductPage updateCartItemCount={fetchCartItemCount} />
          }
        />
        <Route
          path="/login"
          element={<LoginPage setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      <Footer />
      <ToastContainer />
    </Router>
  );
};

export default App;
