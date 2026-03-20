import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import JobCard from "./JobCard";
import JobDetails from "./JobDetails";
import {
  Building2,
  MapPin,
  Globe,
  Briefcase,
  Users
} from "lucide-react";

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


  const toggleFollow = async()=>{

    const res = await api.post(`/companies/${companyId}/follow`);
    setFollowed(res.data.followed);

  };


  const toggleSave = async(jobId,e)=>{

    e.stopPropagation();

    const res = await api.post(`/applications/saved/${jobId}`);

    setSavedIds(prev =>
      res.data.saved
        ? [...prev,jobId]
        : prev.filter(id=>id!==jobId)
    );

  };


  if(selectedJob){

    return(
      <JobDetails
        job={selectedJob}
        onBack={()=>setSelectedJob(null)}
      />
    );

  }

  if(!company) return null;


  return(

    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">

      {/* COMPANY HEADER */}

      <div className="bg-white border rounded-2xl p-8 flex flex-col md:flex-row md:items-center gap-6">

        {/* LOGO */}

        <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden">

          {company.logo
            ? <img src={company.logo} className="w-full h-full object-cover"/>
            : <Building2 className="text-slate-400"/>}

        </div>

        {/* COMPANY INFO */}

        <div className="flex-1">

          <h1 className="text-2xl font-semibold text-slate-900">
            {company.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mt-2">

            <span className="flex items-center gap-1">
              <Briefcase size={14}/>
              {company.industry}
            </span>

            <span className="flex items-center gap-1">
              <MapPin size={14}/>
              {company.location}
            </span>

          </div>

          {company.website && (

            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-indigo-600 text-sm mt-2"
            >
              <Globe size={14}/>
              {company.website}
            </a>

          )}

        </div>

        {/* FOLLOW BUTTON */}

        <button
          onClick={toggleFollow}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition
            ${followed
              ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
              : "bg-indigo-600 text-white hover:bg-indigo-700"}
          `}
        >
          {followed ? "Following" : "Follow"}
        </button>

      </div>


      {/* ABOUT */}

      {company.about && (

        <div className="bg-white border rounded-2xl p-6">

          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            About the Company
          </h2>

          <p className="text-slate-600 leading-relaxed">
            {company.about}
          </p>

        </div>

      )}


      {/* JOBS */}

      <div className="space-y-6">

        <div className="flex items-center justify-between">

          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">

            <Briefcase size={18}/>
            Open Positions

          </h2>

          <span className="text-sm text-slate-400">
            {jobs.length} jobs available
          </span>

        </div>

        {jobs.length===0 ? (

          <div className="bg-white border rounded-xl p-16 text-center text-slate-400">

            No open positions currently.

          </div>

        ) : (

          <div className="grid md:grid-cols-2 gap-6">

            {jobs.map(job=>(

              <JobCard
                key={job._id}
                job={job}
                isSaved={savedIds.includes(job._id)}
                onSaveToggle={toggleSave}
                onOpen={()=>setSelectedJob(job)}
              />

            ))}

          </div>

        )}

      </div>

    </div>

  );

}