import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  LineChart,
  ShieldCheck,
  Settings
} from "lucide-react";

import api from "../../services/api";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

export default function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get("/profile/me")
      .then(res => setProfile(res.data))
      .catch(() => setProfile(null));
  }, []);

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Users", path: "/admin/users", icon: <Users size={20} /> },
    { name: "Jobs", path: "/admin/jobs", icon: <Briefcase size={20} /> },
    { name: "ATS Stats", path: "/admin/ats", icon: <ShieldCheck size={20} /> },
    { name: "Settings", path: "/admin/settings", icon: <Settings size={20} /> }
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} menuItems={menuItems} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar profile={profile} role="admin" />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
