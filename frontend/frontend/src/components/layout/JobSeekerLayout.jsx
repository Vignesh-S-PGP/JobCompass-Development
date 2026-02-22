import { useState } from "react";
import { Outlet, useNavigate, NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  UserCircle, 
  Briefcase, 
  FileText, 
  ChevronRight,
  LogOut,
  ClipboardList
} from "lucide-react";
import logo from "../../assets/logo.png";

export default function JobSeekerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/jobseeker/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Profile", path: "/jobseeker/profile", icon: <UserCircle size={20} /> },
    { name: "Jobs", path: "/jobseeker/jobs", icon: <Briefcase size={20} /> },
    { name: "Applied Jobs", path: "/jobseeker/applications", icon: <ClipboardList size={20} /> },
    { name: "Resumes", path: "/jobseeker/resumes", icon: <FileText size={20} /> },
  ];

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
              <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap">
                JobCompass
              </span>
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
              
              {/* Active Indicator Glow (Left edge) */}
              <div className={`absolute inset-y-3 left-0 w-1 bg-white rounded-r-full transition-opacity
                ${location.pathname === item.path ? "opacity-100" : "opacity-0"}`} 
              />
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section: Logout Only */}
        <div className="p-4 mt-auto border-t border-white/5">
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

        {/* The "Industrial Handle" Toggle Button */}
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

      {/* Main Content Area - Original p-6 Padding Restored */}
      <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
        <Outlet />
      </main>
    </div>
  );
}