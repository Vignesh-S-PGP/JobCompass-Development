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
} from "lucide-react";
import api from "../../services/api";
import logo from "../../assets/logo.png";
import NotificationBell from "../notifications/NotificationBell";

export default function RecruiterLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/companies/my")
      .then(res => {
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
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/recruiter/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Jobs", path: "/recruiter/jobs", icon: <Briefcase size={20} /> },
    { name: "Company", path: "/recruiter/company", icon: <Building2 size={20} /> },

    { name: "Profile", path: "/recruiter/profile", icon: <UserCircle size={20} /> },

    { name: "Messages", path: "/recruiter/chat", icon: <MessageSquare size={20} /> },

  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium animate-pulse">Initializing Recruiter Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      {/* Sidebar Container */}
      <aside 
        className={`relative flex flex-col bg-[#0B0F1A] text-white transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] z-30
        ${isCollapsed ? "w-20" : "w-64"}`}
      >
        {/* Branding Area */}
        <div className="flex items-center h-20 px-6 border-b border-white/5 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
               <img src={logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white leading-none">
                  JobCompass
                </span>
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider mt-1">
                  Recruiter
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"}
              `}
            >
              <div className="shrink-0 transition-transform group-hover:scale-110">
                {item.icon}
              </div>
              {!isCollapsed && (
                <span className="text-sm font-semibold tracking-wide whitespace-nowrap">
                  {item.name}
                </span>
              )}
              
              {/* Active Indicator Bar */}
              <div className={`absolute inset-y-3 left-0 w-1 bg-white rounded-r-full transition-opacity
                ${location.pathname === item.path ? "opacity-100" : "opacity-0"}`} 
              />
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section: Logout & Notifications */}
        <div className="p-4 mt-auto border-t border-white/5 space-y-2">
          {!isCollapsed && (
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 rounded-xl">
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Notifications</span>
               <NotificationBell className="text-white" />
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all
            ${isCollapsed 
              ? "text-slate-400 hover:text-rose-500 justify-center" 
              : "bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white w-full"}`}
          >
            <LogOut size={18} className="shrink-0" />
            {!isCollapsed && <span className="text-xs font-bold uppercase tracking-wider">Logout</span>}
          </button>
        </div>

        {/* Industrial Handle Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-20 bg-[#0B0F1A] border-y border-r border-white/10 rounded-r-xl flex items-center justify-center text-slate-500 hover:text-white hover:bg-indigo-600 transition-all z-50 group shadow-xl"
        >
          <ChevronRight 
            size={14} 
            className={`transition-transform duration-500 ${isCollapsed ? "" : "rotate-180"}`} 
          />
        </button>
      </aside>

      {/* Main Content Area - Restored p-6 */}
      <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
        <Outlet />
      </main>
    </div>
  );
}