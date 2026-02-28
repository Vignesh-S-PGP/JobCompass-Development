import { useState, useEffect } from "react"
import api from "../../services/api"
import { Users, Briefcase, FileCheck, TrendingUp } from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats")
        setStats(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return <div>Loading...</div>

  const cards = [
    { label: "Total Users", value: stats?.totalUsers, icon: <Users className="text-blue-500" />, color: "bg-blue-50" },
    { label: "Total Jobs", value: stats?.totalJobs, icon: <Briefcase className="text-green-500" />, color: "bg-green-50" },
    { label: "Applications", value: stats?.totalApplications, icon: <FileCheck className="text-purple-500" />, color: "bg-purple-50" },
    { label: "New Users (Today)", value: stats?.recentUsers, icon: <TrendingUp className="text-orange-500" />, color: "bg-orange-50" },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Platform Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <div key={card.label} className={`${card.color} p-6 rounded-xl shadow-sm border border-white/50 flex items-center gap-4`}>
            <div className="p-3 bg-white rounded-lg shadow-sm">
              {card.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Platform Activity</h3>
            <div className="h-64 flex items-center justify-center text-gray-400 italic">
               Activity chart placeholder
            </div>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Top Recruiters</h3>
            <div className="h-64 flex items-center justify-center text-gray-400 italic">
               Recruiter list placeholder
            </div>
         </div>
      </div>
    </div>
  )
}
