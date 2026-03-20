import { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Users,
  Briefcase,
  Activity,
  ShieldCheck,
  TrendingUp,
  CheckCircle,
  Clock,
  Settings,
  UserPlus,
  Palette,
  ChevronRight
} from "lucide-react";
import { Card, Button, Badge, Skeleton } from "../../components/ui";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from "../../components/ThemeProvider";

const MOCK_ACTIVITY = [
  { name: '01:00', users: 400, jobs: 240 },
  { name: '04:00', users: 300, jobs: 139 },
  { name: '08:00', users: 900, jobs: 980 },
  { name: '12:00', users: 1500, jobs: 1100 },
  { name: '16:00', users: 1200, jobs: 1300 },
  { name: '20:00', users: 800, jobs: 900 },
  { name: '00:00', users: 500, jobs: 300 },
];

const THEMES = [
  { id: "indigo", label: "Indigo Professional", color: "#4F46E5" },
  { id: "emerald", label: "Emerald Growth", color: "#10B981" },
  { id: "blue", label: "Blue Corporate", color: "#2563EB" },
  { id: "purple", label: "Purple Modern SaaS", color: "#9333EA" },
  { id: "orange", label: "Orange Startup", color: "#F97316" },
  { id: "teal", label: "Teal Minimal", color: "#14B8A6" },
  { id: "neon", label: "Dark Neon", color: "#A855F7" },
  { id: "rose", label: "Rose Elegant", color: "#E11D48" },
  { id: "slate", label: "Slate Neutral", color: "#475569" },
  { id: "gradient", label: "Gradient Premium", color: "#7C3AED" },
];

export default function AdminDashboard() {
  const { theme, setTheme } = useTheme();
  const [stats, setStats] = useState({
    users: 0,
    jobs: 0,
    applications: 0,
    activeNow: 12
  });
  const [loading, setLoading] = useState(true);
  const [recentActions, setRecentActions] = useState([]);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/stats");
        setStats(res.data.stats || {
          users: 124,
          jobs: 48,
          applications: 312,
          activeNow: 24
        });
      } catch (err) {
        console.error("Failed to fetch admin stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();

    setRecentActions([
      { id: 1, type: "user", text: "New recruiter registered", user: "Tech Corp", time: "2 min ago" },
      { id: 2, type: "job", text: "New job posting approved", user: "Creative Labs", time: "15 min ago" },
      { id: 3, type: "system", text: "ATS Model updated to v2.4", user: "System", time: "1 hour ago" },
      { id: 4, type: "user", text: "Admin added a new moderator", user: "SuperAdmin", time: "2 hours ago" },
    ]);
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-10 animate-pulse">
        <div className="h-40 bg-muted/40 rounded-[48px]" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Users", value: stats.users, icon: <Users size={20} />, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Active Jobs", value: stats.jobs, icon: <Briefcase size={20} />, color: "text-primary", bg: "bg-primary/10" },
    { label: "Applications", value: stats.applications, icon: <Activity size={20} />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Active Now", value: stats.activeNow, icon: <ShieldCheck size={20} />, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* HEADER HERO */}
      <div className="relative overflow-hidden rounded-[48px] bg-slate-900 text-white p-12 lg:p-16">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="space-y-6 text-center md:text-left">
            <Badge className="bg-primary/20 text-primary border-none px-4 py-1.5 font-black tracking-widest uppercase text-[10px]">
              Platform Overview
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-black tracking-tight leading-none">
              Control <span className="text-primary italic">everything</span> easily.
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-xl">
              JobCompass ecosystem is growing. You have {stats.users} total users and {stats.jobs} active job listings across the platform.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
               <Button size="lg" className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20">
                  <UserPlus size={18} className="mr-2" /> Add New User
               </Button>
               <Button size="lg" variant="outline" className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-xs border-white/10 hover:bg-white/10 text-white">
                  System Settings <Settings size={18} className="ml-2" />
               </Button>
            </div>
          </div>
          <div className="hidden lg:block w-72">
             <Card className="glass border-white/10 p-8 rounded-3xl text-center space-y-4" animate={false}>
                <Activity className="text-primary mx-auto" size={48} />
                <div>
                   <p className="text-4xl font-black">99.9%</p>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Uptime</p>
                </div>
                <div className="flex items-center justify-center gap-1.5 text-emerald-500 text-xs font-black">
                   <CheckCircle size={14} /> Healthy
                </div>
             </Card>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/20 blur-[150px] rounded-full translate-x-1/2" />
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
                <TrendingUp className="text-muted-foreground/30 group-hover:text-primary transition-colors" size={20} />
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
        {/* ACTIVITY CHART */}
        <div className="lg:col-span-8 space-y-6">
           <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <Activity size={24} className="text-primary" /> Platform Activity
           </h2>
           <Card className="p-8 rounded-[40px] shadow-sm">
              <div className="h-80 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MOCK_ACTIVITY}>
                       <defs>
                          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="rgb(var(--primary))" stopOpacity={0.1}/>
                             <stop offset="95%" stopColor="rgb(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                       <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                       <Tooltip
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
                          labelStyle={{ fontWeight: 900, marginBottom: '4px' }}
                       />
                       <Area type="monotone" dataKey="users" stroke="rgb(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                       <Area type="monotone" dataKey="jobs" stroke="#10B981" strokeWidth={3} fill="transparent" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </Card>
        </div>

        {/* THEME SELECTOR - ADMIN ONLY */}
        <div className="lg:col-span-4 space-y-6">
           <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <Palette size={24} className="text-primary" /> Global Appearance
           </h2>
           <Card className="p-8 rounded-[40px] shadow-sm space-y-8">
              <div className="space-y-2">
                 <h3 className="font-black text-lg">System Themes</h3>
                 <p className="text-xs text-muted-foreground font-medium">Select a theme to apply across the entire platform for all users.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 {THEMES.map(t => (
                    <button
                       key={t.id}
                       onClick={() => setTheme(t.id)}
                       className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${
                          theme === t.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                       }`}
                    >
                       <div className="w-6 h-6 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                       <span className="text-[10px] font-black uppercase tracking-tight text-left">{t.label}</span>
                       {theme === t.id && <CheckCircle size={14} className="ml-auto text-primary" />}
                    </button>
                 ))}
              </div>

              <div className="pt-4 border-t border-border">
                 <div className="p-4 bg-primary/5 rounded-2xl flex items-center justify-between">
                    <div>
                       <p className="text-xs font-black uppercase tracking-widest">Custom Branding</p>
                       <p className="text-[10px] text-muted-foreground font-medium">Coming soon in v3.0</p>
                    </div>
                    <Badge variant="outline">Enterprise</Badge>
                 </div>
              </div>
           </Card>

           <Card className="p-8 rounded-[40px] shadow-sm space-y-6">
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                 <Clock size={20} className="text-primary" /> Audit Log
              </h2>
              <div className="space-y-4">
                 {recentActions.map(action => (
                    <div key={action.id} className="flex gap-4 items-start">
                       <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                          action.type === 'user' ? 'bg-blue-500/10 text-blue-500' : 'bg-primary/10 text-primary'
                       }`}>
                          {action.type === 'user' ? <Users size={14} /> : <Settings size={14} />}
                       </div>
                       <div className="min-w-0">
                          <p className="text-[11px] font-bold text-foreground leading-tight">{action.text}</p>
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mt-0.5">{action.time}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
