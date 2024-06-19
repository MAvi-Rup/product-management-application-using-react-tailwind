import axios from "axios";
import React, { useEffect, useState } from "react";
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
  const [userCart, setUserCart] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = React.useRef(null);

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

  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      const cart = await fetchUserCart();
      setUserCart(cart);
      setIsLoading(false);
    };
    fetchCart();
  }, []);

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

  const fetchUserCart = async () => {
    try {
      const response = await axios.get("https://api.zonesparks.org/cart/");
      return response.data;
    } catch (error) {
      console.error("Error fetching user cart:", error);
      return [];
    }
  };

  const addToCart = async (cartId, productId, color, size, image, quantity) => {
    try {
      const response = await axios.post(
        `https://api.zonesparks.org/cart/${cartId}/items/`,
        {
          product_id: productId,
          color,
          size,
          image,
          quantity,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding product to cart:", error);
      return null;
    }
  };

  const updateCartItemQuantity = async (cartId, itemId, newQuantity) => {
    try {
      const response = await axios.patch(
        `https://api.zonesparks.org/cart/${cartId}/items/`,
        [
          {
            id: itemId,
            quantity: newQuantity,
          },
        ]
      );
      return response.data;
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      return null;
    }
  };

  const handleAddToCart = async (product, variant) => {
    const { id, color, size, images, variants } = variant;
    const image = images.findIndex((img) => img.variant_id === id);
    const stock = variants.stock;
    const quantity = 1; // Add logic to handle quantity input or use a default value

    if (stock >= quantity) {
      const cartId = userCart.length > 0 ? userCart[0].id : null;
      const newItem = await addToCart(
        cartId,
        product.id,
        color,
        size,
        image,
        quantity
      );
      if (newItem) {
        setUserCart((prevCart) => {
          if (prevCart.length === 0) {
            return [
              {
                id: newItem.id,
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
      }
    } else {
      console.error("Product is out of stock");
    }
  };

  const handleUpdateCartItemQuantity = async (itemId, newQuantity) => {
    const cartId = userCart.length > 0 ? userCart[0].id : null;
    const updatedItem = await updateCartItemQuantity(
      cartId,
      itemId,
      newQuantity
    );
    if (updatedItem) {
      setUserCart((prevCart) => {
        const updatedCart = { ...prevCart[0] };
        const updatedItems = updatedCart.items.map((item) =>
          item.id === itemId ? updatedItem : item
        );
        updatedCart.items = updatedItems;
        updatedCart.grand_total = updatedItems.reduce(
          (total, item) => total + item.sub_total,
          0
        );
        return [updatedCart];
      });
    }
  };

  const handleRemoveFromCart = (itemId) => {
    setUserCart((prevCart) => {
      const updatedCart = { ...prevCart[0] };
      const updatedItems = updatedCart.items.filter(
        (item) => item.id !== itemId
      );
      updatedCart.items = updatedItems;
      updatedCart.grand_total = updatedItems.reduce(
        (total, item) => total + item.sub_total,
        0
      );
      return [updatedCart];
    });
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

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <ProductFilter filters={filters} setFilters={setFilters} />
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">Cart</h2>
            {isLoading ? (
              <p>Loading...</p>
            ) : userCart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <ul>
                {userCart[0].items.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center mb-2"
                  >
                    {item.product.title}
                    <div>
                      <button
                        onClick={() =>
                          handleUpdateCartItemQuantity(
                            item.id,
                            item.quantity - 1
                          )
                        }
                        disabled={item.quantity === 1}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                      >
                        -
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleUpdateCartItemQuantity(
                            item.id,
                            item.quantity + 1
                          )
                        }
                        disabled={item.quantity === item.product.variants.stock}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
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
          <ProductList products={products} addToCart={handleAddToCart} />
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
