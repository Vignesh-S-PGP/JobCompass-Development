import { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Users,
  Briefcase,
  Clock,
  TrendingUp,
  ArrowRight,
  Plus,
  BarChart3,
  CheckCircle,
  MessageSquare
} from "lucide-react";
import { Link } from "react-router-dom";

export default function RecruiterDashboard() {
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplicants: 0,
    newMessages: 0,
    shortlisted: 0
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          api.get("/jobs/recruiter"),
          // We don't have a global "all applicants for recruiter" yet,
          // but we can sum from jobs or just mock for UI.
        ]);

        const jobs = jobsRes.data.jobs || [];
        const apiStats = jobsRes.data.stats || {};

        setRecentJobs(jobs.slice(0, 5));

        setStats({
          activeJobs: apiStats.activeJobs || 0,
          totalApplicants: apiStats.totalApplicants || 0,
          newMessages: 4, // Still partially mock
          shortlisted: apiStats.totalShortlisted || 0
        });
      } catch (err) {
        console.error("Failed to fetch recruiter dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-40 bg-slate-200 rounded-[40px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-3xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           <div className="h-80 bg-slate-200 rounded-[40px]" />
           <div className="h-80 bg-slate-200 rounded-[40px]" />
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Active Jobs", value: stats.activeJobs, icon: <Briefcase className="text-blue-500" />, bg: "bg-blue-50" },
    { label: "Total Applicants", value: stats.totalApplicants, icon: <Users className="text-indigo-500" />, bg: "bg-indigo-50" },
    { label: "Shortlisted", value: stats.shortlisted, icon: <CheckCircle className="text-emerald-500" />, bg: "bg-emerald-50" },
    { label: "Messages", value: stats.newMessages, icon: <MessageSquare className="text-amber-500" />, bg: "bg-amber-50" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard</h1>
        </div>
        <Link
          to="/recruiter/jobs/create"
          className="bg-slate-900 hover:bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all shadow-xl shadow-slate-200"
        >
          <Plus size={18} /> Post New Job
        </Link>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((s) => (
          <div key={s.label} className={`${s.bg} p-8 rounded-[32px] border border-white/50 flex flex-col justify-between h-44 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all`}>
            <div className="relative z-10 flex items-center justify-between">
               <div className="bg-white p-3 rounded-2xl shadow-sm">
                 {s.icon}
               </div>
               <TrendingUp size={20} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
            </div>
            <div className="relative z-10">
              <p className="text-3xl font-black text-slate-900 mb-1">{s.value}</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{s.label}</p>
            </div>
            {/* Decor */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* RECENT JOBS */}
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <Clock size={20} className="text-indigo-600" /> Recent Postings
              </h2>
              <Link to="/recruiter/jobs" className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:underline">View All</Link>
           </div>

           <div className="space-y-4">
             {recentJobs.length > 0 ? recentJobs.map(job => (
               <div key={job._id} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-transparent hover:border-slate-200 hover:bg-white transition-all group">
                 <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${job.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                       {job.status === 'active' ? 'A' : 'C'}
                    </div>
                    <div>
                       <h3 className="font-bold text-slate-900">{job.title}</h3>
                       <p className="text-xs text-slate-400 font-medium">{new Date(job.createdAt).toLocaleDateString()} • {job.jobType}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-8">
                    <div className="text-right hidden sm:block">
                       <p className="text-sm font-black text-slate-900">{job.applicantCount || 0}</p>
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Applicants</p>
                    </div>
                    <Link to={`/recruiter/jobs/${job._id}/applicants`} className="p-3 bg-white shadow-sm border border-slate-100 rounded-xl group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                       <ArrowRight size={18} />
                    </Link>
                 </div>
               </div>
             )) : (
               <div className="py-12 text-center">
                  <p className="text-slate-400 font-bold">You haven't posted any jobs yet.</p>
                  <Link to="/recruiter/jobs/create" className="text-indigo-600 text-sm font-black uppercase tracking-widest mt-4 inline-block">Create your first job</Link>
               </div>
             )}
           </div>
        </div>

        {/* ANALYTICS PREVIEW */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
              <BarChart3 className="text-indigo-400 mb-6" size={32} />
              <h3 className="text-xl font-black mb-2">Hiring Insights</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
                Your job postings are performing 24% better than the platform average.
              </p>
              <div className="space-y-4">
                 <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Profile Views</span>
                    <span className="text-sm font-black">1,204</span>
                 </div>
                 <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[70%]" />
                 </div>
                 <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Appl. Rate</span>
                    <span className="text-sm font-black">12.5%</span>
                 </div>
                 <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[45%]" />
                 </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
           </div>

           <div className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                 <Users size={28} />
              </div>
              <h3 className="font-black text-slate-900 mb-2">Build your brand</h3>
              <p className="text-xs text-slate-500 font-medium mb-6">Complete your company profile to attract top talent.</p>
              <Link to="/recruiter/company" className="w-full block py-4 border-2 border-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                 Company Settings
              </Link>
           </div>
        </div>

      </div>
    </div>
  );
}
