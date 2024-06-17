import React, { useState } from "react";

const ProductCard = ({ product, addToCart }) => {
  const [selectedVariant, setSelectedVariant] = useState(0);

  const handleVariantChange = (variantId) => {
    const variantIndex = product.variants.findIndex(
      (variant) => variant.id === variantId
    );
    setSelectedVariant(variantIndex);
  };

  return (
    <div className="border border-gray-300 rounded-md p-4">
      <img
        src={
          product.images.find((image) => image.variant_id === selectedVariant)
            ?.thumb || product.images[0].thumb
        }
        alt={product.title}
        className="w-full h-48 object-cover mb-4"
      />
      <h2 className="text-lg font-semibold mb-2">{product.title}</h2>
      <p className="text-gray-500 mb-2">{product.short_desc}</p>
      <p className="text-gray-900 font-bold">
        ${product.variants[selectedVariant].selling_price}
      </p>

      <div className="mt-4">
        <div className="flex flex-wrap items-center">
          <span className="font-semibold">Varients</span>
          {product.variants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => handleVariantChange(variant.id)}
              className={`p-2 m-1 border rounded ${
                variant.id === product.variants[selectedVariant].id
                  ? "border-blue-500"
                  : "border-gray-300"
              }`}
            >
              {variant.size && variant.color
                ? `${variant.size} - ${variant.color}`
                : variant.size || variant.color}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => addToCart(product, product.variants[selectedVariant])}
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
