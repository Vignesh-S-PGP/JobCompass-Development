import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { 
  Building2, 
  Search, 
  ArrowUpRight,
  Briefcase,
  MapPin,
  Clock,
  Filter,
  Star
} from "lucide-react";
import { ListSkeleton } from "../../components/ui/Skeleton";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";

export default function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/applications/my")
      .then(res => setApplications(res.data.applications || []))
      .catch(err => {
        console.error("❌ Failed to load applications:", err);
        setApplications([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ListSkeleton />;

  const getStatusVariant = (status) => {
    const map = {
      shortlisted: "success",
      rejected: "danger",
      pending: "warning",
      applied: "primary"
    };
    return map[status] || "default";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
           <Badge variant="primary" className="mb-4">Submission History</Badge>
           <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">
             Applied <span className="text-primary-600">Jobs</span>.
           </h1>
           <p className="text-slate-500 font-medium text-lg mt-4 max-w-xl">
             Track the status of your transmissions across the global registry.
           </p>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-950 text-white px-8 py-4 rounded-3xl shadow-xl shadow-slate-200/50 self-start md:self-auto group">
           <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Total Indexed</span>
              <span className="text-3xl font-black leading-none mt-1 group-hover:text-primary-500 transition-colors">{applications.length}</span>
           </div>
           <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/5">
              <Briefcase size={20} className="text-primary-500" />
           </div>
        </div>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          title="No records found"
          description="You haven't applied to any roles yet. Explore the market feed to find your next opportunity."
          actionLabel="View Market Feed"
          onAction={() => navigate("/jobseeker/jobs")}
        />
      ) : (
        <div className="space-y-4">
          {/* HIGH VISIBILITY TABLE HEADER */}
          <Card className="hidden md:grid grid-cols-12 bg-slate-950 border-none px-10 py-5 items-center rounded-[2rem] shadow-xl">
            <div className="col-span-5">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Role & Domain</span>
            </div>
            <div className="col-span-3">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Lifecycle Status</span>
            </div>
            <div className="col-span-2 text-center">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">ATS Alignment</span>
            </div>
            <div className="col-span-2 text-right">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Actions</span>
            </div>
          </Card>

          {/* Table Rows */}
          <div className="space-y-4">
            {applications.map(app => (
              <Card
                key={app.applicationId}
                hover
                className="grid grid-cols-1 md:grid-cols-12 items-center px-10 py-6 gap-6 group"
              >
                {/* Info */}
                <div className="col-span-5 flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-white group-hover:border-primary-200 transition-all duration-300">
                    {app.company?.logo ? (
                      <img src={app.company.logo} alt="logo" className="max-h-10 max-w-[40px] object-contain p-1" />
                    ) : (
                      <Building2 className="text-slate-200" size={24} />
                    )}
                  </div>
                  <div className="truncate">
                    <h3 className="text-lg font-black text-slate-900 truncate group-hover:text-primary-600 transition-colors leading-tight mb-1">
                      {app.job?.title || "Job Title"}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4">
                      <p className="text-xs font-bold text-primary-500 uppercase tracking-tight">
                        {app.company?.name || "Company"}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                         <MapPin size={12} /> {app.job?.location}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="col-span-3">
                  <div className="flex items-center">
                    <Badge variant={getStatusVariant(app.status)} className="px-4 py-1.5 rounded-xl border-none shadow-sm font-black uppercase tracking-widest text-[9px]">
                      <div className="flex items-center gap-2">
                         <div className={`w-1.5 h-1.5 rounded-full bg-current`} />
                         {app.status}
                      </div>
                    </Badge>
                  </div>
                </div>

                {/* Score */}
                <div className="col-span-2 text-center">
                  {typeof app.atsScore === "number" ? (
                    <div className="inline-flex flex-col items-center">
                      <span className="text-2xl font-black text-slate-900 leading-none mb-1 group-hover:scale-110 transition-transform">
                        {app.atsScore}<span className="text-[10px] text-primary-500 ml-0.5 uppercase">%</span>
                      </span>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Compatibility</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                       <Star size={14} className="text-slate-200 animate-spin" />
                       <span className="text-[8px] font-black text-slate-300 uppercase italic tracking-widest">Evaluating</span>
                    </div>
                  )}
                </div>

                {/* Action */}
                <div className="col-span-2 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/jobseeker/applications/${app.applicationId}`)}
                    className="rounded-2xl px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all shadow-xl shadow-transparent group-hover:shadow-primary-600/20"
                    icon={ArrowUpRight}
                  >
                    Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
