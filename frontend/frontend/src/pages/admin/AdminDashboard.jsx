import { useEffect, useState } from "react";
import api from "../../services/api";
import { Users, Briefcase, FileText, Building2 } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    jobs: 0,
    applications: 0,
    companies: 0
  });

  useEffect(() => {
    api.get("/admin/stats")
      .then(res => setStats(res.data))
      .catch(err => console.error("Failed to fetch admin stats", err));
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white mb-6 shadow-lg`}>
        <Icon size={24} />
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
      <h3 className="text-4xl font-black text-slate-900">{value}</h3>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10">
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter">System Overview.</h1>
        <p className="text-slate-500 font-bold mt-2">Real-time platform metrics and analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.users} icon={Users} color="bg-indigo-600" />
        <StatCard title="Active Jobs" value={stats.jobs} icon={Briefcase} color="bg-emerald-500" />
        <StatCard title="Applications" value={stats.applications} icon={FileText} color="bg-orange-500" />
        <StatCard title="Companies" value={stats.companies} icon={Building2} color="bg-purple-600" />
      </div>
    </div>
  );
}
