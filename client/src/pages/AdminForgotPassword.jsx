import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authService";

export default function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const { data } = await forgotPassword(email);
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        <p style={{ fontSize: "0.9rem", color: "#666", textAlign: "center" }}>
          Enter your admin email and we'll send you a reset link.
        </p>
        {message && <p style={{ color: "#0a0", fontSize: "0.9rem", textAlign: "center" }}>{message}</p>}
        {error && <p className="error">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
        <p style={{ textAlign: "center", fontSize: "0.9rem" }}>
          <Link to="/admin/login" style={{ color: "#d6336c" }}>
            ← Back to login
          </Link>
        </p>
      </form>
    </div>
  );
}