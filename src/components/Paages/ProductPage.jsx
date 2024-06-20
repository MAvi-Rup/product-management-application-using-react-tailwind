import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
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
  const [userCart, setUserCart] = useState([]);
  const accessToken = localStorage.getItem("accessToken");

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

  const addToCart = async (
    cartId,
    productId,
    color,
    size,
    imageIndex,
    quantity
  ) => {
    try {
      const response = await axios.post(
        `https://api.zonesparks.org/cart/${cartId}/items/`,
        {
          product_id: productId,
          color: color || "N/A",
          size: size || "N/A",
          image: imageIndex,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error adding product to cart:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const handleAddToCart = async (product, variant) => {
    const { id, color, size, stock } = variant;
    let imageIndex = 0;
    if (Array.isArray(product.images) && product.images.length > 0) {
      imageIndex = product.images.findIndex((img) => img.variant_id === id);
      imageIndex = imageIndex !== -1 ? imageIndex : 0;
    }
    const quantity = 1; // Add logic to handle quantity input or use a default value

    if (stock >= quantity) {
      try {
        // First, fetch or create the user's cart
        let cartResponse = await axios.get("https://api.zonesparks.org/cart/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        let cartId;
        if (cartResponse.data.length === 0) {
          // If no cart exists, create one
          const createCartResponse = await axios.post(
            "https://api.zonesparks.org/cart/",
            {},
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          cartId = createCartResponse.data[0].id;
        } else {
          cartId = cartResponse.data[0].id;
        }

        // Now add the item to the cart
        const newItem = await addToCart(
          cartId,
          product.id,
          color,
          size,
          imageIndex,
          quantity
        );

        if (newItem) {
          setUserCart((prevCart) => {
            if (prevCart.length === 0) {
              return [
                {
                  id: cartId,
                  items: [newItem],
                  grand_total: newItem.sub_total,
                },
              ];
            } else {
              const updatedCart = { ...prevCart[0] };
              updatedCart.items.push(newItem);
              updatedCart.grand_total += newItem.sub_total;
              return [updatedCart];
            }
          });
          updateCartItemCount();
          toast.success("Item added to cart successfully");
        }
      } catch (error) {
        console.error("Error adding to cart:", error.response?.data || error);

        if (
          error.response?.data?.error &&
          Array.isArray(error.response.data.error)
        ) {
          const errorMessage = error.response.data.error[0];
          if (errorMessage.includes("Quantity exceeds available stock")) {
            toast.error(
              "Sorry, the requested quantity exceeds the available stock."
            );
          } else {
            toast.error(errorMessage);
          }
        } else {
          toast.error(
            "An error occurred while adding the item to the cart. Please try again."
          );
        }
      }
    } else {
      toast.error("Sorry, this item is currently out of stock.");
    }
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
          <ProductList products={products} handleAddToCart={handleAddToCart} />
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
