import { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Users,
  Briefcase,
  Clock,
  ArrowRight,
  Plus,
  BarChart3,
  CheckCircle,
  MessageSquare
} from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatCard, Button, Card } from "../../components/ui/index.jsx";

export default function RecruiterDashboard() {
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplicants: 0,
    newMessages: 0,
    shortlisted: 0
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className="animate-pulse space-y-10">
        <div className="h-20 bg-slate-200 rounded-3xl w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-44 bg-slate-200 rounded-[32px]" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           <div className="lg:col-span-8 h-96 bg-slate-200 rounded-[40px]" />
           <div className="lg:col-span-4 h-96 bg-slate-200 rounded-[40px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-10 animate-in fade-in duration-700">

      <PageHeader
        title="Dashboard"
        description="Manage your job postings and applicants."
        actions={
          <Link to="/recruiter/jobs/create">
            <Button size="lg">
              <Plus size={18} className="mr-2" /> Post New Job
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Jobs" value={stats.activeJobs} icon={Briefcase} color="indigo" />
        <StatCard title="Total Applicants" value={stats.totalApplicants} icon={Users} color="emerald" />
        <StatCard title="Shortlisted" value={stats.shortlisted} icon={CheckCircle} color="amber" />
        <StatCard title="Messages" value={stats.newMessages} icon={MessageSquare} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        <div className="lg:col-span-8">
           <Card className="p-10">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                   <Clock size={20} className="text-indigo-600" /> Recent Postings
                 </h2>
                 <Link to="/recruiter/jobs" className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:underline">View All</Link>
              </div>

              <div className="space-y-4">
                {recentJobs.length > 0 ? recentJobs.map(job => (
                  <div key={job._id} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-transparent hover:border-slate-200 hover:bg-white transition-all group">
                    <div className="flex items-center gap-5">
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${job.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                          {job.status === 'active' ? 'A' : 'C'}
                       </div>
                       <div>
                          <h3 className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{new Date(job.createdAt).toLocaleDateString()} • {job.jobType}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-8">
                       <div className="text-right hidden sm:block">
                          <p className="text-lg font-black text-slate-900 leading-none">{job.applicantCount || 0}</p>
                          <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Applicants</p>
                       </div>
                       <Link to={`/recruiter/jobs/${job._id}/applicants`} className="p-3 bg-white shadow-sm border border-slate-100 rounded-xl group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                          <ArrowRight size={18} />
                       </Link>
                    </div>
                  </div>
                )) : (
                  <div className="py-12 text-center">
                     <p className="text-slate-400 font-bold">You haven't posted any jobs yet.</p>
                     <Link to="/recruiter/jobs/create" className="text-indigo-600 text-xs font-black uppercase tracking-widest mt-4 inline-block hover:underline">Create your first job</Link>
                  </div>
                )}
              </div>
           </Card>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
              <BarChart3 className="text-indigo-400 mb-6 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-xl font-black mb-2 tracking-tight">Hiring Insights</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
                Your job postings are performing <span className="text-indigo-400 font-black">24% better</span> than the average.
              </p>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <div className="flex justify-between items-end">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Profile Views</span>
                       <span className="text-sm font-black">1,204</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-500 w-[70%]" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between items-end">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Conversion</span>
                       <span className="text-sm font-black">12.5%</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 w-[45%]" />
                    </div>
                 </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
           </div>

           <Card className="p-8 text-center bg-slate-50/30 border-dashed">
              <div className="w-16 h-16 bg-white shadow-sm border border-slate-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                 <Users size={28} />
              </div>
              <h3 className="font-black text-slate-900 mb-2">Build your brand</h3>
              <p className="text-xs text-slate-400 font-bold mb-8">Complete your company profile to attract top talent.</p>
              <Link to="/recruiter/company">
                <Button variant="secondary" className="w-full">
                  Edit Company
                </Button>
              </Link>
           </Card>
        </div>

      </div>
    </div>
  );
}
