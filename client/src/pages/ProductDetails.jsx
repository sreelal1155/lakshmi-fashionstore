import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchProduct } from "../services/productService";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await fetchProduct(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const orderOnWhatsApp = () => {
    const phone = "8943179211"; // 👈 CHANGE THIS to your real number
    const message = `Hello! I'm interested in this product:\n\n*${product.name}*\nCategory: ${product.mainCategory} - ${product.subcategory}\nPrice: ₹${product.price}\nSize: ${product.size || "N/A"}\n\nLink: ${window.location.href}`;
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  if (loading) return <><Navbar /><p className="container">Loading...</p></>;
  if (!product) return <><Navbar /><p className="container">Product not found.</p></>;

  return (
    <>
      <Navbar />
      <div className="product-details container">
        <Link to="/" className="back-link">← Back</Link>
        <div className="details-grid">
          <img src={product.imageUrl} alt={product.name} />
          <div className="details-info">
            <h1>{product.name}</h1>
            <p className="price">₹{product.price}</p>
            <p><strong>Category:</strong> {product.mainCategory} → {product.subcategory}</p>
            <p><strong>Size:</strong> {product.size || "N/A"}</p>
            <p><strong>Availability:</strong> {product.inStock ? "In Stock" : "Out of Stock"}</p>
            <p className="description">{product.description}</p>
            <button
              className="whatsapp-btn"
              onClick={orderOnWhatsApp}
              disabled={!product.inStock}
            >
              📱 Order on WhatsApp
            </button>
          </div>
        </div>
      </div>
    </>
  );
}