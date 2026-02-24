import { Outlet, Link, useNavigate } from "react-router-dom"
import { LayoutDashboard, Users, Briefcase, BarChart3, LogOut, Bell } from "lucide-react"

export default function AdminLayout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    navigate("/login")
  }

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/admin/dashboard" },
    { icon: <Users size={20} />, label: "Users", path: "/admin/users" },
    { icon: <Briefcase size={20} />, label: "Jobs", path: "/admin/jobs" },
    { icon: <BarChart3 size={20} />, label: "ATS Monitoring", path: "/admin/ats" },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-slate-800 text-blue-400">
          Admin Panel
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 w-full rounded-lg hover:bg-red-900/30 text-red-400 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold text-gray-800">System Administration</h1>
          <div className="flex items-center gap-4">
             <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
               <Bell size={20} />
             </button>
             <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
               A
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
