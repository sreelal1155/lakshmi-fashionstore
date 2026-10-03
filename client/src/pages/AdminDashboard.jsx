import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchProducts,
  fetchStats,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";

const emptyForm = {
  name: "",
  mainCategory: "Ladies",
  subcategory: "",
  price: "",
  size: "",
  description: "",
  inStock: true,
};

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ total: 0, ladies: 0, kids: 0, outOfStock: 0 });
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  if (!localStorage.getItem("adminAccessToken")) {
    navigate("/admin/login");
    return;
  }
  loadData();
}, []);

  const loadData = async () => {
  try {
    const [pRes, sRes] = await Promise.all([fetchProducts(), fetchStats()]);
    setProducts(pRes.data);
    setStats(sRes.data);
  } catch (err) {
    // Interceptor already handles 401 by refreshing or redirecting
    console.error(err);
  }
};

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (image) fd.append("image", image);

    try {
      if (editingId) {
        await updateProduct(editingId, fd);
      } else {
        if (!image) return alert("Image required");
        await createProduct(fd);
      }
      resetForm();
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving product");
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      mainCategory: product.mainCategory,
      subcategory: product.subcategory,
      price: product.price,
      size: product.size,
      description: product.description,
      inStock: product.inStock,
    });
    setEditingId(product._id);
    setImage(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product and its image?")) return;
    await deleteProduct(id);
    loadData();
  };

  const resetForm = () => {
    setForm(emptyForm);
    setImage(null);
    setEditingId(null);
    setShowForm(false);
  };

  const logout = () => {
  localStorage.removeItem("adminAccessToken");
  localStorage.removeItem("adminRefreshToken");
  localStorage.removeItem("adminName");
  navigate("/admin/login");
};

  return (
    <div className="admin-dashboard container">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <div>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? "Cancel" : "+ Add Product"}
          </button>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card"><h3>{stats.total}</h3><p>Total Products</p></div>
        <div className="stat-card"><h3>{stats.ladies}</h3><p>Ladies</p></div>
        <div className="stat-card"><h3>{stats.kids}</h3><p>Kids</p></div>
        <div className="stat-card"><h3>{stats.outOfStock}</h3><p>Out of Stock</p></div>
      </div>

      {showForm && (
        <form className="product-form" onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit Product" : "Add Product"}</h2>
          <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required />
          <select name="mainCategory" value={form.mainCategory} onChange={handleChange}>
            <option value="Ladies">Ladies</option>
            <option value="Kids">Kids</option>
          </select>
          <input name="subcategory" placeholder="Subcategory (e.g. Kurtis)" value={form.subcategory} onChange={handleChange} required />
          <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
          <input name="size" placeholder="Size (e.g. S, M, L)" value={form.size} onChange={handleChange} />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
          <label className="checkbox">
            <input type="checkbox" name="inStock" checked={form.inStock} onChange={handleChange} />
            In Stock
          </label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          <button type="submit" className="btn-primary">{editingId ? "Update" : "Create"}</button>
        </form>
      )}

      <div className="admin-products">
        <h2>All Products</h2>
        <table>
          <thead>
            <tr>
              <th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td><img src={p.imageUrl} alt={p.name} /></td>
                <td>{p.name}</td>
                <td>{p.mainCategory} / {p.subcategory}</td>
                <td>₹{p.price}</td>
                <td>{p.inStock ? "✅" : "❌"}</td>
                <td>
                  <button onClick={() => handleEdit(p)}>Edit</button>
                  <button onClick={() => handleDelete(p._id)} className="btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}