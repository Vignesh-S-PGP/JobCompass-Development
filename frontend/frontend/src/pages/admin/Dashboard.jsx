import { useState, useEffect } from "react"
import api from "../../services/api"
import { Users, Briefcase, FileCheck, TrendingUp, ShieldCheck, Zap, Database, ArrowRight } from "lucide-react"
import { DashboardSkeleton } from "../../components/ui/Skeleton"
import Card from "../../components/ui/Card"
import Badge from "../../components/ui/Badge"
import Button from "../../components/ui/Button"

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

  if (loading) return <DashboardSkeleton />

  const cards = [
    { label: "Total Node Profiles", value: stats?.totalUsers || stats?.users || 0, icon: Users, color: "text-primary-600", bg: "bg-primary-50" },
    { label: "Active Mandates", value: stats?.totalJobs || stats?.jobs || 0, icon: Briefcase, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Transmissions", value: stats?.totalApplications || stats?.applications || 0, icon: FileCheck, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Registry Growth", value: stats?.recentUsers || 0, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">

      {/* ADMIN HERO */}
      <div className="bg-slate-950 rounded-[3rem] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[120px] -mr-64 -mt-64" />
         <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="max-w-2xl">
               <div className="flex items-center gap-4 mb-6">
                  <Badge variant="primary" className="bg-primary-500/10 text-primary-400 border-primary-500/20 px-4 py-1">Operational Governance</Badge>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live System Node
                  </div>
               </div>
               <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-6 uppercase">
                 Governance <span className="text-primary-500">Control</span>.
               </h1>
               <p className="text-slate-400 font-medium text-lg md:text-xl leading-relaxed">
                 Real-time oversight of the JobCompass platform ecosystem and professional talent transmissions.
               </p>
            </div>
            <div className="flex items-center gap-8 bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl shrink-0 group-hover:border-primary-500 transition-colors duration-500">
               <div className="flex flex-col items-center">
                  <Database size={32} className="text-primary-500 mb-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Node Sync</span>
                  <span className="text-xl font-black text-white mt-1">99.9%</span>
               </div>
               <div className="w-px h-16 bg-white/10" />
               <div className="flex flex-col items-center">
                  <Zap size={32} className="text-amber-500 mb-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Traffic</span>
                  <span className="text-xl font-black text-white mt-1">Nominal</span>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card) => (
          <Card key={card.label} className="p-8 group hover:border-primary-200">
            <div className={`${card.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}>
              <card.icon className={card.color} size={28} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">{card.label}</p>
            <h3 className="text-4xl font-black text-slate-900 leading-none">{card.value}</h3>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-20">
         <Card className="p-10 md:p-16 relative overflow-hidden group">
            <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-8 pb-4 border-b border-slate-100 flex items-center gap-3">
               <TrendingUp size={24} className="text-primary-600" /> Platform Activity
            </h3>
            <div className="h-64 flex flex-col items-center justify-center text-center gap-6 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
               <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-slate-200 shadow-sm">
                  <Database size={32} />
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Interaction Volume Graph Encrypted</p>
               <Button variant="ghost" size="sm" className="text-[9px] font-black uppercase tracking-widest">Decrypt Analytics</Button>
            </div>
         </Card>
         <Card className="p-10 md:p-16 relative overflow-hidden group">
            <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-8 pb-4 border-b border-slate-100 flex items-center gap-3">
               <ShieldCheck size={24} className="text-primary-600" /> Top Entity Nodes
            </h3>
            <div className="h-64 flex flex-col items-center justify-center text-center gap-6 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
               <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-slate-200 shadow-sm">
                  <ShieldCheck size={32} />
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Entity Acquisition Metrics Archived</p>
               <Button variant="ghost" size="sm" className="text-[9px] font-black uppercase tracking-widest">Access Entity Logs</Button>
            </div>
         </Card>
      </div>
    </div>
  )
}
