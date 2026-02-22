import { useEffect, useState } from "react";
import api from "../../services/api";
import JobDetails from "./JobDetails";
import { 
  ArrowRight, 
  MapPin, 
  Briefcase,
  Star,
  Clock,
  Banknote
} from "lucide-react";

export default function Jobs() {
  const [recommended, setRecommended] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/job-feed").then(res => {
      setRecommended(res.data.recommended || []);
      setAllJobs(res.data.all || []);
    }).finally(() => setLoading(false));
  }, []);

  const JobRow = ({ job, priority }) => (
    <div 
      onClick={() => setSelectedJob(job)}
      className="group relative bg-white border border-slate-200 rounded-2xl mb-3 p-6 lg:px-10 cursor-pointer 
        hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-100/40 transition-all duration-300"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        
        {/* Left: Larger Branding & Identity */}
        <div className="flex flex-1 items-center gap-8">
          <div className="w-20 h-20 bg-white rounded-xl border border-slate-100 p-2 flex-shrink-0 flex items-center justify-center shadow-sm group-hover:border-indigo-100 transition-colors">
            {job.company?.logo ? (
              <img src={job.company.logo} alt="logo" className="max-h-full max-w-full object-contain" />
            ) : (
              <span className="font-black text-slate-200 text-3xl">{job.company?.name?.[0]}</span>
            )}
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                {job.company?.name}
              </span>
              {priority && (
                <div className="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[9px] font-black uppercase">
                  <Star size={10} fill="currentColor" /> Match
                </div>
              )}
            </div>
            <h3 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
              {job.title}
            </h3>
          </div>
        </div>

        {/* Center: Essential Data */}
        <div className="flex flex-wrap items-center gap-8 lg:gap-14">
          <div className="min-w-[110px]">
            <div className="flex items-center gap-1.5 mb-1 text-slate-400">
              <MapPin size={12} />
              <p className="text-[9px] font-black uppercase tracking-widest">Location</p>
            </div>
            <p className="text-sm font-bold text-slate-700">{job.location}</p>
          </div>
          <div className="min-w-[110px]">
            <div className="flex items-center gap-1.5 mb-1 text-slate-400">
              <Banknote size={12} />
              <p className="text-[9px] font-black uppercase tracking-widest">Salary</p>
            </div>
            <p className="text-sm font-bold text-slate-900">{job.salaryRange || "Market Rate"}</p>
          </div>
          <div className="min-w-[110px]">
            <div className="flex items-center gap-1.5 mb-1 text-slate-400">
              <Clock size={12} />
              <p className="text-[9px] font-black uppercase tracking-widest">Exp</p>
            </div>
            <p className="text-sm font-bold text-slate-700">{job.experience}+ Years</p>
          </div>
        </div>

        {/* Right: Action */}
        <div className="flex items-center justify-end pl-4">
             <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
               <ArrowRight size={20} />
             </div>
        </div>
      </div>
    </div>
  );

  if (selectedJob) return <JobDetails job={selectedJob} onBack={() => setSelectedJob(null)} />;

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-1 bg-slate-100 rounded-full overflow-hidden">
         <div className="w-full h-full bg-indigo-600 animate-pulse" />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-20 pt-6 px-4">
      
      {/* HEADER SECTION - Reduced Padding */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter">
            Jobs.
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2">
            Professional Market Feed
          </p>
        </div>

        {/* DUAL LIGHT THEME COUNTERS */}
        <div className="flex gap-3">
          <div className="bg-white border-2 border-slate-100 p-4 rounded-2xl min-w-[150px] shadow-sm">
            <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1">Recommended</p>
            <p className="text-3xl font-black text-slate-900 leading-none">{recommended.length}</p>
          </div>
          <div className="bg-white border-2 border-slate-900 p-4 rounded-2xl min-w-[150px] shadow-sm">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">All Listings</p>
            <p className="text-3xl font-black text-slate-900 leading-none">{allJobs.length}</p>
          </div>
        </div>
      </div>

      {/* RECOMMENDED JOBS */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Recommended Jobs</h2>
        </div>
        <div>
          {recommended.map(job => (
            <JobRow key={job._id} job={job} priority={true} />
          ))}
        </div>
      </section>

      {/* ALL JOBS */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">All Jobs</h2>
        </div>
        <div>
          {allJobs.map(job => (
            <JobRow key={job._id} job={job} priority={false} />
          ))}
        </div>
      </section>

    </div>
  );
}