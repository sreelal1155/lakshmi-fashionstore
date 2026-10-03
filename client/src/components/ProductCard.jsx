import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.imageUrl} alt={product.name} loading="lazy" />
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="category">
          {product.mainCategory} • {product.subcategory}
        </p>
        <p className="price">₹{product.price}</p>
        {!product.inStock && <span className="badge-out">Out of Stock</span>}
        <Link to={`/product/${product._id}`} className="btn-view">
          View Details
        </Link>
      </div>
    </div>
  );
}