import { useEffect, useState } from "react";
import api from "../../services/api";
import JobDetails from "./JobDetails";
import JobCard from "./JobCard";
import { Search, Filter } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function Jobs() {

  const [recommended, setRecommended] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [profile, setProfile] = useState(null);
  const [savedIds, setSavedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    location: "",
    jobType: "",
    experience: ""
  });

  /* LOAD DATA */

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

  /* OPEN JOB FROM NOTIFICATION */

  useEffect(() => {

    if (!location.state?.openJobId) return;
    if (allJobs.length === 0) return;

    const job = allJobs.find(j => j._id === location.state.openJobId);

    if (job) setSelectedJob(job);

  }, [location.state, allJobs]);

  /* FILTER */

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
      result = result.filter(
        j => parseInt(j.experience || 0) <= parseInt(filters.experience)
      );
    }

    setFilteredJobs(result);

  }, [search, filters, allJobs]);

  /* SAVE JOB */

  const toggleSave = async (jobId, e) => {

    e.stopPropagation();

    try {

      const res = await api.post(`/applications/saved/${jobId}`);

      setSavedIds(prev =>
        res.data.saved
          ? [...prev, jobId]
          : prev.filter(id => id !== jobId)
      );

    } catch (err) {
      console.error(err);
    }

  };

  const getMatchedSkills = (jobSkills = []) => {

    if (!profile?.skills) return [];

    return jobSkills.filter(s =>
      profile.skills.some(ps =>
        ps.toLowerCase() === s.toLowerCase()
      )
    );

  };

  if (selectedJob) {
    return (
      <JobDetails
        job={selectedJob}
        onBack={() => setSelectedJob(null)}
      />
    );
  }

  return (

    <div className="max-w-7xl mx-auto px-6 py-8">

      {/* HEADER */}

      <div className="flex items-start justify-between mb-10">

        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            Job Opportunities
          </h1>
        </div>

        {/* MINI JOB COUNT CARD */}

        <div className="bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-sm">

          <p className="text-xs text-slate-400">
            Jobs Available
          </p>

          <p className="text-xl font-semibold text-indigo-600">
            {filteredJobs.length}
          </p>

        </div>

      </div>

      {/* SEARCH */}

      <div className="mb-8">

        <div className="flex items-center bg-white border rounded-lg px-4 py-3 shadow-sm">

          <Search size={18} className="text-slate-400"/>

          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search jobs or companies"
            className="ml-3 w-full outline-none text-sm"
          />

        </div>

      </div>

      {/* MAIN LAYOUT */}

      <div className="flex gap-8">

        {/* FILTER SIDEBAR */}

        <aside className="w-64 sticky top-24 h-fit">

          <div className="bg-white border rounded-xl p-6 space-y-6">

            <div className="flex items-center gap-2 text-sm font-medium">
              <Filter size={16}/>
              Filters
            </div>

            {/* LOCATION */}

            <div>

              <label className="text-xs text-slate-500">
                Location
              </label>

              <select
                value={filters.location}
                onChange={e =>
                  setFilters({...filters, location: e.target.value})
                }
                className="w-full mt-2 border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Anywhere</option>
                <option value="Remote">Remote</option>
                <option value="Bengaluru">Bengaluru</option>
              </select>

            </div>

            {/* TYPE */}

            <div>

              <label className="text-xs text-slate-500">
                Job Type
              </label>

              <select
                value={filters.jobType}
                onChange={e =>
                  setFilters({...filters, jobType: e.target.value})
                }
                className="w-full mt-2 border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">All</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>

            </div>

            {/* EXPERIENCE */}

            <div>

              <label className="text-xs text-slate-500">
                Max Experience
              </label>

              <input
                type="range"
                min="0"
                max="15"
                value={filters.experience || 15}
                onChange={e =>
                  setFilters({...filters, experience: e.target.value})
                }
                className="w-full mt-3 accent-indigo-600"
              />

              <div className="text-xs text-slate-400 mt-1">
                {filters.experience || 15}+ years
              </div>

            </div>

            <button
              onClick={() =>
                setFilters({
                  location:"",
                  jobType:"",
                  experience:""
                })
              }
              className="w-full text-sm text-indigo-600 hover:underline"
            >
              Reset filters
            </button>

          </div>

        </aside>

        {/* JOB LIST */}

        <div className="flex-1 space-y-6 overflow-y-auto max-h-[calc(100vh-220px)] pr-2">

          {recommended.length > 0 && !search && !filters.location && !filters.jobType && (

            <div>

              <h2 className="text-sm font-semibold text-slate-700 mb-4">
                Recommended for you
              </h2>

              {recommended.slice(0,3).map(job => (

                <JobCard
                  key={job._id}
                  job={job}
                  matchedSkills={getMatchedSkills(job.skillsRequired)}
                  isSaved={savedIds.includes(job._id)}
                  onSaveToggle={toggleSave}
                  onOpen={() => setSelectedJob(job)}
                />

              ))}

            </div>

          )}

          <div>

            <h2 className="text-sm font-semibold text-slate-700 mb-4">
              All Jobs
            </h2>

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

              <div className="text-center py-20 text-slate-400 text-sm">
                No jobs match your filters
              </div>

            )}

          </div>

        </div>

      </div>

    </div>

  );

}