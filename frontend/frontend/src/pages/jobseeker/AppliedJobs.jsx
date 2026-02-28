import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { 
  Building2, 
  Search, 
  ArrowUpRight,
  Briefcase
} from "lucide-react";

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const getStatusColor = (status) => {
    const map = {
      shortlisted: "text-emerald-700 bg-emerald-50 border-emerald-100",
      rejected: "text-rose-700 bg-rose-50 border-rose-100",
      pending: "text-amber-700 bg-amber-50 border-amber-100",
    };
    return map[status] || "text-slate-600 bg-slate-50 border-slate-200";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header Area */}
      <div className="flex items-center justify-between pb-4">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Applied Jobs
        </h1>
        
        <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-1.5 rounded-lg shadow-sm">
           <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Total</span>
           <span className="text-lg font-bold leading-none">{applications.length}</span>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-20 text-center shadow-sm">
          <Search size={40} className="mx-auto text-slate-200 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900">No records found</h3>
          <p className="text-slate-500 text-sm mt-1">You haven't applied to any jobs yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          
          {/* HIGH VISIBILITY TABLE HEADER */}
          <div className="hidden md:grid grid-cols-12 bg-slate-800 border-b border-slate-700 px-6 py-4 items-center">
            <div className="col-span-5 flex items-center gap-2">
              <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Role & Entity</span>
            </div>
            <div className="col-span-3">
              <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Status</span>
            </div>
            <div className="col-span-2 text-center">
              <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">ATS Match</span>
            </div>
            <div className="col-span-2 text-right">
              <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Details</span>
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-slate-100">
            {applications.map(app => (
              <div
                key={app.applicationId}
                className="group grid grid-cols-1 md:grid-cols-12 items-center px-6 py-5 gap-4 hover:bg-slate-50/80 transition-colors"
              >
                {/* Info */}
                <div className="col-span-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-white transition-colors">
                    {app.company?.logo ? (
                      <img src={app.company.logo} alt="logo" className="max-h-8 max-w-[32px] object-contain" />
                    ) : (
                      <Building2 className="text-slate-300" size={20} />
                    )}
                  </div>
                  <div className="truncate">
                    <h3 className="font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      {app.job?.title || "Job Title"}
                    </h3>
                    <p className="text-sm font-medium text-slate-500">
                      {app.company?.name || "Company"}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="col-span-3">
                  <span className={`px-3 py-1 rounded-full border text-[11px] font-bold flex items-center w-fit gap-2 ${getStatusColor(app.status)}`}>
                    <div className="w-1 h-1 rounded-full bg-current" />
                    <span className="capitalize">{app.status}</span>
                  </span>
                </div>

                {/* Score */}
                <div className="col-span-2 text-center">
                  {typeof app.atsScore === "number" ? (
                    <div className="inline-flex flex-col">
                      <span className="text-lg font-bold text-slate-900 leading-none">
                        {app.atsScore}<span className="text-xs text-indigo-500 ml-0.5">%</span>
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-300 uppercase italic tracking-tighter">Evaluating</span>
                  )}
                </div>

                {/* Action */}
                <div className="col-span-2 text-right">
                  <button
                    onClick={() => navigate(`/jobseeker/applications/${app.applicationId}`)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-900 hover:text-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 transition-all shadow-sm"
                  >
                    View <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}