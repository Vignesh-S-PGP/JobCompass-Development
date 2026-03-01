import { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  BarChart3,
  LogOut,
  Bell,
  Menu,
  X,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import logo from "../../assets/logo.png";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Users, label: "User Management", path: "/admin/users" },
    { icon: Briefcase, label: "Job Repository", path: "/admin/jobs" },
    { icon: BarChart3, label: "ATS Intelligence", path: "/admin/ats" },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans">
      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-950 z-50 px-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <img src={logo} className="w-8 h-8" alt="Logo" />
          <span className="text-white font-black uppercase tracking-tight text-sm">JobCompass <span className="text-primary-500">Admin</span></span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 lg:relative lg:flex flex-col bg-slate-950 text-white transition-all duration-500 ease-[cubic-bezier(0.2,0,0,1)]
        ${isCollapsed ? "w-20" : "w-72"}
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* BRAND */}
        <div className="flex items-center h-20 px-6 mb-4 shrink-0 overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary-600 rounded-xl p-2 flex-shrink-0 flex items-center justify-center">
               <ShieldCheck className="text-white" size={24} strokeWidth={2.5} />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                 <span className="text-xl font-black tracking-tight text-white leading-none">JobCompass</span>
                 <span className="text-[10px] text-primary-500 font-black uppercase tracking-[0.2em] mt-1.5">Admin Control</span>
              </div>
            )}
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {!isCollapsed && (
            <div className="px-4 py-3">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">System Governance</span>
            </div>
          )}
          {menuItems.map(item => (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `
                group relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300
                ${isActive
                  ? "bg-white text-slate-950 shadow-xl shadow-white/10"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"}
              `}
            >
              <item.icon size={20} className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${location.pathname === item.path ? "scale-110" : ""}`} />
              {!isCollapsed && <span className="text-sm font-bold tracking-wide">{item.label}</span>}

              {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-xl border border-white/10">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* BOTTOM SECTION */}
        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300
              ${isCollapsed
                ? "text-slate-400 hover:text-rose-500 justify-center hover:bg-rose-500/10"
                : "bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white w-full group"}
            `}
          >
            <LogOut size={18} className="shrink-0 transition-transform group-hover:-translate-x-1" />
            {!isCollapsed && <span className="text-xs font-black uppercase tracking-widest">Terminate Session</span>}
          </button>
        </div>

        {/* COLLAPSE TOGGLE */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 bg-slate-950 w-6 h-12 items-center justify-center rounded-r-xl border-y border-r border-white/10 text-slate-500 hover:text-white transition-colors"
        >
          <ChevronRight size={14} className={`transition-transform duration-500 ${!isCollapsed ? "rotate-180" : ""}`} />
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden pt-16 lg:pt-0">
        {/* TOP BAR */}
        <header className="hidden lg:flex h-20 bg-white border-b border-slate-200 items-center justify-between px-12 shrink-0">
           <div className="flex flex-col">
              <h1 className="text-lg font-black uppercase tracking-tight text-slate-900">
                {menuItems.find(m => m.path === location.pathname)?.label || "Admin Overview"}
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System node: jobcompass-main-v1</p>
           </div>

           <div className="flex items-center gap-6">
              <button className="relative p-2 text-slate-400 hover:text-primary-600 hover:bg-slate-50 rounded-xl transition-all">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
              </button>
              <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
                 <div className="text-right hidden md:block">
                    <p className="text-xs font-black text-slate-900 leading-none mb-1">Super Admin</p>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active Now</p>
                 </div>
                 <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xs font-black border-2 border-slate-100">SA</div>
              </div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 lg:p-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
