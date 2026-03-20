import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Building2,
  Calendar,
  Globe
} from "lucide-react";
import api from "../../services/api";
import ATSBreakdown from "../../components/applications/ATSBreakdown";
import ResumePreview from "../../components/applications/ResumePreview";

export default function ApplicationDetail() {

  const { id } = useParams();
  const navigate = useNavigate();
  const [app,setApp] = useState(null);

  useEffect(()=>{
    api.get(`/applications/${id}`)
      .then(res=>setApp(res.data.application));
  },[id]);

  if(!app){
    return(
      <div className="flex items-center justify-center h-64 text-sm text-slate-400">
        Loading application data...
      </div>
    );
  }

  const statusStyle = {
    shortlisted:"bg-emerald-100 text-emerald-700",
    rejected:"bg-rose-100 text-rose-600",
    applied:"bg-indigo-100 text-indigo-600",
    pending:"bg-amber-100 text-amber-600"
  };

  return(

    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

      {/* BACK */}

      <button
        onClick={()=>navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft size={18}/>
        Back
      </button>


      {/* HEADER */}

      <div className="bg-white border rounded-xl p-6 flex items-start justify-between">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">

            {app.company?.logo
              ? <img src={app.company.logo} className="w-full h-full object-contain"/>
              : <Building2 className="text-slate-400"/>}

          </div>

          <div>

            <h1 className="text-xl font-semibold text-slate-900">
              {app.job?.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">

              <span className="flex items-center gap-1">
                <Building2 size={14}/>
                {app.company?.name}
              </span>

              <span className="flex items-center gap-1">
                <MapPin size={14}/>
                {app.job?.location}
              </span>

            </div>

          </div>

        </div>

        <span className={`px-3 py-1 rounded-md text-xs font-medium ${statusStyle[app.status]}`}>
          {app.status}
        </span>

      </div>


      {/* CONTENT GRID */}

      <div className="grid lg:grid-cols-3 gap-8">

        {/* LEFT */}

        <div className="lg:col-span-2 space-y-6">

          {/* JOB DESCRIPTION */}

          <div className="bg-white border rounded-xl p-6">

            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Job Description
            </h2>

            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {app.job?.description}
            </p>

          </div>


          {/* ATS REPORT */}

          <ATSBreakdown ats={app.ats} score={app.atsScore} />

        </div>


        {/* RIGHT */}

        <div className="space-y-6">

          {/* COMPANY */}

          <div className="bg-white border rounded-xl p-6">

            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Company Overview
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              {app.company?.about || "No company description available."}
            </p>

            {app.company?.website && (

              <a
                href={app.company.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-indigo-600 text-sm"
              >
                <Globe size={14}/>
                Visit Website
              </a>

            )}

          </div>


          {/* RESUME */}

          <ResumePreview resume={app.resume} />


          {/* META */}

          <div className="bg-white border rounded-xl p-6 space-y-4">

            <h3 className="text-sm font-semibold text-slate-900">
              Application Details
            </h3>

            <div className="flex justify-between text-sm">

              <span className="text-slate-400">
                Job Type
              </span>

              <span className="flex items-center gap-1 text-slate-700">
                <Briefcase size={14}/>
                {app.job?.jobType}
              </span>

            </div>

            <div className="flex justify-between text-sm">

              <span className="text-slate-400">
                Applied On
              </span>

              <span className="flex items-center gap-1 text-slate-700">
                <Calendar size={14}/>
                {app.appliedAt
                  ? new Date(app.appliedAt).toLocaleDateString("en-GB",{
                      day:"2-digit",
                      month:"short",
                      year:"numeric"
                    })
                  : "—"}
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}