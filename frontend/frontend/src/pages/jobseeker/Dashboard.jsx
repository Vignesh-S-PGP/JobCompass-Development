import { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Briefcase,
  CheckCircle,
  Clock,
  XCircle,
  ArrowRight,
  Star,
  Search
} from "lucide-react";
import { Link } from "react-router-dom";
import JobDetails from "./JobDetails";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatCard, Button } from "../../components/ui/index.jsx";

export default function JobSeekerDashboard() {
  const [stats, setStats] = useState({
    applied: 0,
    shortlisted: 0,
    rejected: 0
  });

  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, jobsRes, profileRes] = await Promise.all([
          api.get("/applications/my"),
          api.get("/job-feed"),
          api.get("/profile/me")
        ]);

        const apps = appsRes.data.applications || [];

        setStats({
          applied: apps.length,
          shortlisted: apps.filter(a => a.status === "shortlisted").length,
          rejected: apps.filter(a => a.status === "rejected").length
        });

        setRecommendedJobs(
          jobsRes.data.recommended?.slice(0, 3) || []
        );

        setProfile(profileRes.data);
      } catch (err) {
        console.error("Dashboard data fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (selectedJob) {
    return (
      <JobDetails
        job={selectedJob}
        onBack={() => setSelectedJob(null)}
      />
    );
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-10">
        <div className="h-20 bg-slate-200 rounded-3xl w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-44 bg-slate-200 rounded-[32px]" />
          ))}
        </div>
        <div className="h-96 bg-slate-200 rounded-[40px] w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">

      <PageHeader
        title={`Hello, ${profile?.fullName?.split(" ")[0] || "Explorer"}! 👋`}
        description="Discover new opportunities tailored for you."
        actions={
          <Link to="/jobseeker/jobs">
            <Button size="lg">
              Find Jobs <Search size={16} className="ml-2" />
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Applied"
          value={stats.applied}
          icon={Clock}
          color="indigo"
        />
        <StatCard
          title="Shortlisted"
          value={stats.shortlisted}
          icon={CheckCircle}
          color="emerald"
        />
        <StatCard
          title="Rejected"
          value={stats.rejected}
          icon={XCircle}
          color="rose"
        />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
            <Star className="text-amber-500 fill-amber-500" size={20}/>
            Matches For You
          </h2>
          <Link to="/jobseeker/jobs" className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:underline">
            View All
          </Link>
        </div>

        <div className="space-y-4">
          {recommendedJobs.length > 0 ? recommendedJobs.map(job => (
            <div
              key={job._id}
              onClick={() => setSelectedJob(job)}
              className="cursor-pointer group bg-white border border-slate-100 p-8 rounded-[32px] hover:border-indigo-600 transition-all shadow-sm hover:shadow-2xl hover:shadow-indigo-900/5 flex items-center justify-between"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 overflow-hidden shrink-0 group-hover:scale-110 transition-transform">
                  {job.company?.logo
                    ? <img src={job.company.logo} className="w-full h-full object-cover" alt="logo"/>
                    : <Briefcase className="text-slate-300" size={24}/>
                  }
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                    {job.title}
                  </h3>
                  <p className="text-sm font-bold text-slate-400 mt-1">
                    {job.company?.name} • {job.location}
                  </p>
                  <div className="flex gap-2 mt-4">
                    {job.skillsRequired?.slice(0, 3).map(skill => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-slate-50 text-[10px] font-black uppercase text-slate-500 rounded-lg border border-slate-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm group-hover:shadow-lg">
                <ArrowRight size={24}/>
              </div>
            </div>
          )) : (
            <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[40px] bg-slate-50/50">
              <p className="text-slate-400 font-bold">
                No matches found yet. Keep your profile updated!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
