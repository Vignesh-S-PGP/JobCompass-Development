import { useEffect, useState } from "react";
import api from "../../services/api";
import { Trash2, MapPin, DollarSign, Clock } from "lucide-react";

export default function JobManagement() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/admin/jobs");
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await api.delete(`/admin/jobs/${id}`);
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <p className="text-center text-slate-500">Loading jobs...</p>;
  }

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
            Job Postings
          </h1>
          <p className="text-slate-500 font-bold mt-2">
            Oversee all active and inactive listings
          </p>
        </div>
        <div className="bg-slate-900 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest">
          {jobs.length} Jobs
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {jobs.map((j) => (
          <div
            key={j._id}
            className="bg-white p-8 rounded-[32px] border border-slate-200 hover:border-indigo-500 transition-all group relative shadow-sm"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {j.title}
                </h3>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">
                  Exp: {j.experience} Years
                </p>
              </div>
              <button
                onClick={() => deleteJob(j._id)}
                className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-slate-50 pt-6">
              <div className="flex items-center gap-2 text-slate-500">
                <MapPin size={16} className="text-slate-300" />
                <span className="text-xs font-bold">{j.location}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <DollarSign size={16} className="text-slate-300" />
                <span className="text-xs font-bold">
                  {j.salaryRange || "Market"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Clock size={16} className="text-slate-300" />
                <span className="text-xs font-bold">{j.jobType}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}