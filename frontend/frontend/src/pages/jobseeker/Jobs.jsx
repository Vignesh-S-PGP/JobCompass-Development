import { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Search,
  MapPin,
  Briefcase,
  Bookmark,
  Building2,
  Clock,
  Sparkles
} from "lucide-react";
import { Card, Button, Badge, Skeleton, EmptyState } from "../../components/ui";
import { motion } from "framer-motion";
import JobDetails from "./JobDetails";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    location: ""
  });
  const [savedJobIds, setSavedJobIds] = useState([]);

  useEffect(() => {
    fetchJobs();
    fetchSavedJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/job-feed"); // Restored to /job-feed
      setJobs(res.data.jobs || res.data.recommended || []);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const res = await api.get("/jobs/saved");
      setSavedJobIds((res.data.savedJobs || []).map(j => j._id));
    } catch (err) {}
  };

  const toggleSaveJob = async (id) => {
    try {
      if (savedJobIds.includes(id)) {
        await api.delete(`/jobs/${id}/save`);
        setSavedJobIds(prev => prev.filter(jid => jid !== id));
      } else {
        await api.post(`/jobs/${id}/save`);
        setSavedJobIds(prev => [...prev, id]);
      }
    } catch (err) {}
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        job.company?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filters.type || job.jobType === filters.type;
    const matchesLocation = !filters.location || job.location?.toLowerCase().includes(filters.location.toLowerCase());
    return matchesSearch && matchesType && matchesLocation;
  });

  if (selectedJob) {
    return <JobDetails job={selectedJob} onBack={() => setSelectedJob(null)} />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* HERO SECTION */}
      <div className="relative overflow-hidden rounded-[40px] bg-slate-900 p-12 text-white">
        <div className="relative z-10 max-w-2xl space-y-6">
          <Badge variant="secondary" className="bg-primary/20 text-primary border-none py-1 px-4 text-xs font-black uppercase tracking-widest">
            <Sparkles size={14} className="mr-2" /> 500+ New opportunities
          </Badge>
          <h1 className="text-5xl font-black tracking-tight leading-tight">
            Find your <span className="text-primary">dream career</span> in tech.
          </h1>
          <p className="text-slate-400 text-lg font-medium leading-relaxed">
            Discover thousands of job opportunities from top companies around the world. Filter by location, salary, and job type.
          </p>
        </div>

        {/* Search Bar Overlay */}
        <div className="mt-12 glass border-white/10 p-3 rounded-2xl flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Job title, keywords, or company..."
              className="w-full bg-white/10 border-none rounded-xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-primary/40 transition-all outline-none"
            />
          </div>
          <div className="flex-1 relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              placeholder="City, state, or remote"
              className="w-full bg-white/10 border-none rounded-xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-primary/40 transition-all outline-none"
            />
          </div>
          <Button size="lg" className="rounded-xl px-12 h-auto py-4 font-black uppercase tracking-widest text-xs">
            Search Jobs
          </Button>
        </div>

        {/* Decor */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-blue-500/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* FILTERS & LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
        {/* Sticky Filters */}
        <aside className="lg:col-span-1 space-y-6 sticky top-24">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-lg uppercase tracking-wider">Filters</h3>
            <Button variant="ghost" size="sm" onClick={() => setFilters({ type: "", location: "" })} className="text-xs text-primary font-bold">
              Reset
            </Button>
          </div>

          <Card className="p-6 space-y-8">
            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Employment Type</label>
              <div className="space-y-2">
                {["Full-time", "Part-time", "Contract", "Remote", "Internship"].map(type => (
                  <label key={type} className="flex items-center gap-3 group cursor-pointer">
                    <input
                      type="radio"
                      name="jobType"
                      checked={filters.type === type}
                      onChange={() => setFilters(prev => ({ ...prev, type }))}
                      className="w-4 h-4 accent-primary border-border"
                    />
                    <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Experience Level</label>
              <div className="space-y-2">
                {["Entry Level", "Intermediate", "Senior", "Expert"].map(lvl => (
                  <label key={lvl} className="flex items-center gap-3 group cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-border accent-primary" />
                    <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">{lvl}</span>
                  </label>
                ))}
              </div>
            </div>
          </Card>

          <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
            <h4 className="font-bold text-sm mb-2">Job Alerts</h4>
            <p className="text-xs text-muted-foreground mb-4">Get notified for new jobs matching these criteria.</p>
            <Button size="sm" className="w-full text-[10px] font-black uppercase tracking-widest py-3">Enable Alerts</Button>
          </div>
        </aside>

        {/* JOB LIST */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between mb-4 px-2">
            <p className="text-sm font-bold text-muted-foreground tracking-tight">
              Showing <span className="text-foreground">{filteredJobs.length}</span> results
            </p>
            <div className="flex items-center gap-3">
               <span className="text-xs font-bold text-muted-foreground">Sort by:</span>
               <select className="bg-transparent text-sm font-bold text-foreground outline-none cursor-pointer">
                 <option>Newest</option>
                 <option>Salary: High to Low</option>
                 <option>Relevance</option>
               </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {loading ? (
              [1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-48 rounded-[32px]" />)
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((job, i) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedJob(job)}
                >
                  <Card className="p-8 cursor-pointer group hover:border-primary/50 transition-all shadow-sm hover:shadow-xl hover:shadow-primary/5 overflow-hidden relative">
                    {/* Entry Badge */}
                    {i < 3 && (
                      <div className="absolute top-0 right-0 px-6 py-2 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-bl-3xl border-b border-l border-primary/5">
                        New Posting
                      </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                      <div className="w-20 h-20 rounded-[28px] bg-muted/40 flex items-center justify-center p-3 border border-border group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-300 transform group-hover:scale-110">
                        {job.company?.logo ? (
                          <img src={job.company.logo} alt="" className="w-full h-full object-contain" />
                        ) : (
                          <Building2 size={32} className="text-muted-foreground" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-2">
                        <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors leading-none tracking-tight">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-muted-foreground">
                          <span className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                            <Building2 size={16} className="text-primary/60" /> {job.company?.name}
                          </span>
                          <span className="w-1.5 h-1.5 bg-border rounded-full" />
                          <span className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                            <MapPin size={16} className="text-primary/60" /> {job.location}
                          </span>
                          <span className="w-1.5 h-1.5 bg-border rounded-full" />
                          <span className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                            <Clock size={16} className="text-primary/60" /> {new Date(job.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex gap-2 pt-2">
                          {job.skillsRequired?.slice(0, 4).map(skill => (
                            <Badge key={skill} variant="outline" className="px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg bg-muted/10 border-muted group-hover:border-primary/20 transition-colors">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 pt-6 md:pt-0 border-t md:border-t-0 border-border">
                        <div className="text-right">
                          <p className="text-xl font-black text-foreground">{job.salaryRange || "Competitive"}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">per year / gross</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSaveJob(job._id);
                            }}
                            className={`rounded-2xl w-12 h-12 border-border hover:bg-muted group-hover:border-primary/20 transition-all ${
                              savedJobIds.includes(job._id) ? "bg-primary/10 text-primary border-primary/20" : ""
                            }`}
                          >
                            <Bookmark size={20} fill={savedJobIds.includes(job._id) ? "currentColor" : "none"} />
                          </Button>
                          <Button className="rounded-2xl px-6 h-12 font-black uppercase tracking-widest text-[10px] group-hover:translate-x-1 transition-transform">
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              <EmptyState
                title="No jobs matching your criteria"
                description="Try broadening your search or resetting your filters to explore more opportunities."
                actionLabel="View all jobs"
                onAction={() => {
                  setSearchTerm("");
                  setFilters({ type: "", location: "" });
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
