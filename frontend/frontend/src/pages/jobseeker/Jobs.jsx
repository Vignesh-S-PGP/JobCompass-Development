import { useEffect, useState } from "react";
import api from "../../services/api";
import JobDetails from "./JobDetails";
import JobCard from "./JobCard"; 
import { Search, Filter, Zap } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function Jobs() {
  const [recommended, setRecommended] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [savedIds, setSavedIds] = useState([]);
  const location = useLocation();

  // Filters State
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    jobType: "",
    experience: ""
  });

  /* 1. INITIAL LOAD (Combined) */
  useEffect(() => {
    Promise.all([
      api.get("/job-feed"),
      api.get("/profile"),
      api.get("/applications/saved/ids")
    ])
      .then(([feedRes, profileRes, savedRes]) => {
        setRecommended(feedRes.data.recommended || []);
        setAllJobs(feedRes.data.all || []);
        setFilteredJobs(feedRes.data.all || []);
        setProfile(profileRes.data.profile);
        setSavedIds(savedRes.data.ids || []);
      })
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
  if (!location.state?.openJobId) return;
  if (allJobs.length === 0) return;

  const job = allJobs.find(j => j._id === location.state.openJobId);

  if (job) {
    setSelectedJob(job);
  }
}, [location.state, allJobs]);

  /* 2. FILTER LOGIC */
  useEffect(() => {
    let result = [...allJobs];

    if (search) {
      result = result.filter(j =>
        j.title?.toLowerCase().includes(search.toLowerCase()) ||
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
      result = result.filter(j => parseInt(j.experience || 0) <= parseInt(filters.experience));
    }

    setFilteredJobs(result);
  }, [search, filters, allJobs]);

  const toggleSave = async (jobId, e) => {
    e.stopPropagation();
    try {
      const res = await api.post(`/applications/saved/${jobId}`);
      setSavedIds(prev =>
        res.data.saved ? [...prev, jobId] : prev.filter(id => id !== jobId)
      );
    } catch (err) { console.error("Save failed", err); }
  };

  const getMatchedSkills = (jobSkills = []) => {
    if (!profile?.skills) return [];
    return jobSkills.filter(s => profile.skills.some(ps => ps.toLowerCase() === s.toLowerCase()));
  };

  if (selectedJob) return <JobDetails job={selectedJob} onBack={() => setSelectedJob(null)} />;

  return (
    <div className="max-w-7xl mx-auto pb-20 pt-6 px-4 animate-in fade-in duration-700">
      
      {/* HEADER */}
      <div className="mb-12 border-b border-slate-100 pb-10">
        <h1 className="text-7xl font-black text-slate-900 tracking-tighter mb-4">Jobs</h1>
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">
            {filteredJobs.length} Opportunities Indexed
          </p>
          <div className="flex items-center bg-white border border-slate-200 p-2 rounded-2xl w-full max-w-md shadow-sm">
            <Search className="ml-3 text-slate-400" size={18} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search roles..."
              className="flex-1 bg-transparent px-4 py-2 text-sm font-bold outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* SIDEBAR */}
        <aside className="lg:w-72 space-y-8">
          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-8">
              <Filter size={16} className="text-indigo-600" />
              <h3 className="text-[10px] font-black uppercase tracking-widest">Refine Search</h3>
            </div>

            <div className="space-y-6">
              {/* Location Select */}
              <div>
                <label className="text-[8px] font-black text-slate-400 uppercase mb-2 block">Location</label>
                <select
                  value={filters.location}
                  onChange={e => setFilters({ ...filters, location: e.target.value })}
                  className="w-full bg-slate-50 rounded-xl px-4 py-3 text-xs font-bold outline-none"
                >
                  <option value="">Anywhere</option>
                  <option value="Remote">Remote</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="New York">New York</option>
                </select>
              </div>

              {/* CONTRACT TYPE FILTER (Added Back) */}
              <div>
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2">Contract Type</label>
                <div className="space-y-2">
                  {["Full-time", "Part-time", "Contract"].map(type => (
                    <button
                      key={type}
                      onClick={() => setFilters({...filters, jobType: filters.jobType === type ? "" : type})}
                      className={`w-full text-left px-4 py-2 rounded-lg text-xs font-black transition-all ${
                        filters.jobType === type 
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Range */}
              <div>
                <label className="text-[8px] font-black text-slate-400 uppercase mb-2 block">Max Experience</label>
                <input
                  type="range" min="0" max="15"
                  value={filters.experience || 15}
                  onChange={e => setFilters({...filters, experience: e.target.value})}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] font-black text-slate-400 mt-1">
                  <span>0 yrs</span>
                  <span>{filters.experience || 15}+ yrs</span>
                </div>
              </div>

              <button
                onClick={() => setFilters({ location: "", jobType: "", experience: "" })}
                className="w-full py-3 text-[10px] font-black uppercase text-rose-500 hover:bg-rose-50 rounded-xl"
              >
                Reset All
              </button>
            </div>
          </div>
        </aside>

        {/* LISTINGS */}
        <div className="flex-1">
          {/* Recommended (Shown when no filters active) */}
          {!search && !filters.location && !filters.jobType && recommended.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                <h2 className="text-xs font-black uppercase tracking-[0.3em]">Recommended</h2>
              </div>
              {recommended.slice(0, 3).map(job => (
                <JobCard
                  key={`rec-${job._id}`}
                  job={job}
                  priority
                  matchedSkills={getMatchedSkills(job.skillsRequired)}
                  isSaved={savedIds.includes(job._id)}
                  onSaveToggle={toggleSave}
                  onOpen={() => setSelectedJob(job)}
                />
              ))}
            </section>
          )}

          {/* All Listings */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-slate-300" />
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">All Results</h2>
            </div>
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <JobCard
                  key={job._id}
                  job={job}
                  matchedSkills={getMatchedSkills(job.skillsRequired)}
                  isSaved={savedIds.includes(job._id)}
                  onSaveToggle={toggleSave}
                  onOpen={() => setSelectedJob(job)}
                />
              ))
            ) : (
              <div className="py-20 text-center bg-white rounded-[32px] border-2 border-dashed border-slate-100">
                <p className="text-sm font-black text-slate-300 uppercase tracking-widest">No roles match your filters</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}