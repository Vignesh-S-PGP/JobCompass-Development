import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  UserCircle,
  Briefcase,
  FileText,
  ClipboardList,
  Bookmark,
  Building2,
} from "lucide-react";

import api from "../../services/api";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

export default function JobSeekerLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get("/profile/me")
      .then(res => setProfile(res.data))
      .catch(() => setProfile(null));
  }, []);

  const menuItems = [
    { name: "Dashboard", path: "/jobseeker/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Profile", path: "/jobseeker/profile", icon: <UserCircle size={20} /> },
    { name: "Jobs", path: "/jobseeker/jobs", icon: <Briefcase size={20} /> },
    { name: "Companies", path: "/jobseeker/companies", icon: <Building2 size={20} /> },
    { name: "Applied Jobs", path: "/jobseeker/applications", icon: <ClipboardList size={20} /> },
    { name: "Resumes", path: "/jobseeker/resumes", icon: <FileText size={20} /> },
    { name: "Saved Jobs", path: "/jobseeker/saved", icon: <Bookmark size={20} /> }
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} menuItems={menuItems} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar profile={profile} role="jobseeker" />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
