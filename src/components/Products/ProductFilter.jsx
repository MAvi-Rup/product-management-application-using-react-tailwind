import React, { useState } from "react";

const ProductFilter = ({ filters, setFilters }) => {
  const categories = [
    {
      id: 1,
      name: "Mom & Baby",
      slug: "mombaby-e023180a-a56e-4a10-8a46-5b68b17b1000",
    },
    {
      id: 2,
      name: "Women's Fashion",
      slug: "womensfashion-c29dbcaf-1e6e-4422-9020-31dd64b17493",
    },
    {
      id: 3,
      name: "Men's Fashion 69",
      slug: "mensfashion-2212c850-401e-4576-8d8f-9183f55dc66b",
    },
  ];

  const subCategories = [
    {
      id: 1,
      name: "Kid's Sweater",
      slug: "kidssweater-8baeb3ca-d35f-4d1a-a32c-d1ee49743639",
    },
    {
      id: 2,
      name: "Kid's Shirt",
      slug: "kidsshirt-e31f8bbf-2d58-4cb5-8f10-e112838f8e44",
    },
    {
      id: 3,
      name: "Sweaters",
      slug: "sweaters-2299d92b-3787-484d-b554-3e7c74c17107",
    },
    { id: 4, name: "Shirts", slug: "shirts-6e8d4f9d-8f9e-5c2b7c6b-7d1c9f8b" },
    {
      id: 5,
      name: "Smartphones",
      slug: "smartphones-4f9d8f9e-5c2b7c6b-7d1c9f8b-6e8d",
    },
    {
      id: 6,
      name: "Laptops",
      slug: "laptops-9d8f9e5c-2b7c6b7d-1c9f8b6e-8d4f9d",
    },
    {
      id: 7,
      name: "Kitchen Appliances",
      slug: "kitchenappliances-8d3c4c8e-9c8d6c9e-5d2b9c8f-2c4f9b",
    },
  ];

  const brands = [
    {
      id: 1,
      name: "INEXTENSO",
      slug: "inextenso-f61f8749-c5b0-4f3c-a9d7-63e6d0610ef1",
    },
    {
      id: 2,
      name: "No Brand",
      slug: "nobrand-a38d3ac8-79c5-470b-8e10-041b76465981",
    },
    {
      id: 3,
      name: "Jordache",
      slug: "jordache-8619aff7-5816-4c84-8087-4792f31a5247",
    },
    {
      id: 4,
      name: "HUDSON",
      slug: "hudson-7e71fa85-fb9c-465f-b077-4e749c3dd76b",
    },
    {
      id: 5,
      name: "DESTINATION",
      slug: "destination-f933e7e7-e8d2-41cb-9230-09e91fe73fb9",
    },
    {
      id: 6,
      name: "North Peak",
      slug: "northpeak-60cd5407-3f3e-430c-bae5-9e61c1827c2c",
    },

    {
      id: 9,
      name: "POLO CLUB",
      slug: "poloclub-f6ef9f62-7a80-4185-a588-3a4d70d8bdef",
    },
    {
      id: 9,
      name: "C&A",
      slug: "ca-49223b72-ed9f-47d4-a8e7-1293d3f65e1b",
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100000]);

  const handleCategoryChange = (e) => {
    setSelectedSubCategory("");
    setSelectedBrand("");
    setSelectedCategory(e.target.value);
    setFilters({ ...filters, category: e.target.value });
  };

  const handleSubCategoryChange = (e) => {
    setSelectedSubCategory(e.target.value);
    setFilters({ ...filters, subCategory: e.target.value });
  };

  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
    setFilters({ ...filters, brand: e.target.value });
  };

  const handlePriceRangeChange = (e, index) => {
    const newPriceRange = [...priceRange];
    newPriceRange[index] = e.target.value;
    setPriceRange(newPriceRange);
    setFilters({ ...filters, priceRange: newPriceRange });
  };

  return (
    <div className="mb-4 p-4 border border-gray-300 rounded-md">
      <div className="mb-4">
        <label className="block mb-2">Category</label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">All</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Sub-Category</label>
        <select
          value={selectedSubCategory}
          onChange={handleSubCategoryChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">All</option>
          {subCategories.map((subCategory) => (
            <option key={subCategory.id} value={subCategory.slug}>
              {subCategory.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Brand</label>
        <select
          value={selectedBrand}
          onChange={handleBrandChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">All</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.slug}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Price Range</label>
        <div className="flex space-x-2">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => handlePriceRangeChange(e, 0)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <span className="self-center">-</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => handlePriceRangeChange(e, 1)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
