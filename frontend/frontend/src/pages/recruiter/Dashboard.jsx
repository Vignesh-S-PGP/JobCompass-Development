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
  MessageSquare,
  Zap,
  Target,
  ArrowUpRight
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Button, Badge, Skeleton } from "../../components/ui";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const MOCK_DATA = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 300 },
  { name: 'Wed', value: 600 },
  { name: 'Thu', value: 800 },
  { name: 'Fri', value: 500 },
  { name: 'Sat', value: 900 },
  { name: 'Sun', value: 1200 },
];

export default function RecruiterDashboard() {
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplicants: 0,
    newMessages: 4,
    shortlisted: 0
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [jobsRes] = await Promise.all([
          api.get("/jobs/recruiter")
        ]);
        const jobs = jobsRes.data.jobs || [];
        const apiStats = jobsRes.data.stats || {};
        setRecentJobs(jobs.slice(0, 5));
        setStats({
          activeJobs: apiStats.activeJobs || 0,
          totalApplicants: apiStats.totalApplicants || 0,
          newMessages: 4,
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
      <div className="animate-pulse space-y-10 max-w-7xl mx-auto">
        <div className="h-48 rounded-[40px] bg-muted/40" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Skeleton className="h-96 rounded-[40px]" />
          <Skeleton className="h-96 rounded-[40px]" />
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Active Jobs", value: stats.activeJobs, icon: <Briefcase size={20} />, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Total Applicants", value: stats.totalApplicants, icon: <Users size={20} />, color: "text-primary", bg: "bg-primary/10" },
    { label: "Shortlisted", value: stats.shortlisted, icon: <CheckCircle size={20} />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Messages", value: stats.newMessages, icon: <MessageSquare size={20} />, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* HEADER HERO */}
      <div className="relative overflow-hidden rounded-[48px] bg-slate-900 text-white p-12 lg:p-16">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="space-y-6 text-center md:text-left">
            <Badge variant="secondary" className="bg-primary/20 text-primary border-none px-4 py-1 font-black tracking-widest uppercase text-[10px]">
              <Zap size={14} className="mr-2" /> Recruiter Hub v2.0
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-black tracking-tight leading-none">
              Build your <span className="text-primary italic">dream team</span> today.
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-xl">
              You have {stats.totalApplicants} applicants waiting for review. Optimize your hiring process with our new AI-driven ATS.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
               <Button size="lg" onClick={() => navigate("/recruiter/jobs/create")} className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20">
                  <Plus size={18} className="mr-2" /> Post New Job
               </Button>
               <Button size="lg" variant="outline" className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-xs border-white/10 hover:bg-white/10 text-white">
                  Analytics <BarChart3 size={18} className="ml-2" />
               </Button>
            </div>
          </div>

          <div className="hidden lg:flex flex-col gap-4 w-72">
             <Card className="glass border-white/10 p-6 rounded-3xl">
                <div className="flex justify-between items-center mb-4">
                   <Target className="text-primary" size={24} />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Match Accuracy</span>
                </div>
                <p className="text-3xl font-black">94.2%</p>
                <div className="h-1.5 w-full bg-white/10 rounded-full mt-3 overflow-hidden">
                   <motion.div initial={{ width: 0 }} animate={{ width: "94%" }} className="h-full bg-primary" />
                </div>
             </Card>
             <Card className="glass border-white/10 p-6 rounded-3xl">
                <div className="flex justify-between items-center mb-4">
                   <TrendingUp className="text-emerald-500" size={24} />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Time to Hire</span>
                </div>
                <p className="text-3xl font-black">12 Days</p>
                <p className="text-xs font-bold text-emerald-500 mt-1">15% faster than last month</p>
             </Card>
          </div>
        </div>

        {/* Decor */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/20 blur-[150px] rounded-full translate-x-1/2" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="p-8 border-none bg-card hover:shadow-2xl transition-all group overflow-hidden relative">
              <div className="relative z-10 flex items-center justify-between mb-8">
                <div className={`${s.bg} ${s.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                  {s.icon}
                </div>
                <ArrowUpRight className="text-muted-foreground/30 group-hover:text-primary transition-colors" size={20} />
              </div>
              <div className="relative z-10">
                <p className="text-4xl font-black text-foreground mb-1">{s.value}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{s.label}</p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* RECENT POSTINGS */}
        <div className="lg:col-span-8 space-y-6">
           <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                <Clock size={24} className="text-primary" /> Recent Postings
              </h2>
              <Link to="/recruiter/jobs" className="text-xs font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-1">
                Manage all <ArrowRight size={14} />
              </Link>
           </div>

           <div className="space-y-4">
             {recentJobs.length > 0 ? recentJobs.map((job, i) => (
               <motion.div key={job._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + (i * 0.05) }}>
                 <Card className="p-6 cursor-pointer hover:border-primary/50 transition-all group shadow-sm">
                   <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg ${job.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                            {job.title[0]}
                         </div>
                         <div>
                            <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors">{job.title}</h3>
                            <div className="flex items-center gap-3 mt-0.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                               <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                               <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                               <span>{job.jobType}</span>
                            </div>
                         </div>
                      </div>

                      <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-border">
                         <div className="flex gap-8">
                            <div className="text-center">
                               <p className="text-lg font-black text-foreground">{job.applicantCount || 0}</p>
                               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Applicants</p>
                            </div>
                            <div className="text-center">
                               <p className="text-lg font-black text-primary">0</p>
                               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">New</p>
                            </div>
                         </div>
                         <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/recruiter/jobs/${job._id}/applicants`)}
                            className="w-12 h-12 rounded-2xl bg-muted/40 hover:bg-primary hover:text-primary-foreground shadow-sm transition-all"
                         >
                            <ArrowRight size={18} />
                         </Button>
                      </div>
                   </div>
                 </Card>
               </motion.div>
             )) : (
                <Card className="p-12 text-center border-dashed border-2 bg-muted/10">
                   <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Briefcase size={32} className="text-muted-foreground" />
                   </div>
                   <h3 className="text-xl font-black mb-2">No active jobs</h3>
                   <p className="text-muted-foreground font-medium mb-8">Post your first job to start building your team.</p>
                   <Button onClick={() => navigate("/recruiter/jobs/create")} className="rounded-xl px-8 py-6 font-black uppercase tracking-widest text-[10px]">
                      Post a Job <Plus className="ml-2" size={16} />
                   </Button>
                </Card>
             )}
           </div>
        </div>

        {/* ANALYTICS PREVIEW */}
        <div className="lg:col-span-4 space-y-8">
           <Card className="p-8 bg-slate-900 text-white shadow-2xl relative overflow-hidden rounded-[32px]">
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-xl font-black">Hiring Activity</h3>
                   <BarChart3 className="text-primary" size={24} />
                </div>

                <div className="h-48 w-full mb-6">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={MOCK_DATA}>
                         <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="rgb(var(--primary))" stopOpacity={0.8}/>
                               <stop offset="95%" stopColor="rgb(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                         </defs>
                         <Area type="monotone" dataKey="value" stroke="rgb(var(--primary))" fillOpacity={1} fill="url(#colorValue)" />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                   <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-500">
                      <span>Total Applicants</span>
                      <span className="text-white">{stats.totalApplicants}</span>
                   </div>
                   <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[70%]" />
                   </div>
                   <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-500">
                      <span>Interview Rate</span>
                      <span className="text-white">12.5%</span>
                   </div>
                   <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[45%]" />
                   </div>
                </div>
              </div>
              <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-primary/10 blur-[100px] rounded-full" />
           </Card>

           <Card className="p-8 shadow-sm rounded-[32px] text-center space-y-6">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto">
                 <Target size={28} />
              </div>
              <div>
                <h3 className="font-black text-lg mb-2 tracking-tight">AI Matching</h3>
                <p className="text-xs text-muted-foreground font-medium">Use our new ATS score to find the best fit in seconds.</p>
              </div>
              <Button variant="outline" onClick={() => navigate("/recruiter/company")} className="w-full h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 hover:bg-primary hover:text-primary-foreground transition-all">
                 Company Settings
              </Button>
           </Card>
        </div>
      </div>
    </div>
  );
}
