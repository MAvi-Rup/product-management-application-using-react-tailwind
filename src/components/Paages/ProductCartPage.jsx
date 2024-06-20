import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

const ProductCartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const accessToken = localStorage.getItem("accessToken");

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://api.zonesparks.org/cart/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setCart(response.data[0] || { id: null, items: [], grand_total: 0 });
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch cart. Please try again.");
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateQuantity = async (itemId, newQuantity) => {
    if (!cart || !cart.id) return;

    try {
      const response = await axios.patch(
        `https://api.zonesparks.org/cart/${cart.id}/items/`,
        [{ id: itemId, quantity: newQuantity }],
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        fetchCart(); // Refresh cart data
        toast.success("Quantity updated successfully");
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        console.error("Response headers:", err.response.headers);

        if (err.response.status === 403) {
          toast.error(
            "You do not have permission to update the cart. Please try logging in again."
          );
        } else {
          toast.error(
            `Failed to update quantity: ${
              err.response.data.message || "Unknown error"
            }`
          );
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.error("No response received:", err.request);
        toast.error(
          "No response from server. Please check your internet connection."
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", err.message);
        toast.error(
          "An error occurred while updating quantity. Please try again."
        );
      }
    }
  };

  const removeItem = async (itemId) => {
    if (!cart || !cart.id) return;

    try {
      await axios.delete(
        `https://api.zonesparks.org/cart/${cart.id}/items/${itemId}/`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      fetchCart(); // Refresh cart data
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error("Failed to remove item. Please try again.");
    }
  };

  if (error) return <div>{error}</div>;
  if (!cart || cart.items.length === 0) return <div>Your cart is empty.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cart.items.map((item) => (
        <div
          key={item.id}
          className="border-b py-4 flex items-center justify-between"
        >
          <div className="flex items-center">
            <img
              src={item.product.images[item.image].thumb}
              alt={item.product.title}
              className="w-20 h-20 object-cover mr-4"
            />
            <div>
              <h2 className="font-semibold">{item.product.title}</h2>
              <p>
                Size: {item.size}, Color: {item.color}
              </p>
              <p>Price: ${item.product.selling_price}</p>
              <p
                className={
                  item.product.variants.stock > 0
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {item.product.variants.stock > 0 ? "In Stock" : "Out of Stock"}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={() =>
                updateQuantity(item.id, Math.max(1, item.quantity - 1))
              }
              className="px-2 py-1 bg-gray-200 rounded"
            >
              -
            </button>
            <span className="mx-2">{item.quantity}</span>
            <button
              onClick={() =>
                updateQuantity(
                  item.id,
                  Math.min(item.product.variants.stock, item.quantity + 1)
                )
              }
              className="px-2 py-1 bg-gray-200 rounded"
              disabled={item.quantity >= item.product.variants.stock}
            >
              +
            </button>
            <button
              onClick={() => removeItem(item.id)}
              className="ml-4 text-red-600"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <div className="mt-4 text-right">
        <p className="text-xl font-bold">
          Total: ${cart.grand_total.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default ProductCartPage;
