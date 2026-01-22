import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

import Modal from "../components/Modal";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: "", msg: "", type: "info" });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      login(res.data.token);
      navigate("/generate");
    } catch (err) {
      setModal({
        isOpen: true,
        title: "Login Failed",
        msg: err.response?.data?.message || "Invalid credentials",
        type: "danger"
      });
    }
  };

  return (
    <div className="container center-flex" style={{ minHeight: "calc(100vh - 80px)" }}>
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        type={modal.type}
      >
        {modal.msg}
      </Modal>
      <div className="glass-card auth-container">
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Welcome Back</h2>
        <form onSubmit={submit}>
          <input
            placeholder="Email"
            type="email"
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
          <div style={{ position: "relative", marginBottom: "15px" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              style={{ paddingRight: "40px", width: "100%", marginBottom: "0" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0",
                display: "flex",
                alignItems: "center",
                color: "var(--text-secondary, #888)",
                width: "auto",
                marginTop: "0" // Override potential global button styles
              }}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              )}
            </button>
          </div>
          <button style={{ width: "100%", marginTop: "10px" }}>Login</button>
        </form>
        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "0.9rem" }}>
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}
