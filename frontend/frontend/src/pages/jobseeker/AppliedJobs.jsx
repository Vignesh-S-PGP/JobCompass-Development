import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Search,
  ArrowUpRight,
  Calendar,
  Briefcase
} from "lucide-react";

export default function AppliedJobs() {

  const [applications,setApplications] = useState([]);
  const [loading,setLoading] = useState(true);
  const [filter,setFilter] = useState("all");

  const navigate = useNavigate();

  useEffect(()=>{

    api.get("/applications/my")
      .then(res => setApplications(res.data.applications || []))
      .catch(()=>setApplications([]))
      .finally(()=>setLoading(false));

  },[]);

  const filteredApplications =
    filter === "all"
      ? applications
      : applications.filter(a => a.status === filter);

  const getStatusColor = (status)=>{

    const map = {

      applied:"bg-indigo-50 text-indigo-600",
      shortlisted:"bg-emerald-50 text-emerald-600",
      rejected:"bg-rose-50 text-rose-600"

    };

    return map[status] || "bg-slate-100 text-slate-600";

  };


  const stats = {
    total:applications.length,
    applied:applications.filter(a=>a.status==="applied").length,
    shortlisted:applications.filter(a=>a.status==="shortlisted").length,
    rejected:applications.filter(a=>a.status==="rejected").length
  };

  if(loading){

    return(
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"/>
      </div>
    );

  }

  return(

    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

      {/* HEADER */}

      <div className="flex items-start justify-between">

        <div>

          <h1 className="text-3xl font-semibold text-slate-900">
            Applied Jobs
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Track all your job applications
          </p>

        </div>

      </div>


      {/* STATS */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <div className="bg-white border rounded-xl p-4">

          <p className="text-xs text-slate-400">
            Total
          </p>

          <p className="text-xl font-semibold text-slate-900">
            {stats.total}
          </p>

        </div>

        <div className="bg-white border rounded-xl p-4">

          <p className="text-xs text-slate-400">
            Applied
          </p>

          <p className="text-xl font-semibold text-indigo-600">
            {stats.applied}
          </p>

        </div>

        <div className="bg-white border rounded-xl p-4">

          <p className="text-xs text-slate-400">
            Shortlisted
          </p>

          <p className="text-xl font-semibold text-emerald-600">
            {stats.shortlisted}
          </p>

        </div>

        <div className="bg-white border rounded-xl p-4">

          <p className="text-xs text-slate-400">
            Rejected
          </p>

          <p className="text-xl font-semibold text-rose-600">
            {stats.rejected}
          </p>

        </div>

      </div>


      {/* FILTERS */}

      <div className="flex gap-2 flex-wrap">

        {["all","applied","shortlisted","rejected"].map(s => (

          <button
            key={s}
            onClick={()=>setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition
              ${filter === s
                ? "bg-indigo-600 text-white"
                : "bg-white border text-slate-500 hover:border-indigo-400"}
            `}
          >

            {s}

          </button>

        ))}

      </div>


      {/* APPLICATION LIST */}

      {filteredApplications.length === 0 ? (

        <div className="bg-white border rounded-xl p-20 text-center">

          <Search size={40} className="mx-auto text-slate-200 mb-4"/>

          <p className="text-sm text-slate-500">
            No applications found
          </p>

        </div>

      ) : (

        <div className="space-y-4">

          {filteredApplications.map(app => (

            <div
              key={app.applicationId}
              className="bg-white border rounded-xl p-5 flex items-center justify-between
              hover:shadow-md hover:border-indigo-500 transition cursor-pointer"
            >

              {/* LEFT */}

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">

                  {app.company?.logo ? (

                    <img
                      src={app.company.logo}
                      className="max-h-full object-contain"
                    />

                  ) : (

                    <Building2 className="text-slate-400"/>

                  )}

                </div>

                <div>

                  <p className="font-medium text-slate-900">
                    {app.job?.title}
                  </p>

                  <p className="text-xs text-slate-500">
                    {app.company?.name}
                  </p>

                </div>

              </div>


              {/* STATUS */}

              <div className="hidden md:block">

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium
                  ${getStatusColor(app.status)}`}
                >

                  {app.status}

                </span>

              </div>


              {/* ATS SCORE */}

              <div className="hidden md:block text-sm font-semibold text-slate-600">

                {typeof app.atsScore === "number"
                  ? `${app.atsScore}%`
                  : "—"}

              </div>


              {/* DATE */}

              <div className="hidden md:flex items-center gap-1 text-xs text-slate-500">

                <Calendar size={12}/>

                {app.appliedAt
                  ? new Date(app.appliedAt).toLocaleDateString()
                  : "—"}

              </div>


              {/* ACTION */}

              <button
                onClick={()=>navigate(`/jobseeker/applications/${app.applicationId}`)}
                className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-indigo-600"
              >

                View

                <ArrowUpRight size={16}/>

              </button>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}