import { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Users,
  Briefcase,
  CheckCircle,
  Clock,
  ArrowRight,
  Plus,
  TrendingUp,
  Building2,
  Zap,
  Star
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardSkeleton } from "../../components/ui/Skeleton";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplicants: 0,
    totalShortlisted: 0
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, companyRes] = await Promise.all([
          api.get("/jobs/recruiter"),
          api.get("/company/my")
        ]);

        if (jobsRes.data.stats) {
          setStats(jobsRes.data.stats);
        }
        setRecentJobs(jobsRes.data.jobs?.slice(0, 3) || []);
        setCompany(companyRes.data.company);
      } catch (err) {
        console.error("Failed to load recruiter dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <DashboardSkeleton />;

  const statCards = [
    { label: "Active Mandates", value: stats.activeJobs, icon: Briefcase, color: "text-primary-600", bg: "bg-primary-50" },
    { label: "Total Talent", value: stats.totalApplicants, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Shortlisted", value: stats.totalShortlisted, icon: Star, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Registry Sync", value: "Active", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">

      {/* RECRUITER HERO */}
      <div className="bg-slate-950 rounded-[3rem] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 bg-white rounded-2xl p-2 flex items-center justify-center">
                  {company?.logo ? (
                    <img src={company.logo} alt="Company" className="w-full h-full object-contain" />
                  ) : (
                    <Building2 className="text-slate-900" size={24} />
                  )}
               </div>
               <Badge className="bg-primary-500/10 text-primary-400 border-primary-500/20">{company?.name || "Corporate Portal"}</Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-6 uppercase">
              Command <span className="text-primary-500">Center</span>.
            </h1>
            <p className="text-slate-400 font-medium text-lg md:text-xl leading-relaxed">
              Your acquisition pipeline is managing <span className="text-white font-bold">{stats.totalApplicants} professionals</span> across {stats.activeJobs} active mandates.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
             <Button size="lg" onClick={() => navigate("/recruiter/jobs/create")} className="px-10 py-5 rounded-2xl text-[10px] uppercase tracking-[0.2em] font-black" icon={Plus}>
               Issue New Mandate
             </Button>
          </div>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((s) => (
          <Card key={s.label} className="p-8 group hover:border-primary-200">
            <div className={`${s.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
              <s.icon className={s.color} size={28} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{s.label}</p>
            <p className="text-4xl font-black text-slate-900 leading-none">{s.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* RECENT MANDATES */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between px-2 pb-4 border-b border-slate-100">
             <div className="flex flex-col">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
                  <TrendingUp className="text-primary-600" size={24} /> Recent Mandates
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Lifecycle overview of your active job listings</p>
             </div>
             <Link to="/recruiter/jobs">
               <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest">Global Repository</Button>
             </Link>
          </div>

          <div className="space-y-4">
            {recentJobs.length > 0 ? recentJobs.map(job => (
              <Card key={job._id} hover className="p-8 group">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex-1 flex items-center gap-6">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shrink-0 group-hover:border-primary-200 transition-colors">
                      <Briefcase size={24} className="text-slate-300 group-hover:text-primary-600 transition-colors" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1.5">
                        <Badge variant={job.status === "active" ? "success" : "default"} className="text-[8px]">{job.status}</Badge>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{job.location}</span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-primary-600 transition-colors leading-tight uppercase tracking-tight">{job.title}</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-10 shrink-0">
                    <div className="text-center">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Talent Pool</p>
                       <p className="text-xl font-black text-slate-900">{job.applicantCount || 0}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/recruiter/jobs/${job._id}`)}
                      className="rounded-xl px-4 py-3 group-hover:bg-primary-600 group-hover:text-white transition-all group-hover:border-primary-600"
                    >
                      <ArrowRight size={20} />
                    </Button>
                  </div>
                </div>
              </Card>
            )) : (
              <div className="py-20 text-center border-4 border-dashed border-slate-100 rounded-[3rem]">
                 <Briefcase size={48} className="mx-auto text-slate-200 mb-6" />
                 <p className="text-slate-400 font-black uppercase tracking-widest text-sm mb-2">No active mandates issued</p>
                 <Button onClick={() => navigate("/recruiter/jobs/create")} variant="ghost" className="text-primary-600 hover:bg-primary-50">Issue Your First Mandate</Button>
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR ANALYTICS */}
        <div className="lg:col-span-4 space-y-10">
           <Card className="p-10 text-center bg-white">
              <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-[0.3em] mb-10">Pipeline Efficiency</h3>
              <div className="relative w-44 h-44 mx-auto mb-10">
                 <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-100" strokeWidth="4" />
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-primary-600" strokeWidth="4" strokeDasharray="65, 100" strokeLinecap="round" />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-slate-900 leading-none mb-1">65%</span>
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Response Rate</span>
                 </div>
              </div>
              <div className="space-y-4 text-left">
                 <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                    <span className="text-[10px] font-black uppercase text-slate-500">Avg Time to Hire</span>
                    <span className="text-xs font-black text-slate-900">14 Days</span>
                 </div>
                 <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                    <span className="text-[10px] font-black uppercase text-slate-500">Screening Velocity</span>
                    <span className="text-xs font-black text-emerald-600">High</span>
                 </div>
              </div>
           </Card>

           <div className="bg-primary-950 p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group">
              <div className="relative z-10">
                <Zap size={32} className="mb-6 text-primary-500" />
                <h3 className="font-black text-white text-lg mb-3 uppercase tracking-tight">System Optimization</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed mb-10">
                  Mandates with <span className="text-white font-bold">verified technical stacks</span> receive 3.5x higher compatibility scores.
                </p>
                <div className="h-1 w-16 bg-primary-600 rounded-full" />
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl -mr-16 -mt-16" />
           </div>
        </div>
      </div>
    </div>
  );
}
