import { useState, useEffect } from "react";
import { Outlet, useNavigate, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Building2,
  ChevronRight,
  LogOut,
  UserCircle,
  MessageSquare,
  Menu,
  X,
  Plus
} from "lucide-react";
import api from "../../services/api";
import logo from "../../assets/logo.png";
import NotificationBell from "../notifications/NotificationBell";

export default function RecruiterLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    api.get("/company/my")
      .then(res => {
        setCompany(res.data.company);
        if (!res.data.company && location.pathname !== "/recruiter/company") {
          navigate("/recruiter/company");
        }
      })
      .catch(() => {
        navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/recruiter/dashboard", icon: LayoutDashboard },
    { name: "Jobs", path: "/recruiter/jobs", icon: Briefcase },
    { name: "Company", path: "/recruiter/company", icon: Building2 },
    { name: "Profile", path: "/recruiter/profile", icon: UserCircle },
    { name: "Messages", path: "/recruiter/chat", icon: MessageSquare },
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-center">
             <p className="text-slate-900 font-black uppercase tracking-widest text-xs mb-2">Initializing Platform</p>
             <p className="text-slate-400 font-medium animate-pulse text-sm">Recruiter Portal Access...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans">
      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 z-50 px-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <img src={logo} className="w-8 h-8" alt="Logo" />
          <span className="text-white font-black uppercase tracking-tight text-sm">JobCompass</span>
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
            <div className="w-10 h-10 bg-white rounded-xl p-1.5 flex-shrink-0">
               <img src={logo} className="w-full h-full object-contain" alt="Logo" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                 <span className="text-xl font-black tracking-tight text-white leading-none">JobCompass</span>
                 <span className="text-[10px] text-primary-500 font-black uppercase tracking-[0.2em] mt-1.5">Recruiter Hub</span>
              </div>
            )}
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {!isCollapsed && (
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Operation</span>
              <button
                onClick={() => navigate("/recruiter/jobs/create")}
                className="w-5 h-5 bg-primary-600 rounded-md flex items-center justify-center hover:bg-primary-500 transition-colors shadow-lg shadow-primary-600/20"
                title="Create Job"
              >
                <Plus size={12} strokeWidth={4} />
              </button>
            </div>
          )}
          {menuItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `
                group relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300
                ${isActive 
                  ? "bg-primary-600 text-white shadow-xl shadow-primary-600/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"}
              `}
            >
              <item.icon size={20} className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${location.pathname === item.path ? "scale-110" : ""}`} />
              {!isCollapsed && <span className="text-sm font-bold tracking-wide">{item.name}</span>}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-xl border border-white/10">
                  {item.name}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* NOTIFICATIONS BAR */}
        {!isCollapsed && (
          <div className="mx-6 my-4 p-4 bg-white/5 border border-white/5 rounded-[2rem] flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Notifications</span>
            <NotificationBell className="text-white hover:text-primary-500 transition-colors" />
          </div>
        )}

        {/* COMPANY/USER BOTTOM */}
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
            {!isCollapsed && <span className="text-xs font-black uppercase tracking-widest">Sign Out</span>}
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
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 lg:p-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
