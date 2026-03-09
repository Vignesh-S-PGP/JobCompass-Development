import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import api from "../../services/api";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";

export default function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get("/profile")
      .then(res => setProfile(res.data.profile))
      .catch(err => {
        console.warn("⚠️ Profile load failed", err.response?.status);
        setProfile({ fullName: "Admin User", role: "admin" });
      });
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      <Sidebar
        role="admin"
        isCollapsed={isCollapsed}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNavbar
          user={{...profile, role: "admin"}}
          isCollapsed={isCollapsed}
          toggleSidebar={() => setIsCollapsed(!isCollapsed)}
        />

        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
