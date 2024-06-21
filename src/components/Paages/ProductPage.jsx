import React, { useEffect, useRef, useState } from "react";
import { handleAddToCart } from "../Functions/functionApi";
import ProductFilter from "../Products/ProductFilter";
import ProductList from "../Products/ProductList";
import ProductSearchBar from "../Products/ProductSearchBar";
import Loading from "../shared/Loading";

const ProductPage = ({ updateCartItemCount }) => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    subCategory: "",
    brand: "",
    priceRange: [0, 100000],
  });
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  const fetchProducts = async (reset = false) => {
    let baseUrl = "https://api.zonesparks.org/products/";

    if (searchQuery) {
      baseUrl += `?keyword=${searchQuery}`;
    } else {
      baseUrl += "?";
      if (filters.category) baseUrl += `category=${filters.category}&`;
      if (filters.subCategory) baseUrl += `subCategory=${filters.subCategory}&`;
      if (filters.brand) baseUrl += `brand=${filters.brand}&`;
      if (filters.priceRange) {
        baseUrl += `price_min=${filters.priceRange[0]}&price_max=${filters.priceRange[1]}&`;
      }
    }

    if (page > 0) {
      baseUrl += `&page=${page}`;
    }

    const response = await fetch(baseUrl);
    const data = await response.json();

    if (reset) {
      setProducts(data.products);
      setHasMore(data.products.length !== 0);
    } else {
      setProducts((prevProducts) => {
        const uniqueProducts = new Map(
          [...prevProducts, ...data.products].map((item) => [item.id, item])
        );
        const hasMoreProducts = uniqueProducts.size !== prevProducts.length;
        setHasMore(hasMoreProducts);
        return [...uniqueProducts.values()];
      });
    }
  };
  const handleAddToCartWrapper = (product, variant) => {
    handleAddToCart(product, variant, updateCartItemCount);
  };

  const handleObserver = (entities) => {
    const target = entities[0];
    if (target.isIntersecting && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore]);

  useEffect(() => {
    const initialFetch = async () => {
      await fetchProducts(true);
    };
    setPage(0);
    setProducts([]);
    setHasMore(true);
    initialFetch();
  }, [searchQuery, filters]);

  useEffect(() => {
    if (page > 0) {
      fetchProducts();
    }
  }, [page]);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <ProductFilter filters={filters} setFilters={setFilters} />
        </div>
        <div className="col-span-8">
          <ProductSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <ProductList
            products={products}
            handleAddToCart={handleAddToCartWrapper}
          />
          <div ref={loaderRef}>
            {hasMore && <Loading />}
            {!hasMore && <p>No products left</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
