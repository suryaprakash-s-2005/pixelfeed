import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: "", msg: "", type: "info" });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      setModal({
        isOpen: true,
        title: "Welcome aboard! 🚀",
        msg: "Registration successful. Please login to start creating.",
        type: "success"
      });
    } catch (err) {
      setModal({
        isOpen: true,
        title: "Registration Failed",
        msg: err.response?.data?.message || "Something went wrong",
        type: "danger"
      });
    }
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
    if (modal.type === "success") {
      navigate("/login");
    }
  };

  return (
    <div className="container center-flex" style={{ minHeight: "calc(100vh - 80px)", padding: "20px 0" }}>
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        type={modal.type}
      >
        {modal.msg}
      </Modal>

      <div className="glass-card auth-container" style={{ maxWidth: "500px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Join PixelFeed</h2>
        <form onSubmit={submit}>
          <input
            placeholder="Name"
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="Username"
            onChange={e => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            placeholder="Email"
            type="email"
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
          <div>
            <div style={{ position: "relative", marginBottom: "5px" }}>
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
                  marginTop: "0"
                }}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0", marginBottom: "15px" }}>
              Must be 8+ chars with uppercase, number & special char.
            </p>
          </div>
          <button style={{ width: "100%", marginTop: "10px" }}>Create Account</button>
        </form>
        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "0.9rem" }}>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
