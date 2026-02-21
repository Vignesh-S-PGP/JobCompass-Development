import { Outlet, useNavigate } from "react-router-dom"

export default function JobSeekerLayout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white flex flex-col">
        <div className="p-6 text-xl font-bold border-b border-gray-700">
          JobCompass
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => navigate("/jobseeker/dashboard")}
            className="w-full text-left px-4 py-2 rounded hover:bg-gray-800"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/jobseeker/profile")}
            className="w-full text-left px-4 py-2 rounded hover:bg-gray-800"
          >
            Profile
          </button>

          <button
  onClick={() => navigate("/jobseeker/jobs")}
  className="w-full text-left px-4 py-2 rounded hover:bg-gray-800"
>
  Jobs
</button>
<button
  onClick={() => navigate("/jobseeker/applications")}
  className="w-full text-left px-4 py-2 rounded hover:bg-gray-800"
>
  Applied Jobs
</button>


          <button
            onClick={() => navigate("/jobseeker/resumes")}
            className="w-full text-left px-4 py-2 rounded hover:bg-gray-800"
          >
            Resumes
          </button>
        </nav>
        

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
