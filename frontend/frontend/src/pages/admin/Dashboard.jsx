import { useState, useEffect } from "react"
import api from "../../services/api"
import {
  Users,
  Briefcase,
  FileCheck,
  TrendingUp,
  BarChart3,
  Activity,
  ShieldAlert
} from "lucide-react"
import { PageHeader } from "../../components/ui/PageHeader"
import { StatCard, Card, Button } from "../../components/ui/index.jsx"

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats")
        setStats(res.data)
      } catch (err) {
        console.error("Admin stats fetch failed", err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="animate-pulse space-y-10">
        <div className="h-20 bg-slate-200 rounded-3xl w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-44 bg-slate-200 rounded-[32px]" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           <div className="h-80 bg-slate-200 rounded-[40px]" />
           <div className="h-80 bg-slate-200 rounded-[40px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-10 animate-in fade-in duration-700">

      <PageHeader
        title="System Overview"
        description="Real-time platform metrics and administrative controls."
        actions={
          <div className="flex gap-3">
             <Button variant="outline" size="md">
               <ShieldAlert size={16} className="mr-2" /> Security Log
             </Button>
             <Button variant="primary" size="md">
               <Activity size={16} className="mr-2" /> Live Traffic
             </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Active Jobs"
          value={stats?.totalJobs || 0}
          icon={Briefcase}
          color="emerald"
        />
        <StatCard
          title="Applications"
          value={stats?.totalApplications || 0}
          icon={FileCheck}
          color="amber"
        />
        <StatCard
          title="Daily Growth"
          value={stats?.recentUsers || 0}
          icon={TrendingUp}
          color="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <Card className="p-10 flex flex-col items-center justify-center min-h-[400px] border-dashed">
            <div className="w-20 h-20 bg-indigo-50 rounded-[32px] flex items-center justify-center text-indigo-600 mb-6">
               <BarChart3 size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Platform Activity</h3>
            <p className="text-slate-400 font-bold text-center max-w-xs mb-8">
              Visualizing system throughput and user engagement metrics.
            </p>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-indigo-500 w-[65%] animate-pulse" />
            </div>
         </Card>

         <Card className="p-10 flex flex-col items-center justify-center min-h-[400px] border-dashed">
            <div className="w-20 h-20 bg-emerald-50 rounded-[32px] flex items-center justify-center text-emerald-600 mb-6">
               <Users size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Market Insights</h3>
            <p className="text-slate-400 font-bold text-center max-w-xs mb-8">
              Top performing sectors and recruiter satisfaction levels.
            </p>
            <div className="flex gap-2">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className="w-8 bg-emerald-100 rounded-t-lg transition-all hover:bg-emerald-500" style={{ height: `${i * 20}px` }} />
               ))}
            </div>
         </Card>
      </div>
    </div>
  )
}
