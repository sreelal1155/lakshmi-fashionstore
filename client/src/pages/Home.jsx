import { useEffect, useState } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../services/productService";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const category = searchParams.get("category") || "";

  // Re-fetch whenever the query string changes (e.g. ?category=Kids)
  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      console.log("🔍 Fetching:", { category, search });
      const { data } = await fetchProducts({ category, search });
      console.log("✅ Returned:", data);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Fetch failed:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadProducts();
  };

  const setCategory = (cat) => {
    if (cat) setSearchParams({ category: cat });
    else setSearchParams({});
  };

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section
        className="cs-hero"
        style={{
          position: "relative",
          height: "70vh",
          minHeight: "480px",
          display: "flex",
          alignItems: "center",
          background:
            "linear-gradient(135deg, #2b1b22 0%, #7a2b45 55%, #b8926a 100%)",
          color: "#fff",
        }}
      >
        <div
          className="cs-container"
          style={{ position: "relative", zIndex: 2, padding: "0 3rem" }}
        >
          <div className="cs-hero-subtitle">
            {category ? `${category} Collection` : "New Collection 2026"}
          </div>
          <h1 className="cs-hero-title" style={{ maxWidth: "720px" }}>
            Elegant Fashion <br /> for Ladies & Kids
          </h1>
          <p className="cs-hero-text">
            Handpicked styles, quality fabrics, delivered with love — order
            easily on WhatsApp.
          </p>
          <div className="cs-hero-buttons">
            <Link to="/?category=Ladies" className="cs-btn cs-btn-primary">
              Shop Ladies
            </Link>
            <Link to="/?category=Kids" className="cs-btn cs-btn-outline">
              Shop Kids
            </Link>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="cs-section">
        <div className="cs-container">
          <div className="cs-features">
            {[
              { icon: "✨", title: "Handpicked", text: "Curated for quality" },
              { icon: "🚚", title: "Fast Delivery", text: "Quick dispatch" },
              { icon: "💬", title: "WhatsApp Order", text: "No forms, no fuss" },
              { icon: "💝", title: "Fair Prices", text: "Premium yet affordable" },
            ].map((f, i) => (
              <div className="cs-feature-card" key={i}>
                <div className="cs-feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="cs-section cs-section-alt">
        <div className="cs-container">
          <div className="cs-section-header">
            <div className="cs-section-subtitle">
              {category ? "Browse" : "Just For You"}
            </div>
            <h2 className="cs-section-title">
              {category ? `${category} Collection` : "Featured Collection"}
            </h2>
          </div>

          <div className="cs-filters">
            <form onSubmit={handleSearch} className="cs-search-bar">
              <input
                type="text"
                placeholder="Search products…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit">Search</button>
            </form>

            <div className="cs-category-pills">
              <button
                type="button"
                onClick={() => setCategory("")}
                className={!category ? "active" : ""}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setCategory("Ladies")}
                className={category === "Ladies" ? "active" : ""}
              >
                Ladies
              </button>
              <button
                type="button"
                onClick={() => setCategory("Kids")}
                className={category === "Kids" ? "active" : ""}
              >
                Kids
              </button>
            </div>
          </div>

          {loading ? (
            <p className="cs-empty">Loading products…</p>
          ) : products.length === 0 ? (
            <p className="cs-empty">
              No products in <strong>{category || "this category"}</strong> yet.
            </p>
          ) : (
            <div className="cs-product-grid">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="cs-cta">
        <div className="cs-container">
          <h2>Ready to Order?</h2>
          <p>Message us on WhatsApp — we'll take care of the rest.</p>
          <a
            href="https://wa.me/919999999999"
            target="_blank"
            rel="noreferrer"
            className="cs-btn cs-btn-whatsapp"
          >
            📱 Chat on WhatsApp
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="cs-footer">
        <div className="cs-container">
          <div className="cs-footer-grid">
            <div>
              <h3 className="cs-footer-logo">LAKSHMI FASHIONS</h3>
              <p>
                Quality ladies' and kids' clothing — carefully selected,
                affordably priced. Order easily on WhatsApp.
              </p>
            </div>
            <div>
              <h4>Shop</h4>
              <ul>
                <li>
                  <Link to="/?category=Ladies">Ladies</Link>
                </li>
                <li>
                  <Link to="/?category=Kids">Kids</Link>
                </li>
                <li>
                  <Link to="/">All Products</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4>Categories</h4>
              <ul>
                <li>Dresses</li>
                <li>Tops & Kurtis</li>
                <li>Sarees</li>
                <li>Boys & Girls</li>
              </ul>
            </div>
            <div>
              <h4>Contact</h4>
              <ul>
                <li>📱 WhatsApp Orders</li>
                <li>🕘 Mon – Sat, 9am – 8pm</li>
                <li>📍 Your City, India</li>
              </ul>
            </div>
          </div>
          <div className="cs-copyright">
            © {new Date().getFullYear()} LAKSHMI FASHIONS. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}