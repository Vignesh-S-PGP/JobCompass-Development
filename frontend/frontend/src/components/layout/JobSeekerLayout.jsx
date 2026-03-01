import { useState, useEffect } from "react";
import { Outlet, useNavigate, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UserCircle,
  Briefcase,
  FileText,
  ChevronRight,
  ClipboardList,
  Settings,
  LogOut,
  MessageSquare,
  Bell,
  Menu,
  X
} from "lucide-react";
import logo from "../../assets/logo.png";
import NotificationBell from "../notifications/NotificationBell";
import api from "../../services/api";

export default function JobSeekerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get("/profile/me")
      .then(res => setProfile(res.data))
      .catch(err => {
        console.warn("⚠️ Profile load failed", err.response?.status);
        setProfile(null);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/jobseeker/dashboard", icon: LayoutDashboard },
    { name: "Profile", path: "/jobseeker/profile", icon: UserCircle },
    { name: "Jobs", path: "/jobseeker/jobs", icon: Briefcase },
    { name: "Applied Jobs", path: "/jobseeker/applications", icon: ClipboardList },
    { name: "Resumes", path: "/jobseeker/resumes", icon: FileText },
    { name: "Messages", path: "/jobseeker/chat", icon: MessageSquare }
  ];

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
                 <span className="text-[10px] text-primary-500 font-black uppercase tracking-[0.2em] mt-1.5">Talent Portal</span>
              </div>
            )}
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {!isCollapsed && (
            <div className="px-4 py-3">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Main Menu</span>
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

        {/* PROFILE SECTION */}
        <div className="p-4 border-t border-white/5 relative bg-slate-900/40">
          <button
            onClick={() => !isCollapsed && setProfileOpen(!profileOpen)}
            className={`w-full flex items-center gap-3 p-2 rounded-2xl transition-all duration-300
              ${isCollapsed ? "justify-center" : "hover:bg-white/5"}
            `}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center overflow-hidden border-2 border-primary-500/30">
                {profile?.profileImage ? (
                  <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-black text-white">{profile?.fullName?.[0] || "U"}</span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full" />
            </div>

            {!isCollapsed && (
              <div className="text-left flex-1 truncate">
                <p className="text-xs font-black text-white truncate leading-none mb-1">{profile?.fullName || "User"}</p>
                <p className="text-[10px] text-slate-500 truncate font-medium">{profile?.email}</p>
              </div>
            )}
          </button>

          {/* NOTIFICATION IN SIDEBAR */}
          {!isCollapsed && (
            <div className="absolute top-4 right-6">
              <NotificationBell className="text-slate-500 hover:text-white" />
            </div>
          )}

          {/* PROFILE DROPDOWN */}
          {profileOpen && !isCollapsed && (
            <div className="absolute bottom-full left-4 right-4 mb-4 bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in slide-up">
              <div className="p-4 border-b border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Authenticated as</p>
                <p className="text-xs font-bold text-white truncate">{profile?.email}</p>
              </div>
              <button
                onClick={() => { setProfileOpen(false); navigate("/jobseeker/profile"); }}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-slate-400 hover:bg-white/5 hover:text-white transition-all text-xs font-bold"
              >
                <Settings size={16} /> Account Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-rose-400 hover:bg-rose-500/10 transition-all text-xs font-bold"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
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
