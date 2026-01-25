import { Outlet, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import api from "../../services/api"

export default function RecruiterLayout() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/company/my")
      .then(res => {
        if (!res.data.company) {
          navigate("/recruiter/company")
        }
      })
      .catch(() => {
        navigate("/login")
      })
      .finally(() => setLoading(false))
  }, [navigate])

  if (loading) {
    return <div className="p-6 text-lg">Loading...</div>
  }

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}
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
            onClick={() => navigate("/recruiter/jobs/create")}
            className="w-full text-left px-4 py-2 rounded hover:bg-gray-800"
          >
            Create Job
          </button>

          <button
            onClick={() => navigate("/recruiter/jobs")}
            className="w-full text-left px-4 py-2 rounded hover:bg-gray-800"
          >
            Jobs
          </button>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => {
              localStorage.removeItem("token")
              navigate("/login")
            }}
            className="w-full bg-red-600 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content (IMPORTANT) */}
      <main className="flex-1 p-6">
        <Outlet /> {/* ✅ REQUIRED FOR useParams() TO WORK */}
      </main>

    </div>
  )
}
