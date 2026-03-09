import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  UserCircle,
  Briefcase,
  FileText,
  ClipboardList,
  Bookmark,
  MessageSquare,
  Building2,
  BarChart3,
  Users
} from "lucide-react";
import logo from "../../assets/logo.png";

const menuItemsByRole = {
  job_seeker: [
    { name: "Dashboard", path: "/jobseeker/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Profile", path: "/jobseeker/profile", icon: <UserCircle size={20} /> },
    { name: "Jobs", path: "/jobseeker/jobs", icon: <Briefcase size={20} /> },
    { name: "Companies", path: "/jobseeker/companies", icon: <Building2 size={20} /> },
    { name: "Applied Jobs", path: "/jobseeker/applications", icon: <ClipboardList size={20} /> },
    { name: "Resumes", path: "/jobseeker/resumes", icon: <FileText size={20} /> },
    { name: "Saved Jobs", path: "/jobseeker/saved", icon: <Bookmark size={20} /> },
    { name: "Messages", path: "/jobseeker/chat", icon: <MessageSquare size={20} /> }
  ],
  recruiter: [
    { name: "Dashboard", path: "/recruiter/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Jobs", path: "/recruiter/jobs", icon: <Briefcase size={20} /> },
    { name: "Company", path: "/recruiter/company", icon: <Building2 size={20} /> },
    { name: "Profile", path: "/recruiter/profile", icon: <UserCircle size={20} /> },
    { name: "Messages", path: "/recruiter/chat", icon: <MessageSquare size={20} /> },
  ],
  admin: [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Users", path: "/admin/users", icon: <Users size={20} /> },
    { name: "Jobs", path: "/admin/jobs", icon: <Briefcase size={20} /> },
    { name: "ATS Monitoring", path: "/admin/ats", icon: <BarChart3 size={20} /> },
  ]
};

export const Sidebar = ({ role, isCollapsed }) => {
  const menuItems = menuItemsByRole[role] || [];

  return (
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
                {role.replace("_", " ")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto custom-scrollbar pb-10">
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
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
