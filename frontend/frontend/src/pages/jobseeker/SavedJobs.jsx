import { useEffect, useState } from "react";
import api from "../../services/api";
import JobCard from "./JobCard";
import { useNavigate } from "react-router-dom";

export default function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  /* LOAD SAVED JOBS */
  useEffect(() => {
    api.get("/applications/saved")
      .then(res => setJobs(res.data.jobs || []))
      .catch(err => console.error("Failed to load saved jobs", err));
  }, []);

  /* TOGGLE SAVE / UNSAVE */
  const toggleSave = async (jobId, e) => {
    e.stopPropagation();

    try {
      const res = await api.post(`/applications/saved/${jobId}`);

      // If unsaved → remove from list
      if (!res.data.saved) {
        setJobs(prev => prev.filter(j => j._id !== jobId));
      }
    } catch (err) {
      console.error("Unsave failed", err);
    }
  };

  /* OPEN JOB DETAILS (via Jobs page) */
  const openJob = (job) => {
    navigate("/jobseeker/jobs", {
      state: { openJobId: job._id }
    });
  };

  if (jobs.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 font-bold">
        No saved jobs yet
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20 pt-6 px-4 animate-in fade-in">
      <h1 className="text-3xl font-black text-slate-900 mb-8">
        Saved Jobs
      </h1>

      <div className="space-y-2">
        {jobs.map(job => (
          <JobCard
            key={job._id}
            job={job}
            isSaved={true}              // always saved here
            onSaveToggle={toggleSave}  // unsave support
            onOpen={() => openJob(job)}
          />
        ))}
      </div>
    </div>
  );
}