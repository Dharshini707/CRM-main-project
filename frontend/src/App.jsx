import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { AuthContext } from "./contexts/AuthContext";

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("login");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("crm_token");
    const userData = localStorage.getItem("crm_user");
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setPage("dashboard");
      } catch {
        // Invalid user data, clear it
        localStorage.removeItem("crm_token");
        localStorage.removeItem("crm_user");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("crm_token", token);
    localStorage.setItem("crm_user", JSON.stringify(userData));
    setUser(userData);
    setPage("dashboard");
  };

  const logout = () => {
    localStorage.removeItem("crm_token");
    localStorage.removeItem("crm_user");
    setUser(null);
    setPage("login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <div className="min-h-screen bg-slate-950 font-sans">
        {page === "login" && <Login onNavigate={setPage} />}
        {page === "signup" && <Signup onNavigate={setPage} />}
        {page === "dashboard" && <Dashboard />}
      </div>
    </AuthContext.Provider>
  );
}