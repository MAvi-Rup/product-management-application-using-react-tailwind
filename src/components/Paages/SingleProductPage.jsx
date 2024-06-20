import axios from "axios";
import React, { useEffect, useState } from "react";

const SingleProductPage = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    fetchProductDetails();
    fetchRelatedProducts();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(
        `https://api.zonesparks.org/products/${productId}/`
      );
      setProduct(response.data);
      setSelectedVariant(response.data.variants[0]);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await axios.get(
        `https://api.zonesparks.org/products/related-product/${productId}/`
      );
      setRelatedProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
  };

  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10);
    setQuantity(newQuantity);
  };

  const handleAddToCart = async () => {
    // Implement add to cart logic here
    // You can use the selectedVariant and quantity values
    console.log("Add to cart:", selectedVariant, quantity);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.short_desc}</p>
      <img src={product.images[0].image} alt={product.title} />

      <h2>Variants</h2>
      <div>
        {product.variants.map((variant) => (
          <div key={variant.code}>
            <label>
              <input
                type="radio"
                name="variant"
                value={variant.code}
                checked={selectedVariant === variant}
                onChange={() => handleVariantChange(variant)}
              />
              {variant.size} - {variant.color} - {variant.stock} in stock
            </label>
          </div>
        ))}
      </div>

      <div>
        <label>
          Quantity:
          <input
            type="number"
            min="1"
            max={selectedVariant ? selectedVariant.stock : 1}
            value={quantity}
            onChange={handleQuantityChange}
          />
        </label>
      </div>

      <button onClick={handleAddToCart}>Add to Cart</button>

      <h2>Related Products</h2>
      <div>
        {relatedProducts.map((product) => (
          <div key={product.id}>
            <h3>{product.title}</h3>
            <img src={product.images[0].thumb} alt={product.title} />
            <p>Price: {product.selling_price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SingleProductPage;
