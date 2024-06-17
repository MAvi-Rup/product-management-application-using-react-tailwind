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
    priceRange: [0, 100000],
  });
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    setPage(0);
    setProducts([]);
    fetchProducts(true);
  }, [searchQuery, filters]);

  useEffect(() => {
    if (page > 0) {
      fetchProducts();
    }
  }, [page]);

  const fetchProducts = async (reset = false) => {
    setLoading(true);
    let url = `https://api.zonesparks.org/products/?page=${page}`;

    if (searchQuery) url += `&keyword=${searchQuery}`;
    if (filters.category) url += `&category=${filters.category}`;
    if (filters.subCategory) url += `&subCategory=${filters.subCategory}`;
    if (filters.brand) url += `&brand=${filters.brand}`;
    if (filters.priceRange) {
      url += `&price_min=${filters.priceRange[0]}&price_max=${filters.priceRange[1]}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (reset) {
      setProducts(data.products);
    } else {
      setProducts((prevProducts) => {
        // Create a new set to remove duplicates
        const uniqueProducts = new Map(
          [...prevProducts, ...data.products].map((item) => [item.id, item])
        );
        return [...uniqueProducts.values()];
      });
    }

    setLoading(false);
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      loading ||
      products.length === 0 // Check if there are no products to fetch
    ) {
      return;
    }
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
