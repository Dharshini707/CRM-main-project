import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { customerAPI } from "../api";
import CustomerModal from "../components/CustomerModel";

const STATUS_STYLE = {
  Active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Lead: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  Prospect: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  Churned: "bg-red-500/15 text-red-400 border-red-500/30",
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-slate-400 text-xs font-medium mb-0.5">{label}</p>
      <p className="text-2xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>{value}</p>
    </div>
  </div>
);

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null); // null | { mode: "create" | "edit", data?: customer }
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerAPI.getAll();
      setCustomers(data.customers || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleSave = async (form) => {
    try {
      if (modal.data?._id) {
        const res = await customerAPI.update(modal.data._id, form);
        setCustomers(prev => prev.map(c => c._id === modal.data._id ? (res.customer || res) : c));
        showToast("Customer updated successfully");
      } else {
        const res = await customerAPI.create(form);
        setCustomers(prev => [...prev, res.customer || res]);
        showToast("Customer added successfully");
      }
      setModal(null);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await customerAPI.delete(id);
      setCustomers(prev => prev.filter(c => c._id !== id));
      setDeleteConfirm(null);
      showToast("Customer removed");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const filtered = customers.filter(c => {
    const matchSearch = !search || c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.company?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === "Active").length,
    leads: customers.filter(c => c.status === "Lead").length,
    prospects: customers.filter(c => c.status === "Prospect").length,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Inter:wght@400;500;600&display=swap');`}</style>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 shadow-xl border transition-all ${
          toast.type === "error" ? "bg-red-900 border-red-700 text-red-200" : "bg-emerald-900 border-emerald-700 text-emerald-200"
        }`}>
          {toast.type === "error"
            ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          }
          {toast.msg}
        </div>
      )}

      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan-400 rounded-lg flex items-center justify-center shadow-md shadow-cyan-400/30">
              <svg className="w-5 h-5 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
              </svg>
            </div>
            <span className="text-lg font-black tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              NEXUS<span className="text-cyan-400">CRM</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
              <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <span>{user?.name}</span>
            </div>
            <button onClick={logout} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-600 rounded-lg px-3 py-1.5 transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>Customer Hub</h1>
          <p className="text-slate-400 text-sm">Manage your customer relationships</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857" /></svg>}
            label="Total Customers" value={stats.total} color="bg-cyan-500/10"
          />
          <StatCard
            icon={<svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            label="Active" value={stats.active} color="bg-emerald-500/10"
          />
          <StatCard
            icon={<svg className="w-6 h-6 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
            label="Leads" value={stats.leads} color="bg-blue-500/10"
          />
          <StatCard
            icon={<svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
            label="Prospects" value={stats.prospects} color="bg-violet-500/10"
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search customers..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
            />
          </div>

          <div className="flex gap-2">
            {["All", "Active", "Lead", "Prospect", "Churned"].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all whitespace-nowrap ${
                  filterStatus === s
                    ? "bg-cyan-500/20 border-cyan-500 text-cyan-400"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >{s}</button>
            ))}
          </div>

          <button
            onClick={() => setModal({ mode: "create" })}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20 whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            Add Customer
          </button>
        </div>

        {/* Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-400 text-sm">Loading customers...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-red-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-sm">{error}</p>
              <button onClick={fetchCustomers} className="text-xs text-cyan-400 hover:text-cyan-300">Retry</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <svg className="w-10 h-10 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" /></svg>
              <p className="text-slate-400 text-sm">{search ? "No results found" : "No customers yet"}</p>
              {!search && (
                <button onClick={() => setModal({ mode: "create" })} className="text-xs text-cyan-400 hover:text-cyan-300 mt-1">
                  Add your first customer →
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left text-xs font-semibold text-slate-400 px-6 py-3.5">Customer</th>
                    <th className="text-left text-xs font-semibold text-slate-400 px-6 py-3.5 hidden md:table-cell">Company</th>
                    <th className="text-left text-xs font-semibold text-slate-400 px-6 py-3.5 hidden sm:table-cell">Phone</th>
                    <th className="text-left text-xs font-semibold text-slate-400 px-6 py-3.5">Status</th>
                    <th className="text-right text-xs font-semibold text-slate-400 px-6 py-3.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filtered.map(c => (
                    <tr key={c._id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-cyan-400">
                            {c.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{c.name}</p>
                            <p className="text-xs text-slate-400">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-sm text-slate-300">{c.company || <span className="text-slate-600">—</span>}</span>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="text-sm text-slate-300">{c.phone || <span className="text-slate-600">—</span>}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${STATUS_STYLE[c.status] || STATUS_STYLE.Lead}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setModal({ mode: "edit", data: c })}
                            className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(c)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="px-6 py-3 border-t border-slate-800 text-xs text-slate-500">
              Showing {filtered.length} of {customers.length} customers
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {modal && (
        <CustomerModal
          customer={modal.data}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>Delete Customer</h3>
            <p className="text-sm text-slate-400 mb-6">
              Are you sure you want to remove <span className="text-white font-semibold">{deleteConfirm.name}</span>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl text-sm transition-all">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm._id)} className="flex-1 bg-red-500 hover:bg-red-400 text-white font-bold py-2.5 rounded-xl text-sm transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}