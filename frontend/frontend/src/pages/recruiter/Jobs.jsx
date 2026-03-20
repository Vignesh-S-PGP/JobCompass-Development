import { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Briefcase,
  Search,
  Plus,
  ArrowRight,
  MoreVertical,
  Edit,
  Trash2,
  LayoutGrid,
  List as ListIcon,
  ArrowUpRight,
  Pause,
  Play
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Badge, Skeleton, EmptyState } from "../../components/ui";
import { motion, AnimatePresence } from "framer-motion";

export default function RecruiterJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/jobs/recruiter");
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error("Failed to fetch recruiter jobs", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (jobId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "closed" : "active";
      await api.patch(`/jobs/${jobId}/status`, { status: newStatus });
      setJobs(prev => prev.map(j => j._id === jobId ? { ...j, status: newStatus } : j));
    } catch (err) {}
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs(prev => prev.filter(j => j._id !== jobId));
    } catch (err) {}
  };

  const filteredJobs = jobs.filter(j =>
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black tracking-tight text-foreground">Manage Jobs</h1>
           <p className="text-muted-foreground font-medium mt-1">
              You have {jobs.length} total postings. Use the ATS tools to filter candidates.
           </p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" size="lg" className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-xs border-2">
              Export Stats <ArrowUpRight size={18} className="ml-2" />
           </Button>
           <Button size="lg" onClick={() => navigate("/recruiter/jobs/create")} className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20">
              <Plus size={18} className="mr-2" /> Post New Job
           </Button>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 relative w-full">
           <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
           <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your postings by title or location..."
              className="w-full h-14 bg-muted/40 border-none rounded-2xl pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
           />
        </div>
        <div className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-2xl border border-border">
           <Button variant={viewMode === "grid" ? "primary" : "ghost"} size="icon" onClick={() => setViewMode("grid")} className="rounded-xl h-11 w-11 shadow-none">
              <LayoutGrid size={20} />
           </Button>
           <Button variant={viewMode === "list" ? "primary" : "ghost"} size="icon" onClick={() => setViewMode("list")} className="rounded-xl h-11 w-11 shadow-none">
              <ListIcon size={20} />
           </Button>
        </div>
      </div>

      {/* JOBS DISPLAY */}
      {loading ? (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-4"}>
           {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className={viewMode === "grid" ? "h-64 rounded-[32px]" : "h-24 rounded-2xl"} />)}
        </div>
      ) : filteredJobs.length > 0 ? (
        <AnimatePresence mode="popLayout">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {filteredJobs.map((job, i) => (
                 <motion.div key={job._id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }}>
                    <Card className="p-8 h-full flex flex-col justify-between group hover:border-primary/50 transition-all shadow-sm hover:shadow-xl hover:shadow-primary/5 overflow-hidden relative">
                       <div className="space-y-6">
                          <div className="flex justify-between items-start">
                             <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform">
                                {job.title[0]}
                             </div>
                             <div className="flex gap-1">
                                <Badge className={job.status === "active" ? "bg-emerald-500/10 text-emerald-500 border-none" : "bg-rose-500/10 text-rose-500 border-none"}>
                                   {job.status.toUpperCase()}
                                </Badge>
                             </div>
                          </div>

                          <div className="space-y-1">
                             <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors leading-tight">
                                {job.title}
                             </h3>
                             <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                {job.location} • {job.jobType}
                             </p>
                          </div>

                          <div className="flex gap-4 pt-2">
                             <div className="space-y-1">
                                <p className="text-xl font-black text-foreground">{job.applicantCount || 0}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Applicants</p>
                             </div>
                          </div>
                       </div>

                       <div className="flex flex-col gap-2 mt-8">
                          <Button onClick={() => navigate(`/recruiter/jobs/${job._id}/applicants`)} className="w-full rounded-xl h-12 font-black uppercase tracking-widest text-[10px] shadow-sm">
                             Candidates <ArrowRight size={14} className="ml-2" />
                          </Button>
                          <div className="flex gap-2">
                             <Button variant="outline" onClick={() => navigate(`/recruiter/jobs/${job._id}/edit`)} className="flex-1 rounded-xl h-12 border-border hover:bg-muted">
                                <Edit size={16} />
                             </Button>
                             <Button variant="outline" onClick={() => handleStatusToggle(job._id, job.status)} className="flex-1 rounded-xl h-12 border-border hover:bg-muted">
                                {job.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                             </Button>
                             <Button variant="outline" onClick={() => handleDeleteJob(job._id)} className="flex-1 rounded-xl h-12 border-border hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/20 text-muted-foreground">
                                <Trash2 size={16} />
                             </Button>
                          </div>
                       </div>
                    </Card>
                 </motion.div>
               ))}
            </div>
          ) : (
            <div className="space-y-4">
               {filteredJobs.map((job, i) => (
                  <motion.div key={job._id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ delay: i * 0.03 }}>
                    <Card className="p-6 flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-primary/50 transition-all shadow-sm">
                       <div className="flex items-center gap-5 flex-1 min-w-0">
                          <div className="w-14 h-14 rounded-2xl bg-muted/40 flex items-center justify-center font-black text-primary group-hover:bg-primary/10 transition-colors">
                             {job.title[0]}
                          </div>
                          <div className="min-w-0">
                             <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors truncate">{job.title}</h3>
                             <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{job.location} • {job.jobType}</p>
                          </div>
                       </div>

                       <div className="flex items-center gap-12">
                          <div className="text-center">
                             <p className="text-lg font-black text-foreground">{job.applicantCount || 0}</p>
                             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Applicants</p>
                          </div>
                          <div className="text-center w-24">
                             <Badge className={job.status === "active" ? "bg-emerald-500/10 text-emerald-500 border-none" : "bg-rose-500/10 text-rose-500 border-none"}>
                                {job.status}
                             </Badge>
                          </div>
                          <div className="flex gap-2">
                             <Button onClick={() => navigate(`/recruiter/jobs/${job._id}/applicants`)} className="rounded-xl px-6 h-11 font-black uppercase tracking-widest text-[10px]">
                                Manage
                             </Button>
                             <Button variant="outline" onClick={() => navigate(`/recruiter/jobs/${job._id}/edit`)} className="rounded-xl h-11 w-11 border-border hover:bg-muted">
                                <Edit size={16} />
                             </Button>
                             <Button variant="outline" onClick={() => handleStatusToggle(job._id, job.status)} className="rounded-xl h-11 w-11 border-border hover:bg-muted">
                                {job.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                             </Button>
                          </div>
                       </div>
                    </Card>
                  </motion.div>
               ))}
            </div>
          )}
        </AnimatePresence>
      ) : (
        <EmptyState
           title="You haven't posted any jobs"
           description="Click the button above to create your first job posting and start receiving applications."
           actionLabel="Post a Job"
           onAction={() => navigate("/recruiter/jobs/create")}
        />
      )}
    </div>
  );
}
