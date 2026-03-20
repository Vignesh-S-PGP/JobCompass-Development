import { useEffect, useState } from "react";
import api from "../../services/api";
import JobCard from "./JobCard";
import { useNavigate } from "react-router-dom";
import { Bookmark, Search } from "lucide-react";

export default function SavedJobs() {

  const [jobs,setJobs] = useState([]);
  const navigate = useNavigate();

  /* LOAD SAVED JOBS */

  useEffect(()=>{

    api.get("/applications/saved")
      .then(res => setJobs(res.data.jobs || []))
      .catch(err => console.error("Failed to load saved jobs",err));

  },[]);

  /* TOGGLE SAVE */

  const toggleSave = async(jobId,e)=>{

    e.stopPropagation();

    try{

      const res = await api.post(`/applications/saved/${jobId}`);

      if(!res.data.saved){

        setJobs(prev => prev.filter(j => j._id !== jobId));

      }

    }catch(err){
      console.error("Unsave failed",err);
    }

  };

  /* OPEN JOB */

  const openJob = (job)=>{

    navigate("/jobseeker/jobs",{
      state:{ openJobId: job._id }
    });

  };

  return(

    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

      {/* HEADER */}

      <div className="flex items-start justify-between">

        <div>

          <h1 className="text-3xl font-semibold text-slate-900">
            Saved Jobs
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Jobs you've bookmarked to apply later
          </p>

        </div>

        {/* COUNT CARD */}

        <div className="bg-white border rounded-xl px-5 py-3 shadow-sm">

          <p className="text-xs text-slate-400">
            Saved Jobs
          </p>

          <p className="text-xl font-semibold text-indigo-600">
            {jobs.length}
          </p>

        </div>

      </div>


      {/* EMPTY STATE */}

      {jobs.length === 0 && (

        <div className="bg-white border rounded-xl p-20 text-center">

          <Bookmark
            size={40}
            className="mx-auto text-slate-200 mb-4"
          />

          <p className="text-sm text-slate-500">
            You haven't saved any jobs yet
          </p>

          <button
            onClick={()=>navigate("/jobseeker/jobs")}
            className="mt-6 bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
          >

            Browse Jobs

          </button>

        </div>

      )}


      {/* JOB LIST */}

      {jobs.length > 0 && (

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {jobs.map(job => (

            <JobCard
              key={job._id}
              job={job}
              isSaved={true}
              onSaveToggle={toggleSave}
              onOpen={()=>openJob(job)}
            />

          ))}

        </div>

      )}

    </div>

  );

}