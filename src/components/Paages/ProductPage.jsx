// src/pages/AllProductsPage.js
import React, { useEffect, useState } from "react";

import { useCart } from "../../context/CartContext";
import ProductFilter from "../Products/ProductFilter";
import ProductList from "../Products/ProductList";
import ProductSearchBar from "../Products/ProductSearchBar";
import Loading from "../shared/Loading";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    subCategory: "",
    brand: "",
    priceRange: [0, 1000],
  });
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, filters, page]);

  const fetchProducts = async () => {
    setLoading(true);
    let url = `https://api.zonesparks.org/products/?search=${searchQuery}&page=${page}`;

    if (filters.category) url += `&category=${filters.category}`;
    if (filters.subCategory) url += `&subCategory=${filters.subCategory}`;
    if (filters.brand) url += `&brand=${filters.brand}`;
    if (filters.priceRange) {
      url += `&price_min=${filters.priceRange[0]}&price_max=${filters.priceRange[1]}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    setProducts((prevProducts) => [...prevProducts, ...data.products]);
    setLoading(false);
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      loading
    )
      return;
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  return (
    <div className="container mx-auto p-4">
      <ProductSearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <ProductFilter filters={filters} setFilters={setFilters} />
      <ProductList products={products} addToCart={addToCart} />
      {loading && <Loading />}
    </div>
  );
};

export default ProductPage;
