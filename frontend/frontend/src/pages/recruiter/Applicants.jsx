import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  Users,
  Search,
  ChevronLeft,
  CheckCircle,
  XCircle,
  Star,
  TrendingUp,
  MapPin,
  Calendar,
  Clock
} from "lucide-react";
import { Card, Button, Badge, Skeleton, EmptyState } from "../../components/ui";
import { motion, AnimatePresence } from "framer-motion";

export default function Applicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const [appRes, jobRes] = await Promise.all([
        api.get(`/applications/job/${jobId}`),
        api.get(`/jobs/${jobId}`)
      ]);
      setApplicants(appRes.data.applicants || []);
      setJob(jobRes.data.job);
    } catch (err) {
      console.error("Failed to fetch applicants", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appId, status) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status });
      setApplicants(prev => prev.map(a => a._id === appId ? { ...a, status } : a));
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const filteredApplicants = applicants.filter(a => {
    const matchesSearch = a.applicant?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         a.applicant?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || a.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48 rounded-[32px]" />)}
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Applicants", value: applicants.length, icon: <Users size={20} />, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Shortlisted", value: applicants.filter(a => a.status === "shortlisted").length, icon: <Star size={20} />, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Rejected", value: applicants.filter(a => a.status === "rejected").length, icon: <XCircle size={20} />, color: "text-rose-500", bg: "bg-rose-500/10" },
    { label: "Pending Review", value: applicants.filter(a => a.status === "pending").length, icon: <Clock size={20} />, color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
           <Button variant="ghost" onClick={() => navigate(-1)} className="group text-muted-foreground hover:text-foreground -ml-4">
              <ChevronLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to jobs
           </Button>
           <h1 className="text-4xl font-black tracking-tight text-foreground">{job?.title}</h1>
           <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs flex items-center gap-2">
              <MapPin size={14} className="text-primary" /> {job?.location} • <Calendar size={14} className="text-primary" /> Posted on {new Date(job?.createdAt).toLocaleDateString()}
           </p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
             </Card>
           </motion.div>
        ))}
      </div>

      {/* SEARCH & FILTERS */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-muted/10 p-4 rounded-[32px] border border-border">
        <div className="flex-1 relative w-full">
           <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
           <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search candidates by name, email or skills..."
              className="w-full h-14 bg-card border-none rounded-2xl pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
           />
        </div>
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-card border border-border">
           {["all", "shortlisted", "pending", "rejected"].map(f => (
              <button
                 key={f}
                 onClick={() => setFilter(f)}
                 className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                    filter === f ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
                 }`}
              >
                 {f}
              </button>
           ))}
        </div>
      </div>

      {/* APPLICANTS DISPLAY */}
      {filteredApplicants.length > 0 ? (
        <AnimatePresence mode="popLayout">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredApplicants.map((app, i) => (
                 <motion.div
                    key={app._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.05 }}
                 >
                    <Card className="p-8 h-full flex flex-col group hover:border-primary/50 transition-all shadow-sm hover:shadow-2xl hover:shadow-primary/5 overflow-hidden relative rounded-[40px]">
                       <div className="absolute top-0 right-0 px-6 py-2 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-bl-[28px]">
                          ATS Score: {app.atsScore || "N/A"}%
                       </div>

                       <div className="flex flex-col items-center text-center space-y-4 mb-8">
                          <div className="w-24 h-24 rounded-[32px] bg-primary/5 flex items-center justify-center p-1 border border-primary/20 group-hover:scale-110 transition-transform duration-500">
                             {app.applicant?.profileImage ? (
                                <img src={app.applicant.profileImage} alt="" className="w-full h-full object-cover rounded-[28px]" />
                             ) : (
                                <div className="w-full h-full bg-primary/10 flex items-center justify-center rounded-[28px] text-primary text-2xl font-black">
                                   {app.applicant?.fullName?.[0]}
                                </div>
                             )}
                          </div>
                          <div>
                             <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors leading-tight">
                                {app.applicant?.fullName}
                             </h3>
                             <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                                {app.applicant?.email}
                             </p>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-3 mt-8">
                          <Button
                             onClick={() => navigate(`/recruiter/applicants/${app._id}/profile`)}
                             className="rounded-2xl h-14 font-black uppercase tracking-widest text-[10px] shadow-sm bg-slate-900 text-white hover:bg-primary transition-all"
                          >
                             View Profile
                          </Button>
                          <div className="flex gap-2">
                             <Button
                                variant="outline"
                                onClick={() => handleStatusUpdate(app._id, "shortlisted")}
                                className={`flex-1 rounded-2xl border-2 ${app.status === 'shortlisted' ? "bg-emerald-500/10 border-emerald-500 text-emerald-500" : "hover:border-emerald-500 hover:text-emerald-500"}`}
                             >
                                <CheckCircle size={18} />
                             </Button>
                             <Button
                                variant="outline"
                                onClick={() => handleStatusUpdate(app._id, "rejected")}
                                className={`flex-1 rounded-2xl border-2 ${app.status === 'rejected' ? "bg-rose-500/10 border-rose-500 text-rose-500" : "hover:border-rose-500 hover:text-rose-500"}`}
                             >
                                <XCircle size={18} />
                             </Button>
                          </div>
                       </div>
                    </Card>
                 </motion.div>
              ))}
           </div>
        </AnimatePresence>
      ) : (
        <EmptyState
           title="No candidates found"
           description="Try adjusting your search or filters to find what you're looking for."
           actionLabel="View all candidates"
           onAction={() => {
              setSearchTerm("");
              setFilter("all");
           }}
        />
      )}
    </div>
  );
}
