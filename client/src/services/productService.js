import API from "./api";

export const fetchProducts = (params = {}) =>
  API.get("/products", { params });

export const fetchProduct = (id) => API.get(`/products/${id}`);

export const fetchStats = () => API.get("/products/stats/dashboard");

export const createProduct = (formData) =>
  API.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateProduct = (id, formData) =>
  API.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteProduct = (id) => API.delete(`/products/${id}`);