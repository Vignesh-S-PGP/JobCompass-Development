import { useState, useEffect } from "react";
import api from "../../services/api";
import {
  CheckCircle,
  Clock,
  XCircle,
  ArrowRight,
  Zap,
  Star,
  Search,
  Users,
  Briefcase
} from "lucide-react";
import { Link } from "react-router-dom";
import { DashboardSkeleton } from "../../components/ui/Skeleton";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

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

  if (loading) return <DashboardSkeleton />;

  const statCards = [
    { label: "Applications", value: stats.applied, icon: Briefcase, color: "text-primary-600", bg: "bg-primary-50", border: "border-primary-100" },
    { label: "Shortlisted", value: stats.shortlisted, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { label: "Rejected", value: stats.rejected, icon: XCircle, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">

      {/* GREETING HERO */}
      <div className="relative overflow-hidden bg-slate-950 rounded-[3rem] p-10 md:p-16 text-white shadow-2xl">
         <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="max-w-2xl">
               <Badge variant="primary" className="mb-6 bg-primary-500/10 text-primary-400 border-primary-500/20 px-4 py-1">System Active</Badge>
               <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-[1.1]">
                 Welcome back, <span className="text-primary-500">{profile?.fullName?.split(" ")[0] || "Explorer"}</span>.
               </h1>
               <p className="text-slate-400 font-medium text-lg md:text-xl leading-relaxed">
                 Your career trajectory is looking promising. You have <span className="text-white font-bold">{stats.shortlisted} active interview requests</span> waiting for your response.
               </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
               <Link to="/jobseeker/jobs">
                 <Button size="lg" className="w-full sm:w-auto px-10 py-5 rounded-2xl text-xs uppercase tracking-[0.2em]">
                   Explore Registry <ArrowRight size={18} className="ml-2" />
                 </Button>
               </Link>
            </div>
         </div>
         {/* Decorative elements */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px] -mr-64 -mt-64" />
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-900/10 rounded-full blur-[100px] -ml-48 -mb-48" />
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {statCards.map((s) => (
          <Card key={s.label} className={`p-8 flex items-center gap-6 border-l-4 ${s.border.replace('border-', 'border-l-')}`}>
            <div className={`${s.bg} p-4 rounded-2xl`}>
              <s.icon className={s.color} size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{s.label}</p>
              <p className="text-4xl font-black text-slate-900 leading-none">{s.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* RECOMMENDED JOBS */}
        <div className="lg:col-span-8 space-y-8">
           <div className="flex items-center justify-between px-2">
              <div className="flex flex-col">
                 <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                   <Star className="text-primary-500 fill-primary-500" size={24} /> AI Recommendations
                 </h2>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Matched based on your skill profile</p>
              </div>
              <Link to="/jobseeker/jobs">
                <Button variant="ghost" size="sm" className="text-xs uppercase tracking-widest font-black">View All Registry</Button>
              </Link>
           </div>

           <div className="space-y-4">
             {recommendedJobs.length > 0 ? recommendedJobs.map(job => (
               <Card key={job._id} hover className="p-8 group">
                 <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                    <div className="flex gap-6">
                       <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 overflow-hidden shrink-0 group-hover:border-primary-200 transition-colors">
                          {job.company?.logo ? <img src={job.company.logo} alt="Logo" className="w-full h-full object-contain p-2" /> : <Briefcase className="text-slate-300" />}
                       </div>
                       <div>
                          <Badge variant="primary" className="mb-2">Recommended</Badge>
                          <h3 className="text-xl font-black text-slate-900 group-hover:text-primary-600 transition-colors leading-tight mb-1">{job.title}</h3>
                          <p className="text-sm font-bold text-slate-500 flex items-center gap-2">
                            {job.company?.name} <span className="text-slate-300">•</span> {job.location}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-4">
                             {job.skillsRequired?.slice(0, 4).map(skill => (
                               <span key={skill} className="px-3 py-1 bg-slate-100 text-[10px] font-black uppercase text-slate-500 rounded-lg group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">{skill}</span>
                             ))}
                          </div>
                       </div>
                    </div>
                    <Link to="/jobseeker/jobs" className="self-end md:self-center">
                       <Button variant="outline" size="sm" className="rounded-xl px-4 py-3 group-hover:bg-primary-600 group-hover:text-white transition-all group-hover:border-primary-600">
                          <ArrowRight size={20} />
                       </Button>
                    </Link>
                 </div>
               </Card>
             )) : (
               <div className="py-20 text-center border-4 border-dashed border-slate-100 rounded-[3rem]">
                  <Search size={48} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-slate-400 font-black uppercase tracking-widest text-sm">No matches found yet</p>
                  <p className="text-slate-500 text-sm mt-2 font-medium">Keep your profile updated for better alignment.</p>
               </div>
             )}
           </div>
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-4 space-y-10">
           {/* PROFILE COMPLETION */}
           <Card className="p-10 text-center">
              <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-[0.3em] mb-8">Intelligence Score</h3>
              <div className="relative w-40 h-40 mx-auto mb-8">
                 <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-100" strokeWidth="3" />
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-primary-600" strokeWidth="3" strokeDasharray="75, 100" strokeLinecap="round" />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-slate-900">75%</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Match Rate</span>
                 </div>
              </div>
              <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">Your professional narrative is strong. Adding <span className="text-slate-900 font-bold">2 more skills</span> will optimize your visibility.</p>
              <Link to="/jobseeker/profile" className="block">
                 <Button className="w-full py-4 text-[10px] uppercase tracking-[0.2em] font-black">Refine Profile</Button>
              </Link>
           </Card>

           {/* ANALYTICS PREVIEW */}
           <div className="bg-primary-950 p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group">
              <div className="relative z-10">
                <Zap className="text-primary-500 mb-6 group-hover:scale-110 transition-transform" size={32} />
                <h3 className="font-black text-white text-lg mb-3 uppercase tracking-tight">Recruiter Insights</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6">
                  Candidates with <span className="text-white font-bold">detailed experience descriptions</span> see a 40% increase in direct recruiter outreach.
                </p>
                <div className="h-1 w-12 bg-primary-600 rounded-full" />
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl -mr-16 -mt-16" />
           </div>
        </div>

      </div>
    </div>
  );
}
