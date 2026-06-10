const BASE_URL = "https://fakestoreapi.com";

export const getProducts = async () => {
  const response = await fetch(`${BASE_URL}/products`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await response.json();

  return data;
};

export const getProductById = async (id) => {
  const response = await fetch(`${BASE_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  const data = await response.json();
  return data;
};

export const getCategories = async () => {
  const response = await fetch(`${BASE_URL}/products/categories`);

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const data = await response.json();
  return data;
};

export const getProductsByCategory = async (category) => {
  const response = await fetch(`${BASE_URL}/products/category/${encodeURIComponent(category)}`);

  if (!response.ok) {
    throw new Error("Failed to fetch products for category");
  }

  const data = await response.json();
  return data;
};
