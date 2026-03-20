import { useState, useEffect } from "react";
import api from "../../services/api";
import {
  CheckCircle,
  Clock,
  XCircle,
  ArrowRight,
  Star,
  Briefcase,
  TrendingUp,
  MapPin,
  DollarSign
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import JobDetails from "./JobDetails";
import { Card, Button, Badge, Skeleton, EmptyState } from "../../components/ui";
import { motion } from "framer-motion";

export default function JobSeekerDashboard() {
  const [stats, setStats] = useState({
    applied: 0,
    shortlisted: 0,
    rejected: 0
  });
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, jobsRes] = await Promise.all([
          api.get("/applications/my"),
          api.get("/job-feed")
        ]);
        const apps = appsRes.data.applications || [];
        setStats({
          applied: apps.length,
          shortlisted: apps.filter(a => a.status === "shortlisted").length,
          rejected: apps.filter(a => a.status === "rejected").length
        });
        setRecommendedJobs(jobsRes.data.recommended?.slice(0, 4) || []);
      } catch (err) {
        console.error("Dashboard data fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (selectedJob) {
    return <JobDetails job={selectedJob} onBack={() => setSelectedJob(null)} />;
  }

  if (loading) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-12 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Applications", value: stats.applied, icon: <Clock size={20} />, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Shortlisted", value: stats.shortlisted, icon: <CheckCircle size={20} />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Rejected", value: stats.rejected, icon: <XCircle size={20} />, color: "text-rose-500", bg: "bg-rose-500/10" }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-foreground">Welcome back!</h1>
          <p className="text-muted-foreground font-medium">Here's what's happening with your job applications.</p>
        </div>
        <Link to="/jobseeker/jobs">
          <Button size="lg" className="rounded-xl shadow-lg shadow-primary/20">
            Explore New Jobs <ArrowRight className="ml-2" size={18} />
          </Button>
        </Link>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-6 flex items-center gap-5 group">
              <div className={`${card.bg} ${card.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{card.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black text-foreground">{card.value}</p>
                  <span className="text-xs font-bold text-emerald-500 flex items-center">
                    <TrendingUp size={12} className="mr-1" /> +2
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* RECOMMENDED */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Star size={20} className="text-amber-500 fill-amber-500" />
            </div>
            <h2 className="text-xl font-black tracking-tight">Jobs for you</h2>
          </div>
          <Link to="/jobseeker/jobs" className="text-sm font-bold text-primary hover:underline">
            View all matches
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendedJobs.length > 0 ? (
            recommendedJobs.map((job, i) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                onClick={() => setSelectedJob(job)}
              >
                <Card className="p-6 cursor-pointer group hover:border-primary/50 transition-all">
                  <div className="flex gap-5">
                    <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center overflow-hidden border border-border group-hover:border-primary/20 transition-colors">
                      {job.company?.logo ? (
                        <img src={job.company.logo} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Briefcase className="text-muted-foreground" size={24} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors truncate">
                          {job.title}
                        </h3>
                        <Badge variant="secondary" className="bg-primary/5 text-primary border-none">
                          {job.jobType || "Full-time"}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground font-semibold text-sm mt-0.5">{job.company?.name}</p>

                      <div className="flex items-center gap-4 mt-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} className="text-primary" /> {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign size={14} className="text-emerald-500" /> {job.salaryRange || "Competitive"}
                        </span>
                      </div>

                      <div className="flex gap-2 mt-4 flex-wrap">
                        {job.skillsRequired?.slice(0, 3).map(skill => (
                          <Badge key={skill} variant="outline" className="rounded-md px-2 py-0.5 font-medium border-muted text-muted-foreground">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full">
              <EmptyState
                title="No recommendations yet"
                description="Complete your profile and upload a resume to get personalized job matches."
                actionLabel="Complete Profile"
                onAction={() => navigate("/jobseeker/profile")}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
