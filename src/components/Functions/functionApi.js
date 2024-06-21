import axios from "axios";
import { toast } from "react-toastify";

const accessToken = localStorage.getItem("accessToken");

export const handleAddToCart = async (product, variant, updateCartItemCount) => {
    const { id, color, size, stock, image: variantImageIndex } = variant;
    let imageIndex = 0; // Default to 0

    // Find the correct image index for the selected variant
    if (typeof variantImageIndex === "number" && variantImageIndex >= 0 && variantImageIndex < product.images.length) {
        imageIndex = variantImageIndex;
    }

    const quantity = 1;

    if (stock >= quantity) {
        try {
            let cartResponse = await axios.get("https://api.zonesparks.org/cart/", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            let cartId;
            if (cartResponse.data.length === 0) {
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

            const newItem = await addToCart(
                cartId,
                product.id,
                color,
                size,
                imageIndex,
                quantity
            );

            if (newItem) {
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
export const addToCart = async (
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