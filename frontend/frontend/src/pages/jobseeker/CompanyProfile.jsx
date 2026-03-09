import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import JobCard from "./JobCard";
import JobDetails from "./JobDetails";

export default function CompanyProfile() {

  const { companyId } = useParams();

  const [company,setCompany] = useState(null);
  const [jobs,setJobs] = useState([]);
  const [followed,setFollowed] = useState(false);
  const [savedIds,setSavedIds] = useState([]);
  const [selectedJob,setSelectedJob] = useState(null);

  useEffect(()=>{

    Promise.all([
      api.get(`/companies/${companyId}`),
      api.get("/companies/followed/ids"),
      api.get("/applications/saved/ids")
    ]).then(([companyRes,followRes,savedRes])=>{

      setCompany(companyRes.data.company);
      setJobs(companyRes.data.jobs || []);

      setFollowed(
        followRes.data.ids.includes(companyId)
      );

      setSavedIds(savedRes.data.ids || []);
    });

  },[companyId]);


  const toggleFollow = async ()=>{

    const res = await api.post(`/companies/${companyId}/follow`);

    setFollowed(res.data.followed);
  };


  const toggleSave = async(jobId,e)=>{
    e.stopPropagation();

    const res = await api.post(`/applications/saved/${jobId}`);

    setSavedIds(prev =>
      res.data.saved
        ? [...prev,jobId]
        : prev.filter(id => id !== jobId)
    );
  };


  if(selectedJob){
    return (
      <JobDetails
        job={selectedJob}
        onBack={()=>setSelectedJob(null)}
      />
    );
  }

  if(!company) return null;

  return (
    <div className="max-w-7xl mx-auto pt-10 pb-20">

      {/* COMPANY HEADER */}

      <div className="bg-white rounded-[32px] border p-10 mb-10">

        <div className="flex items-center gap-6">

          <img
            src={company.logo}
            className="h-20 rounded-xl"
          />

          <div className="flex-1">

            <h1 className="text-4xl font-black text-slate-900">
              {company.name}
            </h1>

            <p className="text-slate-500 mt-1">
              {company.industry} • {company.location}
            </p>

            <a
              href={company.website}
              target="_blank"
              className="text-indigo-600 text-sm font-bold"
            >
              {company.website}
            </a>

          </div>

          <button
            onClick={toggleFollow}
            className={`px-6 py-3 rounded-xl font-black
              ${followed
                ? "bg-slate-200 text-slate-700"
                : "bg-indigo-600 text-white"
              }`}
          >
            {followed ? "Following" : "Follow"}
          </button>

        </div>

        <p className="mt-6 text-slate-600 leading-relaxed">
          {company.about}
        </p>

      </div>


      {/* JOB LIST */}

      <h2 className="text-xl font-black mb-6">
        Jobs at {company.name}
      </h2>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-[32px] border p-20 text-center text-slate-400 font-bold">
          No jobs posted
        </div>
      ) : (

        jobs.map(job => (

          <JobCard
            key={job._id}
            job={job}
            isSaved={savedIds.includes(job._id)}
            onSaveToggle={toggleSave}
            onOpen={()=>setSelectedJob(job)}
          />

        ))

      )}

    </div>
  );
}