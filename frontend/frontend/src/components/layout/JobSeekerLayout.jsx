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
  MessageSquare
} from "lucide-react";
import logo from "../../assets/logo.png";
import NotificationBell from "../notifications/NotificationBell";
import api from "../../services/api";

export default function JobSeekerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState(null);

useEffect(() => {
  api.get("/profile/me")
    .then(res => setProfile(res.data))
    .catch(err => {
      console.warn("⚠️ Profile load failed", err.response?.status);
      // DO NOT redirect here
      setProfile(null);
    });
}, []);

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
    {name: "Messages",path: "/jobseeker/chat",icon: <MessageSquare size={20} />}
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      <aside className={`relative flex flex-col bg-[#0B0F1A] text-white
        ${isCollapsed ? "w-20" : "w-64"}`}>

        {/* BRAND */}
        <div className="flex items-center h-20 px-6 border-b border-white/5">
          <img src={logo} className="w-10 h-10" />
          {!isCollapsed && <span className="ml-3 text-xl font-bold">JobCompass</span>}
        </div>

        {/* NAV */}
        <nav className="flex-1 px-3 mt-4 space-y-1">
          {menuItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl
                ${isActive ? "bg-indigo-600" : "text-slate-400 hover:bg-white/5"}`
              }
            >
              {item.icon}
              {!isCollapsed && item.name}
            </NavLink>
          ))}
        </nav>

      {/* PROFILE + NOTIFICATION */}
<div className="relative p-4 border-t border-white/5">

  <div className="flex items-center justify-between">

    {/* PROFILE BUTTON */}
    <button
      onClick={() => setProfileOpen(!profileOpen)}
      className="flex items-center gap-3 focus:outline-none"
    >
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center overflow-hidden">
        {profile?.profileImage ? (
          <img
            src={profile.profileImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-sm font-bold text-white">
            {profile?.fullName?.[0] || "U"}
          </span>
        )}
      </div>

      {/* Name */}
      {!isCollapsed && (
        <div className="text-left">
          <p className="text-sm font-semibold text-white leading-tight">
            {profile?.fullName || "User"}
          </p>
          <p className="text-xs text-slate-400">
            {profile?.email}
          </p>
        </div>
      )}
    </button>

    {/* NOTIFICATION BELL */}
    {!isCollapsed && (
      <div className="relative">
        <NotificationBell
          className="text-slate-400 hover:text-indigo-400 transition-colors"
          placement="top"   // ⬆️ popup opens upward
        />
      </div>
    )}
  </div>

  {/* PROFILE DROPDOWN */}
  {profileOpen && !isCollapsed && (
    <div
      className="absolute bottom-full mb-3 left-4 right-4 z-50
                 bg-[#11162A] border border-white/10
                 rounded-xl shadow-2xl overflow-hidden"
    >
      <div className="p-4 border-b border-white/10">
        <p className="text-xs text-slate-400">Signed in as</p>
        <p className="text-sm font-semibold text-white truncate">
          {profile?.email}
        </p>
      </div>

      <button
        onClick={() => {
          setProfileOpen(false)
          navigate("/jobseeker/profile")
        }}
        className="w-full px-4 py-3 flex items-center gap-3
                   text-slate-300 hover:bg-white/5 transition"
      >
        <Settings size={16} />
        Settings
      </button>

      <button
        onClick={handleLogout}
        className="w-full px-4 py-3 flex items-center gap-3
                   text-rose-400 hover:bg-rose-500/10 transition"
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  )}
</div>

        {/* COLLAPSE */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-1/2 bg-[#0B0F1A] h-20 w-6"
        >
          <ChevronRight className={!isCollapsed ? "rotate-180" : ""} />
        </button>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}