import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Bell,
  MessageSquare,
  User,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Search,
  Menu
} from "lucide-react";
import NotificationBell from "../notifications/NotificationBell";

export const TopNavbar = ({ user, toggleSidebar, isCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Map path to title
  const getPageTitle = () => {
    const path = location.pathname.split("/").pop();
    if (!path || path === "dashboard") return "Dashboard";
    return path.charAt(0).toUpperCase() + path.slice(1).replace("-", " ");
  };

  return (
    <header className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm shadow-slate-900/5">
      <div className="flex items-center gap-6">
        <button
          onClick={toggleSidebar}
          className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
        >
          <Menu size={20} className={`transition-transform duration-500 ${isCollapsed ? "" : "rotate-180"}`} />
        </button>

        <div className="flex flex-col">
          <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
            {getPageTitle()}
          </h1>
          <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>JobCompass</span>
            <ChevronRight size={10} />
            <span className="text-indigo-600">{getPageTitle()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Global Search - UI Only */}
        <div className="hidden md:flex items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2.5 w-64 group focus-within:border-indigo-500 transition-all">
          <Search size={16} className="text-slate-400 group-focus-within:text-indigo-600" />
          <input
            type="text"
            placeholder="Search everything..."
            className="bg-transparent border-none outline-none text-xs font-bold ml-3 w-full placeholder:text-slate-300"
          />
        </div>

        <div className="flex items-center gap-2 border-l border-slate-100 pl-4 ml-2">
          {/* Messages Icon */}
          <button
            onClick={() => navigate(`/${user?.role === 'job_seeker' ? 'jobseeker' : user?.role}/chat`)}
            className="p-2.5 text-slate-400 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-all relative group"
          >
            <MessageSquare size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <NotificationBell className="text-slate-400 hover:text-indigo-600 transition-all" />
          </div>
        </div>

        {/* Profile Dropdown */}
        <div className="relative ml-2">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 p-1.5 pr-3 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-2xl transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-100 overflow-hidden">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user?.fullName?.[0] || "U"
              )}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-[11px] font-black text-slate-900 leading-none mb-1">
                {user?.fullName || "User"}
              </p>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                {user?.role?.replace("_", " ")}
              </p>
            </div>
            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setProfileOpen(false)} />
              <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-3xl shadow-2xl shadow-slate-900/10 z-40 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-5 border-b border-slate-50 bg-slate-50/50">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Account</p>
                  <p className="text-sm font-bold text-slate-900 truncate">{user?.email}</p>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate(`/${user?.role === 'job_seeker' ? 'jobseeker' : user?.role}/profile`);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-2xl transition-all text-xs font-black uppercase tracking-widest"
                  >
                    <User size={16} /> View Profile
                  </button>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      // navigate to settings if exists
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-2xl transition-all text-xs font-black uppercase tracking-widest"
                  >
                    <Settings size={16} /> Settings
                  </button>
                  <div className="h-px bg-slate-50 my-2 mx-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-2xl transition-all text-xs font-black uppercase tracking-widest"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
