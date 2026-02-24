import { useState, useEffect } from "react"
import api from "../../services/api"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

export default function ATSMonitoring() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchATSStats()
  }, [])

  const fetchATSStats = async () => {
    try {
      const res = await api.get("/admin/ats-monitoring")

      const formattedData = res.data.distribution.map(item => ({
        range: `${item._id}-${item._id + 9}`,
        count: item.count
      }))
      setData(formattedData)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ["#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e", "#10b981", "#06b6d4", "#3b82f6", "#6366f1"]

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <h2 className="text-xl font-bold mb-2">ATS Score Distribution</h2>
        <p className="text-sm text-gray-500 mb-8">Visualization of application scores across the platform.</p>

        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{fill: "#9ca3af", fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: "#9ca3af", fontSize: 12}} dx={-10} />
              <Tooltip
                cursor={{fill: "#f9fafb"}}
                contentStyle={{borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)"}}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-xl shadow-sm border text-center">
          <h3 className="text-lg font-semibold mb-4">Matching Accuracy</h3>
          <div className="text-4xl font-bold text-blue-600 mb-2">84%</div>
          <p className="text-sm text-gray-500">System confidence based on recruiter shortlisting actions.</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-sm border text-center">
          <h3 className="text-lg font-semibold mb-4">Top Keywords</h3>
          <div className="flex flex-wrap gap-2 justify-center">
             {["React", "Node.js", "Python", "AWS", "Docker", "SQL", "Tailwind"].map(k => (
               <span key={k} className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-600">{k}</span>
             ))}
          </div>
        </div>
      </div>
    </div>
  )
}
