import { useEffect, useState } from "react";
import api from "../../services/api";
import JobDetails from "./JobDetails";
import { 
  ArrowRight, 
  MapPin, 
  Briefcase,
  Star,
  Clock,
  Banknote,
  Search,
  Filter,
  X,
  ChevronDown
} from "lucide-react";

export default function Jobs() {
  const [recommended, setRecommended] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    jobType: "",
    experience: ""
  });

  useEffect(() => {
    Promise.all([
      api.get("/job-feed"),
      api.get("/profile")
    ]).then(([feedRes, profileRes]) => {
      setRecommended(feedRes.data.recommended || []);
      setAllJobs(feedRes.data.all || []);
      setFilteredJobs(feedRes.data.all || []);
      setProfile(profileRes.data.profile);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = allJobs;

    if (search) {
      result = result.filter(j =>
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.company?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filters.location) {
      result = result.filter(j => j.location === filters.location);
    }

    if (filters.jobType) {
      result = result.filter(j => j.jobType === filters.jobType);
    }

    if (filters.experience) {
      result = result.filter(j => parseInt(j.experience) <= parseInt(filters.experience));
    }

    setFilteredJobs(result);
  }, [search, filters, allJobs]);

  const getMatchedSkills = (jobSkills) => {
    if (!profile?.skills) return [];
    return jobSkills.filter(s => profile.skills.some(ps => ps.toLowerCase() === s.toLowerCase()));
  };

  const JobRow = ({ job, priority }) => {
    const matched = getMatchedSkills(job.skillsRequired || []);

    return (
      <div
        onClick={() => setSelectedJob(job)}
        className="group relative bg-white border border-slate-200 rounded-[32px] mb-4 p-8 cursor-pointer
          hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-100/40 transition-all duration-500"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          {/* Left: Branding & Identity */}
          <div className="flex flex-1 items-center gap-6">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl border border-slate-100 p-2 flex-shrink-0 flex items-center justify-center group-hover:bg-white transition-colors">
              {job.company?.logo ? (
                <img src={job.company.logo} alt="logo" className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="font-black text-slate-300 text-2xl">{job.company?.name?.[0]}</span>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {job.company?.name}
                </span>
                {priority && (
                  <div className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full text-[8px] font-black uppercase flex items-center gap-1">
                    <Star size={8} fill="currentColor" /> Best Match
                  </div>
                )}
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                {job.title}
              </h3>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {matched.slice(0, 3).map(s => (
                  <span key={s} className="bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase px-2 py-0.5 rounded-md">
                    {s}
                  </span>
                ))}
                {job.skillsRequired?.length > matched.length && (
                   <span className="text-[8px] font-black text-slate-300 uppercase px-2 py-0.5">+{job.skillsRequired.length - matched.length} More</span>
                )}
              </div>
            </div>
          </div>

          {/* Center: Essential Data */}
          <div className="flex flex-wrap items-center gap-6 lg:gap-12">
            <div className="min-w-[100px]">
              <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                <MapPin size={12} />
                <p className="text-[8px] font-black uppercase tracking-widest">Location</p>
              </div>
              <p className="text-xs font-black text-slate-700">{job.location}</p>
            </div>
            <div className="min-w-[100px]">
              <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                <Clock size={12} />
                <p className="text-[8px] font-black uppercase tracking-widest">Job Type</p>
              </div>
              <p className="text-xs font-black text-slate-900">{job.jobType}</p>
            </div>
            <div className="min-w-[100px]">
              <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                <Briefcase size={12} />
                <p className="text-[8px] font-black uppercase tracking-widest">Experience</p>
              </div>
              <p className="text-xs font-black text-slate-700">{job.experience}+ Yrs</p>
            </div>
          </div>

          {/* Right: Action */}
          <div className="flex items-center justify-end">
               <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-[-10deg] transition-all duration-300 shadow-sm">
                 <ArrowRight size={20} />
               </div>
          </div>
        </div>
      </div>
    );
  };

  if (selectedJob) return <JobDetails job={selectedJob} onBack={() => setSelectedJob(null)} />;

  return (
    <div className="max-w-7xl mx-auto pb-20 pt-6 px-4 animate-in fade-in duration-700">
      
      {/* HEADER SECTION */}
      <div className="mb-12 border-b border-slate-100 pb-10">
        <h1 className="text-7xl font-black text-slate-900 tracking-tighter mb-4">
          Market.
        </h1>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">
            {filteredJobs.length} Opportunities Indexed
          </p>

          <div className="flex items-center bg-white border border-slate-200 p-2 rounded-2xl w-full max-w-md shadow-sm">
            <Search className="ml-3 text-slate-400" size={18} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search roles or companies..."
              className="flex-1 bg-transparent border-none px-4 py-2 text-sm font-bold outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">

        {/* Sidebar Filters */}
        <aside className="lg:w-72 space-y-8">
           <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-8">
                <Filter size={16} className="text-indigo-600" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Refine Search</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2">Location</label>
                  <select
                    value={filters.location}
                    onChange={e => setFilters({...filters, location: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-bold outline-none cursor-pointer"
                  >
                    <option value="">Anywhere</option>
                    <option value="Remote">Remote</option>
                    <option value="New York">New York</option>
                    <option value="San Francisco">San Francisco</option>
                    <option value="London">London</option>
                  </select>
                </div>

                <div>
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2">Contract Type</label>
                  <div className="space-y-2">
                    {["Full-time", "Part-time", "Contract"].map(type => (
                      <button
                        key={type}
                        onClick={() => setFilters({...filters, jobType: filters.jobType === type ? "" : type})}
                        className={`w-full text-left px-4 py-2 rounded-lg text-xs font-black transition-all ${
                          filters.jobType === type ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2">Max Experience</label>
                  <input
                    type="range"
                    min="0" max="15"
                    value={filters.experience || 15}
                    onChange={e => setFilters({...filters, experience: e.target.value})}
                    className="w-full accent-indigo-600 mb-2"
                  />
                  <div className="flex justify-between text-[10px] font-black text-slate-400">
                    <span>0 yrs</span>
                    <span>{filters.experience || 15}+ yrs</span>
                  </div>
                </div>

                <button
                  onClick={() => setFilters({location: "", jobType: "", experience: ""})}
                  className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                >
                  Reset All
                </button>
              </div>
           </div>

           <div className="bg-indigo-600 p-8 rounded-[32px] text-white">
              <Zap size={32} className="mb-4 text-indigo-200" />
              <h4 className="text-xl font-black tracking-tight leading-tight mb-2">Get Instant Match Notifications</h4>
              <p className="text-[10px] font-bold text-indigo-100 opacity-80 mb-6">We'll alert you the second a job matches your skills.</p>
              <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest">Enable Alerts</button>
           </div>
        </aside>

        {/* Job Listings */}
        <div className="flex-1">
          {recommended.length > 0 && !search && !filters.location && !filters.jobType && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Recommended for You</h2>
              </div>
              <div>
                {recommended.slice(0, 3).map(job => (
                  <JobRow key={job._id} job={job} priority={true} />
                ))}
              </div>
            </section>
          )}

          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-slate-300" />
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">All Listings</h2>
              </div>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-[32px] border-2 border-dashed border-slate-100">
                 <p className="text-sm font-black text-slate-300 uppercase tracking-widest">No matching roles found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredJobs.map(job => (
                  <JobRow key={job._id} job={job} priority={false} />
                ))}
              </div>
            )}
          </section>
        </div>

      </div>
    </div>
  );
}
