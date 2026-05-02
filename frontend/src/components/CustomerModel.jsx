import { useState, useEffect } from "react";

const STATUSES = ["Lead", "Active", "Prospect", "Churned"];

const Field = ({ label, type = "text", placeholder, required, value, onChange, error }) => (
  <div>
    <label className="block text-sm font-medium text-slate-300 mb-1.5">
      {label} {required && <span className="text-cyan-400">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full bg-slate-800 border ${error ? "border-red-500" : "border-slate-700"} rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all text-sm`}
    />
    {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
  </div>
);

export default function CustomerModal({ customer, onClose, onSave }) {
  const [form, setForm] = useState(() => 
    customer || { name: "", email: "", phone: "", company: "", status: "Lead", notes: "" }
  );
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setForm(customer);
    } else {
      setForm({ name: "", email: "", phone: "", company: "", status: "Lead", notes: "" });
    }
  }, [customer]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    if (form.phone && !/^[\d\s+\-()]{7,15}$/.test(form.phone)) errs.phone = "Invalid phone number";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    await onSave(form);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            {customer ? "Edit Customer" : "Add Customer"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Full Name" name="name" placeholder="John Smith" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} error={errors.name} />
            <Field label="Email" name="email" type="email" placeholder="john@co.com" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} error={errors.email} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone" name="phone" placeholder="+1 555 000 0000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} error={errors.phone} />
            <Field label="Company" name="company" placeholder="Acme Inc." value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Status</label>
            <div className="flex gap-2 flex-wrap">
              {STATUSES.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm({ ...form, status: s })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    form.status === s
                      ? s === "Active" ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                        : s === "Lead" ? "bg-cyan-500/20 border-cyan-500 text-cyan-400"
                        : s === "Prospect" ? "bg-violet-500/20 border-violet-500 text-violet-400"
                        : "bg-red-500/20 border-red-500 text-red-400"
                      : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"
                  }`}
                >{s}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              placeholder="Any additional notes..."
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all text-sm resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl text-sm transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" /> : null}
              {customer ? "Save Changes" : "Add Customer"}
            </button>
          </div>
        </form>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&display=swap');`}</style>
    </div>
  );
}