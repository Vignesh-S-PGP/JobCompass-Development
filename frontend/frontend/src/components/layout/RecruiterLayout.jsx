import { Outlet, useNavigate } from "react-router-dom"

export default function RecruiterLayout() {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-black text-white flex flex-col">
        <div className="p-6 text-xl font-bold border-b border-gray-700">
          JobCompass Recruiter
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => navigate("/recruiter/dashboard")}
            className="w-full text-left px-4 py-2 rounded hover:bg-gray-800"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/recruiter/jobs")}
            className="w-full text-left px-4 py-2 rounded hover:bg-gray-800"
          >
            Jobs
          </button>

          <button
            onClick={() => navigate("/recruiter/jobs/new")}
            className="w-full text-left px-4 py-2 rounded hover:bg-gray-800"
          >
            Post Job
          </button>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={logout}
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
