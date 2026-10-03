import { useState, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const activeCategory = searchParams.get("category") || "";
  const isHome = location.pathname === "/" && !activeCategory;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <>
      {/* Announcement bar */}
      <div className="lf-topbar">
        <p>
          ✨ Free delivery on orders above ₹999 · Order on WhatsApp{" "}
          <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer">
            +91 99999 99999
          </a>
        </p>
      </div>

      <nav className={`lf-navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="lf-nav-inner">
          {/* Logo — always goes Home */}
          <Link to="/" className="lf-logo">
            <span className="lf-logo-mark">LF</span>
            <span className="lf-logo-text">
              LAKSHMI
              <em>Fashions</em>
            </span>
          </Link>

          {/* Desktop menu */}
          <div className="lf-menu">
            <Link to="/" className={`lf-link ${isHome ? "active" : ""}`}>
              Home
            </Link>
            <Link
              to="/?category=Ladies"
              className={`lf-link ${activeCategory === "Ladies" ? "active" : ""}`}
            >
              Ladies
            </Link>
            <Link
              to="/?category=Kids"
              className={`lf-link ${activeCategory === "Kids" ? "active" : ""}`}
            >
              Kids
            </Link>
            <a
              href="#contact"
              className="lf-link"
              onClick={(e) => {
                e.preventDefault();
                const el = document.querySelector(".cs-footer");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Contact
            </a>
          </div>

          {/* CTA */}
          <div className="lf-actions">
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noreferrer"
              className="lf-whatsapp-btn"
            >
              <i className="fab fa-whatsapp" />
              <span>Order Now</span>
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`lf-menu-btn ${menuOpen ? "open" : ""}`}
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* Mobile drawer — also using Link */}
        <div className={`lf-mobile-menu ${menuOpen ? "open" : ""}`}>
          <Link to="/">Home</Link>
          <Link to="/?category=Ladies">Ladies</Link>
          <Link to="/?category=Kids">Kids</Link>
          <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer">
            Contact on WhatsApp
          </a>
        </div>
      </nav>
    </>
  );
}