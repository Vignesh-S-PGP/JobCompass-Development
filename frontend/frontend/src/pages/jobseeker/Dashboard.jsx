import { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Briefcase,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  ArrowRight,
  Zap,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";

export default function JobSeekerDashboard() {
  const [stats, setStats] = useState({
    applied: 0,
    shortlisted: 0,
    rejected: 0
  });
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, jobsRes, profileRes] = await Promise.all([
          api.get("/applications/my"),
          api.get("/job-feed"),
          api.get("/profile")
        ]);

        const apps = appsRes.data.applications || [];
        setStats({
          applied: apps.length,
          shortlisted: apps.filter(a => a.status === "shortlisted").length,
          rejected: apps.filter(a => a.status === "rejected").length
        });

        setRecommendedJobs(jobsRes.data.recommended?.slice(0, 3) || []);
        setProfile(profileRes.data.profile);
      } catch (err) {
        console.error("Dashboard data fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-32 bg-slate-200 rounded-3xl w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-200 rounded-2xl" />)}
        </div>
        <div className="h-64 bg-slate-200 rounded-3xl w-full" />
      </div>
    );
  }

  const statCards = [
    { label: "Total Applied", value: stats.applied, icon: <Clock className="text-blue-500" />, bg: "bg-blue-50" },
    { label: "Shortlisted", value: stats.shortlisted, icon: <CheckCircle className="text-emerald-500" />, bg: "bg-emerald-50" },
    { label: "Rejected", value: stats.rejected, icon: <XCircle className="text-rose-500" />, bg: "bg-rose-50" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-10">

      {/* GREETING */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl">
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
               <h1 className="text-4xl font-black tracking-tight mb-2">
                 Hello, {profile?.fullName?.split(" ")[0] || "Explorer"}! 👋
               </h1>
               <p className="text-slate-400 font-medium text-lg">
                 You have <span className="text-indigo-400 font-bold">{stats.shortlisted} active interview requests</span> this week.
               </p>
            </div>
            <Link
              to="/jobseeker/jobs"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all self-start md:self-auto shadow-xl shadow-indigo-900/40"
            >
              Explore Jobs <ArrowRight size={20} />
            </Link>
         </div>
         {/* Decorative elements */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
         <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl -ml-10 -mb-10" />
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((s) => (
          <div key={s.label} className={`${s.bg} p-6 rounded-3xl border border-white/50 flex items-center gap-5 shadow-sm`}>
            <div className="bg-white p-3 rounded-2xl shadow-sm">
              {s.icon}
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{s.label}</p>
              <p className="text-3xl font-black text-slate-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* RECOMMENDED JOBS */}
        <div className="lg:col-span-8 space-y-6">
           <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <Star className="text-amber-500 fill-amber-500" size={20} /> Matches For You
              </h2>
              <Link to="/jobseeker/jobs" className="text-sm font-bold text-indigo-600 hover:underline">View All</Link>
           </div>

           <div className="space-y-4">
             {recommendedJobs.length > 0 ? recommendedJobs.map(job => (
               <div key={job._id} className="group bg-white border border-slate-100 p-6 rounded-[32px] hover:border-indigo-600 transition-all shadow-sm hover:shadow-xl hover:shadow-indigo-900/5">
                 <div className="flex items-start justify-between">
                    <div className="flex gap-5">
                       <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 overflow-hidden">
                          {job.company?.logo ? <img src={job.company.logo} className="w-full h-full object-cover" /> : <Briefcase className="text-slate-300" />}
                       </div>
                       <div>
                          <h3 className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                          <p className="text-sm font-bold text-slate-400 mt-0.5">{job.company?.name} • {job.location}</p>
                          <div className="flex gap-2 mt-3">
                             {job.skillsRequired?.slice(0, 3).map(skill => (
                               <span key={skill} className="px-3 py-1 bg-slate-50 text-[10px] font-black uppercase text-slate-500 rounded-lg">{skill}</span>
                             ))}
                          </div>
                       </div>
                    </div>
                    <Link to="/jobseeker/jobs" className="p-2 bg-slate-50 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                       <ArrowRight size={20} />
                    </Link>
                 </div>
               </div>
             )) : (
               <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-[32px]">
                  <p className="text-slate-400 font-bold">No matches found yet. Keep your profile updated!</p>
               </div>
             )}
           </div>
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-4 space-y-8">
           {/* PROFILE COMPLETION */}
           <div className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm">
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-6">Profile Strength</h3>
              <div className="relative w-32 h-32 mx-auto mb-6">
                 {/* Simple Circular Progress Mockup */}
                 <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-indigo-600" strokeWidth="3" strokeDasharray="75, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                 </svg>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-black text-slate-900">75%</span>
                 </div>
              </div>
              <p className="text-xs text-slate-500 font-medium text-center mb-6">Complete your bio and add more skills to reach 100%.</p>
              <Link to="/jobseeker/profile" className="w-full block text-center py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-600 transition-colors">
                 Complete Profile
              </Link>
           </div>

           {/* TIP OF THE DAY */}
           <div className="bg-indigo-50 p-8 rounded-[32px] border border-indigo-100">
              <Zap className="text-indigo-600 mb-4" size={24} />
              <h3 className="font-bold text-indigo-900 mb-2">Pro Tip</h3>
              <p className="text-sm text-indigo-700/70 font-medium leading-relaxed">
                Candidates who include a detailed professional summary are 40% more likely to be noticed by recruiters.
              </p>
           </div>
        </div>

      </div>
    </div>
  );
}
