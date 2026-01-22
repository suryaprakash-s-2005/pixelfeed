import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Generate = lazy(() => import("./pages/Generate"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Profile = lazy(() => import("./pages/Profile"));

const Loading = () => (
  <div className="center-flex" style={{ height: "calc(100vh - 80px)", fontSize: "1.5rem", color: "var(--text-secondary)" }}>
    Loading Magic... ✨
  </div>
);

export default function App() {
  const { isAuth } = useAuth();

  return (
    <ThemeProvider>
      <Navbar />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Navigate to="/generate" />} />
          <Route path="/login" element={!isAuth ? <Login /> : <Navigate to="/generate" />} />
          <Route path="/register" element={!isAuth ? <Register /> : <Navigate to="/generate" />} />
          <Route path="/generate" element={isAuth ? <Generate /> : <Navigate to="/login" />} />
          <Route path="/gallery" element={isAuth ? <Gallery /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuth ? <Profile /> : <Navigate to="/login" />} />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}
