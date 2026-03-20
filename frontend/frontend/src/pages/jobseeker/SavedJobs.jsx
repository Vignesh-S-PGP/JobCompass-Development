import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Bookmark, Building2, MapPin, Clock, DollarSign, ArrowRight } from "lucide-react";
import { Card, Button, Badge, Skeleton, EmptyState } from "../../components/ui";
import { motion, AnimatePresence } from "framer-motion";

export default function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/jobs/saved"); // Fixed endpoint
      setJobs(res.data.savedJobs || []);
    } catch (err) {
      console.error("Failed to load saved jobs", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = async (jobId, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/jobs/${jobId}/save`);
      setJobs(prev => prev.filter(j => j._id !== jobId));
    } catch (err) {
      console.error("Unsave failed", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight">Saved Jobs</h1>
          <p className="text-muted-foreground font-medium">Manage the opportunities you've bookmarked.</p>
        </div>
        <div className="bg-primary/5 border border-primary/10 rounded-2xl px-6 py-4 flex items-center gap-4">
           <Bookmark size={24} className="text-primary" />
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Bookmarks</p>
              <p className="text-2xl font-black text-primary leading-none">{jobs.length}</p>
           </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-64 rounded-[40px]" />)}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
           title="Your bookmark list is empty"
           description="Save jobs that catch your eye and they'll appear here for easy access later."
           actionLabel="Discover Jobs"
           onAction={() => navigate("/jobseeker/jobs")}
           icon={<Bookmark size={48} />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence>
            {jobs.map((job, i) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="p-8 h-full flex flex-col group hover:border-primary/50 transition-all shadow-sm hover:shadow-xl hover:shadow-primary/5 overflow-hidden relative rounded-[40px]">
                   <div className="flex-1 space-y-6">
                      <div className="flex justify-between items-start">
                         <div className="w-16 h-16 rounded-[24px] bg-muted/40 flex items-center justify-center p-3 border border-border group-hover:bg-primary/5 group-hover:border-primary/20 transition-all transform group-hover:scale-110">
                            {job.company?.logo ? (
                               <img src={job.company.logo} alt="" className="w-full h-full object-contain" />
                            ) : (
                               <Building2 size={28} className="text-muted-foreground" />
                            )}
                         </div>
                         <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => toggleSave(job._id, e)}
                            className="rounded-xl h-10 w-10 text-primary bg-primary/10 hover:bg-primary/20"
                         >
                            <Bookmark size={20} fill="currentColor" />
                         </Button>
                      </div>

                      <div className="space-y-2">
                         <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors leading-none tracking-tight">
                            {job.title}
                         </h3>
                         <p className="text-sm font-bold text-primary">{job.company?.name}</p>

                         <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-primary/60" /> {job.location}</span>
                            <span className="flex items-center gap-1.5"><DollarSign size={14} className="text-emerald-500" /> {job.salaryRange || "Competitive"}</span>
                         </div>
                      </div>
                   </div>

                   <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                         <Clock size={14} /> {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                      <Button
                         onClick={() => navigate("/jobseeker/jobs", { state: { openJobId: job._id } })}
                         className="rounded-xl px-6 h-11 font-black uppercase tracking-widest text-[10px]"
                      >
                         Apply Now <ArrowRight size={14} className="ml-2" />
                      </Button>
                   </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
