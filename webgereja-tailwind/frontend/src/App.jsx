import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
// import {Routes, Route} from "react-router-dom";

import Header from "./component/Header.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import ProfilGereja from "./pages/ProfilGereja.jsx";

function App() {

  // dark mode global
  const [theme, setTheme] = useState(() => {
    if (localStorage.getItem("theme")) {
      return localStorage.getItem("theme");
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem("theme", theme);
    theme === "dark" ? root.classList.add("dark") : root.classList.remove("dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman utama */}
        <Route path="/" element={<Header theme={theme} toggleTheme={toggleTheme} />} />

        {/* Login admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/profile" element={<ProfilGereja theme={theme} toggleTheme={toggleTheme} />} />

        {/* Dashboard admin (proteksi JWT) */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
