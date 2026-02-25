import { Outlet, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  LogOut,
  ShieldCheck
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <ShieldCheck className="text-indigo-400" size={32} />
          <span className="font-black text-xl tracking-tighter uppercase">Admin Panel</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <Link to="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-colors">
            <LayoutDashboard size={20} />
            <span className="font-bold text-sm">Dashboard</span>
          </Link>
          <Link to="/admin/users" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-colors">
            <Users size={20} />
            <span className="font-bold text-sm">User Management</span>
          </Link>
          <Link to="/admin/jobs" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-colors">
            <Briefcase size={20} />
            <span className="font-bold text-sm">Job Management</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-bold text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10">
        <Outlet />
      </main>
    </div>
  );
}
