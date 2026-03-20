import { useState, useEffect } from "react"
import { Outlet, useNavigate, NavLink } from "react-router-dom"

import {
  LayoutDashboard,
  Briefcase,
  Building2,
  MessageSquare,
  UserCircle,
  ChevronRight,
  LogOut,
  Search,
  Settings
} from "lucide-react"

import logo from "../../assets/logo.png"
import NotificationBell from "../notifications/NotificationBell"
import api from "../../services/api"

export default function RecruiterLayout() {

  const navigate = useNavigate()

  const [isCollapsed,setIsCollapsed] = useState(false)
  const [profileOpen,setProfileOpen] = useState(false)

  const [profile,setProfile] = useState(null)

  const [search,setSearch] = useState("")
  const [results,setResults] = useState([])
  const [searchOpen,setSearchOpen] = useState(false)
  const [query,setQuery] = useState("")
const [suggest,setSuggest] = useState([])
const [showSuggest,setShowSuggest] = useState(false)
useEffect(()=>{

  if(!search){
    setResults([])
    return
  }

  const timer = setTimeout(()=>{

    api.get(`/search/candidates?q=${search}`)
      .then(res=>{
        setResults(res.data.candidates || [])
        setSearchOpen(true)
      })
      .catch(()=>setResults([]))

  },300)

  return ()=>clearTimeout(timer)

},[search])

  /* LOAD PROFILE */

  useEffect(()=>{

    api.get("/profile/me")
      .then(res=>setProfile(res.data))
      .catch(()=>setProfile(null))

  },[])


  /* SEARCH JOB SEEKERS */

  
  /* LOGOUT */

  const handleLogout = ()=>{
    localStorage.removeItem("token")
    navigate("/login")
  }


  const menuItems = [

    {
      name:"Dashboard",
      path:"/recruiter/dashboard",
      icon:<LayoutDashboard size={20}/>
    },

    {
      name:"Jobs",
      path:"/recruiter/jobs",
      icon:<Briefcase size={20}/>
    },

    {
      name:"Company",
      path:"/recruiter/company",
      icon:<Building2 size={20}/>
    },

    {
      name:"Profile",
      path:"/recruiter/profile",
      icon:<UserCircle size={20}/>
    }
  ]


  return (

    <div className="flex h-screen bg-slate-100 overflow-hidden">

      {/* SIDEBAR */}

      <aside
        className={`relative flex flex-col bg-[#0B0F1A] text-white transition-all duration-300
        ${isCollapsed ? "w-20" : "w-64"}`}
      >

        {/* LOGO */}

        <div className="flex items-center h-20 px-6 border-b border-white/5">

          <img src={logo} className="w-10 h-10"/>

          {!isCollapsed && (

            <span className="ml-3 text-xl font-bold tracking-wide">
              JobCompass
            </span>

          )}

        </div>


        {/* MENU */}

        <nav className="flex-1 px-3 mt-6 space-y-1">

          {menuItems.map(item=>(

            <NavLink
              key={item.path}
              to={item.path}
              className={({isActive})=>
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
          onClick={()=>setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-1/2 bg-[#0B0F1A] border border-white/10
          rounded-full p-1 shadow-md hover:scale-110 transition"
        >

          <ChevronRight
            className={`transition-transform duration-300
            ${!isCollapsed ? "rotate-180" : ""}`}
          />

        </button>

      </aside>



      {/* MAIN AREA */}

      <div className="flex flex-col flex-1 overflow-hidden">


        {/* NAVBAR */}

        <header className="h-16 bg-[#0B0F1A] border-b border-white/5 flex items-center justify-between px-8">

          {/* LEFT */}

          <div className="flex items-center gap-6">

            {/* WELCOME */}

            <div className="text-sm text-slate-300 font-medium">

              Welcome, <span className="text-white">
                {profile?.fullName || "Recruiter"}
              </span>

            </div>


            {/* SEARCH JOB SEEKERS */}

            <div className="relative hidden md:flex items-center bg-white/5 rounded-xl px-4 py-2 w-80">

              <Search size={18} className="text-slate-400 mr-2"/>

             <input
value={search}
onChange={(e)=>setSearch(e.target.value)}
onKeyDown={(e)=>{
  if(e.key === "Enter"){
    navigate(`/recruiter/search?q=${search}`)
    setSearchOpen(false)
  }
}}
type="text"
placeholder="Search job seekers..."
className="bg-transparent outline-none w-full text-sm text-white placeholder-slate-400"
/>


              {/* SEARCH RESULTS */}

             {searchOpen && results.length > 0 && (

<div className="absolute top-12 left-0 w-full bg-[#11162A] border border-white/10 rounded-xl shadow-lg overflow-hidden">

{results.map(user => (

<div
key={user._id}
onClick={()=>{
  navigate(`/recruiter/candidates/${user.userId}`)
  setSearchOpen(false)
}}
className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 cursor-pointer"
>

<img
src={user.profileImage || "/avatar.png"}
className="w-8 h-8 rounded-full object-cover"
/>

<div>

<p className="text-sm text-white font-semibold">
{user.fullName}
</p>

<p className="text-xs text-slate-400">
{user.headline}
</p>

</div>

</div>

))}

</div>

)}

            </div>

          </div>



          {/* RIGHT */}

          <div className="flex items-center gap-6">

            {/* MESSAGE */}

            <button
              onClick={()=>navigate("/recruiter/chat")}
              className="p-2 rounded-lg hover:bg-white/10 transition"
            >

              <MessageSquare size={22} className="text-slate-300"/>

            </button>


            {/* NOTIFICATIONS */}

            <NotificationBell/>


            {/* PROFILE */}

            <div className="relative">

              <button
                onClick={()=>setProfileOpen(!profileOpen)}
                className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center overflow-hidden"
              >

                {profile?.profileImage

                  ? <img src={profile.profileImage} className="w-full h-full object-cover"/>

                  : <span className="text-white font-semibold">
                      {profile?.fullName?.[0] || "R"}
                    </span>

                }

              </button>


              {/* DROPDOWN */}

              {profileOpen && (

                <div className="absolute right-0 mt-4 w-56 bg-[#11162A] border border-white/10 rounded-xl shadow-lg overflow-hidden">

                  <div className="p-4 border-b border-white/10">

                    <p className="text-sm font-semibold text-white">
                      {profile?.fullName || "Recruiter"}
                    </p>

                    <p className="text-xs text-slate-400 truncate">
                      {profile?.email}
                    </p>

                  </div>


                  <button
                    onClick={()=>{
                      setProfileOpen(false)
                      navigate("/recruiter/profile")
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-white/5"
                  >

                    <Settings size={16}/>
                    Settings

                  </button>


                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-400 hover:bg-rose-500/10"
                  >

                    <LogOut size={16}/>
                    Logout

                  </button>

                </div>

              )}

            </div>

          </div>

        </header>



        {/* PAGE CONTENT */}

        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">

          <Outlet/>

        </main>

      </div>

    </div>

  )

}