import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { handleAddToCart } from "../Functions/functionApi";
import Loading from "../shared/Loading";

const SingleProductPage = ({ updateCartItemCount }) => {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      setLoading(true);
      try {
        const [productRes, relatedRes] = await Promise.all([
          axios.get(`https://api.zonesparks.org/products/${productId}/`),
          axios.get(
            `https://api.zonesparks.org/products/related-product/${productId}/`
          ),
        ]);
        setProduct(productRes.data);
        setSelectedVariant(0); // default to the first variant
        setRelatedProducts(relatedRes.data.products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product data:", error);
        toast.error("Failed to load product information");
        setLoading(false);
      }
    };

    fetchProductAndRelated();
  }, [productId]);

  const handleVariantChange = (variantId) => {
    const variantIndex = product.variants.findIndex(
      (variant) => variant.id === variantId
    );
    setSelectedVariant(variantIndex);
    setQuantity(1);
  };

  const handleQuantityChange = (newQuantity) => {
    setQuantity(
      Math.max(
        1,
        Math.min(newQuantity, product.variants[selectedVariant].stock)
      )
    );
  };

  const handleAddToCartClick = async () => {
    const selectedVariantObj = product.variants[selectedVariant];
    if (selectedVariantObj) {
      try {
        await handleAddToCart(product, selectedVariantObj, updateCartItemCount);
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    } else {
      toast.error("Please select a variant");
    }
  };

  if (loading) return <Loading />;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={
              product.images[product.variants[selectedVariant].image]?.image ||
              product.images[0].image
            }
            alt={product.title}
            className="w-full h-auto object-cover"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-gray-600 mb-4">{product.short_desc}</p>
          <p className="text-2xl font-bold mb-4">
            ${product.variants[selectedVariant]?.selling_price}
          </p>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Variants:</h3>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => handleVariantChange(variant.id)}
                  className={`px-3 py-1 border rounded ${
                    variant.id === product.variants[selectedVariant].id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {variant.size && variant.color
                    ? `${variant.size} - ${variant.color}`
                    : variant.size || variant.color}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Quantity:</h3>
            <div className="flex items-center">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="px-3 py-1 border rounded-l"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                className="w-16 text-center border-t border-b"
              />
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="px-3 py-1 border rounded-r"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCartClick}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            disabled={
              !product.variants[selectedVariant] ||
              product.variants[selectedVariant].stock === 0
            }
          >
            {product.variants[selectedVariant] &&
            product.variants[selectedVariant].stock > 0
              ? "Add to Cart"
              : "Out of Stock"}
          </button>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedProducts.map((relatedProduct) => (
            <div
              key={relatedProduct.id}
              className="border p-4 rounded cursor-pointer"
            >
              <Link to={`/products/${relatedProduct.id}`}>
                <img
                  src={relatedProduct.images[0].thumb}
                  alt={relatedProduct.title}
                  className="w-full h-40 object-cover mb-2"
                />
                <h3 className="font-semibold">{relatedProduct.title}</h3>
                <p className="text-gray-500 mb-2">
                  {relatedProduct.short_desc}
                </p>
              </Link>

              <p className="text-gray-600">
                ${relatedProduct.variants[0].selling_price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
