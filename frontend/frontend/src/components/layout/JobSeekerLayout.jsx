import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import api from "../../services/api";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";

export default function JobSeekerLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get("/profile/me")
      .then(res => setProfile(res.data))
      .catch(err => {
        console.warn("⚠️ Profile load failed", err.response?.status);
        setProfile(null);
      });
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      <Sidebar
        role="job_seeker"
        isCollapsed={isCollapsed}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNavbar
          user={{...profile, role: "job_seeker"}}
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
