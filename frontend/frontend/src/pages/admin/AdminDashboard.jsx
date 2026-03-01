import { useEffect, useState } from "react";
import api from "../../services/api";
import { Users, Briefcase, FileText, Building2, TrendingUp, ShieldCheck, Zap, ArrowRight, BarChart3, Database } from "lucide-react";
import { DashboardSkeleton } from "../../components/ui/Skeleton";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    jobs: 0,
    applications: 0,
    companies: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/stats")
      .then(res => setStats(res.data))
      .catch(err => console.error("Failed to fetch admin stats", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  const statCards = [
    { title: "User Nodes", value: stats.users, icon: Users, color: "text-primary-600", bg: "bg-primary-50", border: "border-primary-100" },
    { title: "Active Mandates", value: stats.jobs, icon: Briefcase, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { title: "Transmissions", value: stats.applications, icon: FileText, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
    { title: "Corporate Entities", value: stats.companies, icon: Building2, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">

      {/* ADMIN HERO */}
      <div className="bg-slate-950 rounded-[3rem] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[120px] -mr-64 -mt-64" />
         <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="max-w-2xl">
               <div className="flex items-center gap-4 mb-6">
                  <Badge variant="primary" className="bg-primary-500/10 text-primary-400 border-primary-500/20 px-4 py-1">System Health: Optimal</Badge>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Monitoring
                  </div>
               </div>
               <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-6 uppercase">
                 Governance <span className="text-primary-500">Node</span>.
               </h1>
               <p className="text-slate-400 font-medium text-lg md:text-xl leading-relaxed">
                 Operational oversight of the JobCompass ecosystem. Currently presiding over <span className="text-white font-bold">{stats.users} active profiles</span> and <span className="text-white font-bold">{stats.jobs} mandate entries</span>.
               </p>
            </div>
            <div className="flex items-center gap-8 bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl shrink-0 group-hover:border-primary-500 transition-colors duration-500">
               <div className="flex flex-col items-center">
                  <Database size={32} className="text-primary-500 mb-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Uptime</span>
                  <span className="text-xl font-black text-white mt-1">99.9%</span>
               </div>
               <div className="w-px h-16 bg-white/10" />
               <div className="flex flex-col items-center">
                  <Zap size={32} className="text-amber-500 mb-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Sync</span>
                  <span className="text-xl font-black text-white mt-1">Active</span>
               </div>
            </div>
         </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((s) => (
          <Card key={s.title} className={`p-8 group hover:border-primary-200 border-l-4 ${s.border.replace('border-', 'border-l-')}`}>
            <div className={`${s.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}>
              <s.icon className={s.color} size={28} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">{s.title}</p>
            <h3 className="text-4xl font-black text-slate-900 leading-none">{s.value}</h3>
          </Card>
        ))}
      </div>

      {/* SYSTEM OPERATIONS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-20">
         <div className="lg:col-span-8 space-y-12">
            <Card className="p-10 md:p-16 relative overflow-hidden">
               <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-12 pb-6 border-b border-slate-100">
                     <TrendingUp size={24} className="text-primary-600" />
                     <div className="flex flex-col">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Platform Trajectory</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Growth Metrics & Interaction Volume</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     <div className="space-y-6">
                        <div className="flex justify-between items-end border-b border-slate-50 pb-4">
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Avg Interactions / Day</span>
                           <span className="text-xl font-black text-slate-900">{(stats.applications / 30).toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between items-end border-b border-slate-50 pb-4">
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mandate Density</span>
                           <span className="text-xl font-black text-slate-900">{(stats.jobs / stats.companies || 0).toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between items-end border-b border-slate-50 pb-4">
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">User Growth</span>
                           <span className="text-xl font-black text-emerald-600">+12.4%</span>
                        </div>
                     </div>
                     <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 flex flex-col items-center justify-center text-center">
                        <BarChart3 size={48} className="text-primary-600 mb-6" />
                        <h4 className="text-lg font-black uppercase tracking-tight text-slate-900 mb-2">Detailed Analytics</h4>
                        <p className="text-xs font-medium text-slate-500 mb-8 leading-relaxed">System-wide performance logs and interaction heatmaps are processed in real-time.</p>
                        <Button variant="outline" size="sm" className="w-full text-[10px] font-black uppercase tracking-widest">Access Logs</Button>
                     </div>
                  </div>
               </div>
               <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-600/5 rounded-full blur-[100px] -mr-32 -mb-32" />
            </Card>
         </div>

         <div className="lg:col-span-4 space-y-12">
            <Card className="p-10 bg-slate-950 text-white relative overflow-hidden group">
               <div className="relative z-10 text-center">
                  <ShieldCheck size={40} className="mx-auto mb-6 text-primary-500 group-hover:scale-110 transition-transform duration-500" />
                  <h3 className="text-xl font-black uppercase tracking-tight mb-4">Security Protocol</h3>
                  <p className="text-xs font-medium text-slate-400 mb-10 leading-relaxed uppercase tracking-widest">Manage administrative access and platform-wide security policies.</p>
                  <Button className="w-full py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary-600/30">
                     Execute Audit <ArrowRight size={16} className="ml-2" />
                  </Button>
               </div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/10 rounded-full blur-2xl -mr-16 -mt-16" />
            </Card>

            <div className="bg-primary-50 p-10 rounded-[3rem] border border-primary-100 group">
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                     <Users size={18} />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Governance Memo</h4>
               </div>
               <p className="text-sm font-medium text-primary-800 leading-relaxed italic">
                 "Maintain the integrity of the platform by regular verification of corporate entity nodes and professional profiles."
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
