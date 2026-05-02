import { useState } from "react";
import { authAPI } from "../api";
import { useAuth } from "../contexts/AuthContext";

export default function Login({ onNavigate }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Min 6 characters";
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setErrors({});
    setApiError("");
    setLoading(true);
    try {
      console.log("Attempting login with:", { email: form.email, password: "***" });
      const data = await authAPI.login(form);
      console.log("Login successful:", data);
      login(data.user, data.token);
    } catch (err) {
      console.error("Login failed:", err);
      setApiError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      {/* Background grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      {/* Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-400/30">
              <svg className="w-6 h-6 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
              </svg>
            </div>
            <span className="text-2xl font-black tracking-tight text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
              NEXUS<span className="text-cyan-400">CRM</span>
            </span>
          </div>
          <p className="text-slate-400 text-sm">Sign in to your workspace</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-black/50">
          <h1 className="text-xl font-bold text-white mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>Welcome back</h1>

          {apiError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Login Failed</span>
              </div>
              <p className="text-red-300">{apiError}</p>
              <p className="text-xs text-slate-400 mt-2">Please check your email and password, or try resetting your password.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email address</label>
              <input
                type="text"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@company.com"
                className={`w-full bg-slate-800 border ${errors.email ? "border-red-500" : "border-slate-700"} rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm`}
              />
              {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full bg-slate-800 border ${errors.password ? "border-red-500" : "border-slate-700"} rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>}
              <p className="mt-1 text-xs text-slate-500">Use the eye icon to show/hide your password</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold py-3 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                  Signing in...
                </>
              ) : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <button onClick={() => onNavigate("signup")} className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
              Create one
            </button>
          </p>
        </div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&display=swap');`}</style>
    </div>
  );
}