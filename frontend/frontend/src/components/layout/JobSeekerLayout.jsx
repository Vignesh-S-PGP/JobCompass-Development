import { useState, useEffect } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  UserCircle,
  Briefcase,
  FileText,
  ChevronRight,
  ClipboardList,
  Settings,
  LogOut,
  MessageSquare,
  Search,
  Bell
} from "lucide-react";

import { Bookmark, Building2 } from "lucide-react";

import logo from "../../assets/logo.png";
import NotificationBell from "../notifications/NotificationBell";
import api from "../../services/api";

export default function JobSeekerLayout() {
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [query,setQuery] = useState("")
const [suggest,setSuggest] = useState({jobs:[],companies:[]})
const [showSuggest,setShowSuggest] = useState(false)


useEffect(()=>{

  if(query.length < 2){
    setSuggest({jobs:[],companies:[]})
    return
  }

  const t = setTimeout(()=>{

    api.get(`/search/suggest?q=${query}`)
      .then(res=>setSuggest(res.data))
      .catch(()=>{})

  },300)

  return ()=>clearTimeout(t)

},[query])

  useEffect(() => {
    api.get("/profile/me")
      .then(res => setProfile(res.data))
      .catch(() => setProfile(null));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

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
    <div className="flex h-screen bg-slate-100 overflow-hidden">

      {/* SIDEBAR */}
      <aside
        className={`relative flex flex-col bg-[#0B0F1A] text-white transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-20" : "w-64"}`}
      >
        {/* LOGO */}
        <div className="flex items-center h-20 px-6 border-b border-white/5">
          <img src={logo} className="w-10 h-10" />
          {!isCollapsed && (
            <span className="ml-3 text-xl font-bold tracking-wide">
              JobCompass
            </span>
          )}
        </div>

        {/* NAV ITEMS */}
        <nav className="flex-1 px-3 mt-6 space-y-1">
          {menuItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"}`
              }
            >
              {item.icon}
              {!isCollapsed && item.name}
            </NavLink>
          ))}
        </nav>

        {/* COLLAPSE BUTTON */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-1/2 bg-[#0B0F1A] border border-white/10
          rounded-full p-1 shadow-md hover:scale-110 transition"
        >
          <ChevronRight
            className={`transition-transform duration-300 ${
              !isCollapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </aside>

      {/* MAIN AREA */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* NAVBAR */}
        <header className="h-16 bg-[#0B0F1A] border-b border-white/5 flex items-center justify-between px-8">

          {/* LEFT SECTION */}
          <div className="flex items-center gap-6">

            {/* WELCOME TEXT */}
            <div className="text-sm text-slate-300 font-medium">
  Welcome, <span className="text-white">{profile?.fullName || "User"}</span>
</div>

            {/* SEARCH */}
           <div className="relative hidden md:flex items-center bg-white/5 rounded-xl px-4 py-2 w-80">
<Search size={18} className="text-slate-400 mr-2" />

<input
value={query}
onChange={e=>{
setQuery(e.target.value)
setShowSuggest(true)
}}
onKeyDown={e=>{
if(e.key==="Enter"){
navigate(`/jobseeker/search?q=${query}`)
setShowSuggest(false)
}
}}
placeholder="Search jobs, companies..."
className="bg-transparent outline-none w-full text-sm text-white placeholder-slate-400"
/>


{showSuggest && query && (

<div className="absolute top-12 left-0 w-full bg-[#11162A] border border-white/10 rounded-xl shadow-lg overflow-hidden">

{/* JOBS */}

{suggest.jobs.map(job=>(
<div
key={job._id}
onClick={()=>{
navigate(`/jobseeker/search?q=${job.title}`)
setShowSuggest(false)
}}
className="px-4 py-2 text-sm text-white hover:bg-white/10 cursor-pointer"
>
{job.title}
</div>
))}

{/* COMPANIES */}

{suggest.companies.map(c=>(
<div
key={c._id}
onClick={()=>{
navigate(`/jobseeker/companies/${c._id}`)
setShowSuggest(false)
}}
className="px-4 py-2 text-sm text-white hover:bg-white/10 cursor-pointer"
>
{c.name}
</div>
))}

</div>

)}

</div>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-6">

            {/* MESSAGE */}
            <button
              onClick={() => navigate("/jobseeker/chat")}
              className="p-2 rounded-lg hover:bg-white/10 transition"
            >
              <MessageSquare size={22} className="text-slate-300" />
            </button>

            {/* NOTIFICATION */}
            <button className="p-2 rounded-lg hover:bg-white/10 transition">
              <NotificationBell />
            </button>

            {/* PROFILE */}
            <div className="relative">

              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center overflow-hidden"
              >
                {profile?.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold">
                    {profile?.fullName?.[0] || "U"}
                  </span>
                )}
              </button>

              {/* DROPDOWN */}
              {profileOpen && (
                <div className="absolute right-0 mt-4 w-56 bg-[#11162A] border border-white/10 rounded-xl shadow-lg overflow-hidden">

                  <div className="p-4 border-b border-white/10">
                    <p className="text-sm font-semibold text-white">
                      {profile?.fullName || "User"}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {profile?.email}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/jobseeker/profile");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/5"
                  >
                    <Settings size={16} />
                    Settings
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-400 hover:bg-rose-500/10"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <Outlet />
        </main>

      </div>
    </div>
  );
}