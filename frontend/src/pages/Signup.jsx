import { useState } from "react";
import { authAPI } from "../api";
import { useAuth } from "../contexts/AuthContext";

const Field = ({ label, name, type = "text", placeholder, value, onChange, error }) => (
  <div>
    <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full bg-slate-800 border ${error ? "border-red-500" : "border-slate-700"} rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm`}
    />
    {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
  </div>
);

export default function Signup({ onNavigate }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email format";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Min 6 characters";
    if (!form.confirmPassword) errs.confirmPassword = "Please confirm password";
    else if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setErrors({});
    setApiError("");
    setLoading(true);
    try {
      console.log("Attempting registration with:", { email: form.email, password: "***", name: form.name });
      const data = await authAPI.register({ name: form.name, email: form.email, password: form.password });
      console.log("Registration successful:", data);
      login(data.user, data.token);
    } catch (err) {
      console.error("Registration failed:", err);
      setApiError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="fixed top-0 right-0 w-96 h-96 bg-violet-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
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
          <p className="text-slate-400 text-sm">Create your free workspace</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-black/50">
          <h1 className="text-xl font-bold text-white mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>Get started</h1>

          {apiError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Full name" name="name" placeholder="John Smith" value={form.name} onChange={handleChange} error={errors.name} />
            <Field label="Email address" name="email" placeholder="you@company.com" value={form.email} onChange={handleChange} error={errors.email} />
            <Field label="Password" name="password" type="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} error={errors.password} />
            <Field label="Confirm password" name="confirmPassword" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold py-3 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                  Creating account...
                </>
              ) : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <button onClick={() => onNavigate("login")} className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
              Sign in
            </button>
          </p>
        </div>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&display=swap');`}</style>
    </div>
  );
}