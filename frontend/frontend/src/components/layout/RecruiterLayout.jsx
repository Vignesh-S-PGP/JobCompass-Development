import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";

export default function RecruiterLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const initPortal = async () => {
      try {
        const [compRes, profRes] = await Promise.all([
          api.get("/companies/my"),
          api.get("/recruiter/profile")
        ]);

        if (!compRes.data.company && location.pathname !== "/recruiter/company") {
          navigate("/recruiter/company");
        }

        setProfile(profRes.data.profile);
      } catch (err) {
        console.error("Initialization failed", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    initPortal();
  }, [navigate, location.pathname]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-black uppercase tracking-widest text-xs animate-pulse">Initializing Recruiter Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      <Sidebar
        role="recruiter"
        isCollapsed={isCollapsed}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNavbar
          user={{...profile, role: "recruiter"}}
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
