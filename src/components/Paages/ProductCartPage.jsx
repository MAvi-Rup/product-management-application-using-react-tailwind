import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../shared/Loading";

const ProductCartPage = ({ updateCartItemCount }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const accessToken = localStorage.getItem("accessToken");

  const fetchCart = useCallback(async () => {
    try {
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
      await axios.patch(
        `https://api.zonesparks.org/cart/${cart.id}/items/`,
        [{ id: itemId, quantity: newQuantity }],
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Fetch the updated cart data
      await fetchCart();
      updateCartItemCount();
      toast.success("Quantity updated successfully");
    } catch (err) {
      console.error("Error updating quantity:", err);
      toast.error("Failed to update quantity. Please try again.");
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

      // Fetch the updated cart data
      await fetchCart();
      updateCartItemCount();
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error("Failed to remove item. Please try again.");
    }
  };

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );
  if (error) return <div>{error}</div>;
  if (!cart || cart.items.length === 0) return <div>Your cart is empty.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {console.log(cart.items)}
      {cart.items.map((item) => (
        <div
          key={item.id}
          className="border-b py-4 flex items-center justify-between"
        >
          {console.log(item)}
          <div className="flex items-center">
            <img
              src={item.product.images[item.image]?.thumb}
              alt={item.product.title}
              className="w-20 h-20 object-cover mr-4"
            />
            <div>
              <h2 className="font-semibold">{item.product.title}</h2>
              <p>
                Size: {item.size}, Color: {item.color}
              </p>
              <p>Price: ${parseFloat(item.sub_total).toFixed(2)}</p>
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
          Total: ${parseFloat(cart.grand_total).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default ProductCartPage;
