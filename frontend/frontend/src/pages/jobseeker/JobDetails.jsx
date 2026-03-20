import { useEffect, useState } from "react";
import api from "../../services/api";
import ATSModal from "./ATSModal";
import {
  Building2,
  MapPin,
  ChevronLeft,
  Globe,
  Briefcase,
  Sparkles
} from "lucide-react";

export default function JobDetails({ job, onBack }) {

  const [resumes,setResumes] = useState([]);
  const [resumeId,setResumeId] = useState("");
  const [atsLoading,setAtsLoading] = useState(false);
  const [atsResult,setAtsResult] = useState(null);
  const [popupMessage,setPopupMessage] = useState("");

  const company = job.company || {};

  useEffect(()=>{

    api.get("/resumes")
      .then(res=>setResumes(res.data.resumes || []));

  },[]);

  const checkAtsScore = async()=>{

    if(!resumeId){
      setPopupMessage("Please select a resume first.");
      return;
    }

    setAtsLoading(true);

    try{

      const res = await api.post("/applications/ats-check",{
        jobId:job._id,
        resumeId
      });

      setAtsResult(res.data);

    }catch{
      setPopupMessage("Unable to calculate ATS score.");
    }
    finally{
      setAtsLoading(false);
    }

  };

  const applyJob = async()=>{

    if(!resumeId){
      setPopupMessage("Please select a resume before applying.");
      return;
    }

    setAtsLoading(true);

    try{

      const res = await api.post("/applications/apply",{
        jobId:job._id,
        resumeId
      });

      setAtsResult(res.data);

    }catch(err){

      if(err.response?.status===409){
        setPopupMessage("You have already applied for this job.");
      }else{
        setPopupMessage("Something went wrong.");
      }

    }
    finally{
      setAtsLoading(false);
    }

  };

  return (

    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

      {/* BACK */}

      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
      >
        <ChevronLeft size={18}/>
        Back to jobs
      </button>

      {/* HEADER */}

      <div className="bg-white border rounded-xl p-6 flex items-start justify-between">

        <div className="flex gap-4">

          <div className="w-14 h-14 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">

            {company.logo
              ? <img src={company.logo} className="w-full h-full object-cover"/>
              : <Building2 className="text-slate-400"/>}

          </div>

          <div>

            <h1 className="text-2xl font-semibold text-slate-900">
              {job.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">

              <span className="flex items-center gap-1">
                <Building2 size={14}/>
                {company.name}
              </span>

              <span className="flex items-center gap-1">
                <MapPin size={14}/>
                {job.location}
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* CONTENT */}

      <div className="grid lg:grid-cols-12 gap-8">

        {/* LEFT */}

        <div className="lg:col-span-8 space-y-8">

          {/* DESCRIPTION */}

          <div className="bg-white border rounded-xl p-6">

            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Job Description
            </h2>

            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>

          </div>

          {/* SKILLS */}

          {job.skillsRequired?.length>0 && (

            <div className="bg-white border rounded-xl p-6">

              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Required Skills
              </h2>

              <div className="flex flex-wrap gap-2">

                {job.skillsRequired.map(skill=>(
                  <span
                    key={skill}
                    className="bg-slate-100 text-xs px-3 py-1 rounded-md"
                  >
                    {skill}
                  </span>
                ))}

              </div>

            </div>

          )}

        </div>


        {/* APPLICATION PANEL */}

        <div className="lg:col-span-4">

          <div className="bg-white border rounded-xl p-6 sticky top-6 space-y-4">

            <h3 className="font-semibold text-slate-900">
              Apply for this role
            </h3>

            <select
              value={resumeId}
              onChange={e=>setResumeId(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >

              <option value="">
                Select Resume
              </option>

              {resumes.map(r=>(
                <option key={r._id} value={r._id}>
                  {r.title}
                </option>
              ))}

            </select>

            <button
              onClick={checkAtsScore}
              disabled={atsLoading}
              className="w-full bg-indigo-50 text-indigo-600 py-2 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-indigo-100 transition"
            >

              <Sparkles size={16}/>
              Check ATS Score

            </button>

            <button
              onClick={applyJob}
              disabled={atsLoading}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm hover:bg-indigo-700 transition"
            >

              {atsLoading ? "Processing..." : "Apply Job"}

            </button>

            {/* COMPANY */}

            <div className="pt-4 border-t text-sm text-slate-500 space-y-1">

              <p className="font-medium text-slate-700">
                {company.industry}
              </p>

              {company.website && (

                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-indigo-600"
                >
                  Visit Website
                  <Globe size={14}/>
                </a>

              )}

            </div>

          </div>

        </div>

      </div>


      {/* POPUP */}

      {popupMessage && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-80 text-center space-y-4">

            <p className="text-sm text-slate-700">
              {popupMessage}
            </p>

            <button
              onClick={()=>setPopupMessage("")}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
            >
              OK
            </button>

          </div>

        </div>

      )}

      <ATSModal
        loading={atsLoading}
        data={atsResult}
        onClose={()=>setAtsResult(null)}
      />

    </div>

  );

}