import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuth, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    color: isActive(path) ? "var(--accent)" : "var(--text-primary)",
    fontWeight: isActive(path) ? "700" : "500",
    fontSize: "1.2rem",
    textDecoration: "none",
    padding: "10px 0",
    display: "block"
  });

  const desktopLinkStyle = (path) => ({
    color: isActive(path) ? "var(--accent)" : "var(--text-primary)",
    fontWeight: isActive(path) ? "700" : "500",
    marginLeft: "20px",
    textDecoration: "none"
  });

  return (
    <>
      <header className="navbar-header">
        <div className="mobile-only nav-left">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "transparent", padding: 0, color: "var(--text-primary)", display: "flex" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "1.8rem" }}>{menuOpen ? "close" : "menu"}</span>
          </button>
        </div>

        <div className="nav-brand">
          <Link to="/" style={{ fontSize: "1.5rem", fontWeight: "bold", background: "linear-gradient(90deg, var(--accent), var(--accent-hover))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textDecoration: "none" }}>
            PixelFeed
          </Link>
        </div>

        <div className="nav-right">
          <nav className="desktop-only" style={{ display: "flex", alignItems: "center", marginRight: "20px" }}>
            {isAuth && (
              <>
                <Link to="/generate" style={desktopLinkStyle("/generate")}>Create</Link>
                <Link to="/gallery" style={desktopLinkStyle("/gallery")}>Feed</Link>
                <Link to="/profile" style={desktopLinkStyle("/profile")}>Profile</Link>
                <button onClick={handleLogout} style={{ marginLeft: "20px", padding: "8px 16px" }}>
                  Logout
                </button>
              </>
            )}
            {!isAuth && (
              <>
                <Link to="/login" style={desktopLinkStyle("/login")}>Login</Link>
                <Link to="/register" style={{ ...desktopLinkStyle("/register"), border: "1px solid var(--accent)", padding: "8px 16px", borderRadius: "8px", color: "var(--accent)" }}>
                  Get Started
                </Link>
              </>
            )}
          </nav>

          <button
            onClick={toggleTheme}
            style={{ background: "transparent", padding: 0, display: "flex", alignItems: "center", color: "var(--text-primary)" }}
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            <span className="material-symbols-outlined">
              {theme === "light" ? "dark_mode" : "light_mode"}
            </span>
          </button>
        </div>
      </header>

      {menuOpen && (
        <div style={{
          position: "fixed",
          top: "80px",
          left: 0,
          width: "100%",
          height: "calc(100vh - 80px)",
          background: "var(--bg-primary)",
          zIndex: 99,
          padding: "40px",
          boxSizing: "border-box",
          animation: "slideRight 0.3s ease",
          overflowY: "auto"
        }}>
          <nav style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {isAuth && (
              <>
                <Link to="/generate" style={linkStyle("/generate")} onClick={() => setMenuOpen(false)}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span className="material-symbols-outlined">add_circle</span> Create
                  </div>
                </Link>
                <Link to="/gallery" style={linkStyle("/gallery")} onClick={() => setMenuOpen(false)}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span className="material-symbols-outlined">grid_view</span> Community Feed
                  </div>
                </Link>
                <Link to="/profile" style={linkStyle("/profile")} onClick={() => setMenuOpen(false)}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span className="material-symbols-outlined">person</span> My Profile
                  </div>
                </Link>
                <hr style={{ borderColor: "var(--glass-border)", width: "100%" }} />
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} style={{ padding: "15px", width: "100%", textAlign: "left", background: "rgba(255, 50, 50, 0.1)", color: "#ff4b4b", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span className="material-symbols-outlined">logout</span> Logout
                </button>
              </>
            )}
            {!isAuth && (
              <>
                <Link to="/login" style={linkStyle("/login")} onClick={() => setMenuOpen(false)}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span className="material-symbols-outlined">login</span> Login
                  </div>
                </Link>
                <Link to="/register" style={{ ...linkStyle("/register"), color: "var(--accent)" }} onClick={() => setMenuOpen(false)}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span className="material-symbols-outlined">rocket_launch</span> Get Started
                  </div>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
      <style>{`
        @keyframes slideRight { from { transform: translateX(-100%); } to { transform: translateX(0); } }
      `}</style>
    </>
  );
}
