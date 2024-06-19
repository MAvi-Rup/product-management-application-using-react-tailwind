// ProductPage.js
import { useEffect, useRef, useState } from "react";
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
  const [hasMore, setHasMore] = useState(true);
  const [cart, setCart] = useState([]);
  const loaderRef = useRef(null);

  useEffect(() => {
    setPage(0);
    setProducts([]);
    setHasMore(true);
    fetchProducts(true);
  }, [searchQuery, filters]);

  useEffect(() => {
    if (page > 0) {
      fetchProducts();
    }
  }, [page]);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { rootMargin: "100px" }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore]);

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart.filter((product) => product.id !== productId)
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <ProductFilter filters={filters} setFilters={setFilters} />
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">Cart</h2>
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <ul>
                {cart.map((product) => (
                  <li
                    key={product.id}
                    className="flex justify-between items-center mb-2"
                  >
                    {product.title}
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="col-span-8">
          <ProductSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <ProductList products={products} addToCart={addToCart} />
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
