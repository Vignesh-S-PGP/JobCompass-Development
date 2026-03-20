import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Search,
  MessageSquare,
  Building,
  UserCircle
} from "lucide-react";

import api from "../../services/api";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

export default function RecruiterLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get("/profile/me")
      .then(res => setProfile(res.data))
      .catch(() => setProfile(null));
  }, []);

  const menuItems = [
    { name: "Dashboard", path: "/recruiter/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Jobs", path: "/recruiter/jobs", icon: <Briefcase size={20} /> },
    { name: "Candidates", path: "/recruiter/search", icon: <Search size={20} /> },
    { name: "Company Profile", path: "/recruiter/company", icon: <Building size={20} /> },
    { name: "Messages", path: "/recruiter/chat", icon: <MessageSquare size={20} /> },
    { name: "Settings", path: "/recruiter/profile", icon: <UserCircle size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} menuItems={menuItems} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar profile={profile} role="recruiter" />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
