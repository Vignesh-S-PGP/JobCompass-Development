import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Search,
  ArrowUpRight,
  Briefcase,
  Calendar
} from "lucide-react";

export default function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/applications/my")
      .then(res => setApplications(res.data.applications || []))
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredApplications =
    filter === "all"
      ? applications
      : applications.filter(a => a.status === filter);

  const getStatusColor = (status) => {
    const map = {
      applied: "text-indigo-700 bg-indigo-50 border-indigo-100",
      shortlisted: "text-emerald-700 bg-emerald-50 border-emerald-100",
      rejected: "text-rose-700 bg-rose-50 border-rose-100",
    };
    return map[status] || "text-slate-600 bg-slate-50 border-slate-200";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Applied Jobs</h1>

        <div className="flex gap-2">
          {["all", "applied", "shortlisted", "rejected"].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase border transition
                ${filter === s
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-20 text-center">
          <Search size={40} className="mx-auto text-slate-200 mb-4" />
          <p className="text-slate-500">No applications found</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="divide-y divide-slate-100">
            {filteredApplications.map(app => (
              <div
                key={app.applicationId}
                className="grid grid-cols-12 gap-4 px-6 py-5 hover:bg-slate-50 transition"
              >
                {/* JOB */}
                <div className="col-span-5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 border rounded-lg flex items-center justify-center">
                    {app.company?.logo
                      ? <img src={app.company.logo} className="max-h-8" />
                      : <Building2 className="text-slate-300" />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{app.job?.title}</p>
                    <p className="text-sm text-slate-500">{app.company?.name}</p>
                  </div>
                </div>

                {/* STATUS */}
                <div className="col-span-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </div>

                {/* ATS */}
                <div className="col-span-2 text-center font-bold">
                  {typeof app.atsScore === "number" ? `${app.atsScore}%` : "—"}
                </div>

                {/* APPLIED DATE */}
                <div className="col-span-1 flex items-center gap-1 text-xs text-slate-500">
                  <Calendar size={12} />
                  {app.appliedAt
                    ? new Date(app.appliedAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </div>

                {/* ACTION */}
                <div className="col-span-1 text-right">
                  <button
                    onClick={() => navigate(`/jobseeker/applications/${app.applicationId}`)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-indigo-600"
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