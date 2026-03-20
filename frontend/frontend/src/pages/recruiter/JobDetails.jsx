import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../../services/api"

import {
  ArrowLeft,
  Edit,
  PauseCircle,
  PlayCircle,
  XCircle,
  MapPin,
  Briefcase,
  CircleDollarSign,
  Activity
} from "lucide-react"

export default function RecruiterJobDetails() {

  const { jobId } = useParams()
  const navigate = useNavigate()

  const [job,setJob] = useState(null)
  const [loading,setLoading] = useState(true)

  useEffect(()=>{

    api.get(`/jobs/${jobId}`)
      .then(res=>setJob(res.data.job))
      .finally(()=>setLoading(false))

  },[jobId])


  const updateStatus = async(status)=>{

    await api.patch(`/jobs/${jobId}/status`,{status})

    setJob(j=>({...j,status}))

  }



  if(loading){
    return (
      <div className="flex items-center justify-center h-60">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"/>
      </div>
    )
  }

  if(!job) return <div className="p-10">Job not found</div>



  const statusStyle = {
    active:"bg-emerald-100 text-emerald-700",
    paused:"bg-amber-100 text-amber-700",
    closed:"bg-rose-100 text-rose-700"
  }



  return(

    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">

      {/* BACK */}

      <button
        onClick={()=>navigate("/recruiter/jobs")}
        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900"
      >
        <ArrowLeft size={16}/>
        Back to Jobs
      </button>



      {/* HEADER CARD */}

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">

          <div>

            <h1 className="text-3xl font-black text-slate-900 mb-1">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 font-medium">

              <span className="flex items-center gap-1">
                <MapPin size={14}/>
                {job.location}
              </span>

              <span className="flex items-center gap-1">
                <Briefcase size={14}/>
                {job.jobType}
              </span>

              <span className="flex items-center gap-1">
                <CircleDollarSign size={14}/>
                ₹{job.salaryRange || "TBD"}
              </span>

            </div>

          </div>


          {/* STATUS */}

          <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase ${statusStyle[job.status]}`}>
            {job.status}
          </span>

        </div>


        {/* ACTIONS */}

        <div className="flex flex-wrap gap-3 mt-8">

          <button
            onClick={()=>navigate(`/recruiter/jobs/${jobId}/edit`)}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition"
          >
            <Edit size={14}/>
            Edit Job
          </button>


          {job.status==="active" && (
            <button
              onClick={()=>updateStatus("paused")}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition"
            >
              <PauseCircle size={14}/>
              Pause
            </button>
          )}


          {job.status==="paused" && (
            <button
              onClick={()=>updateStatus("active")}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
            >
              <PlayCircle size={14}/>
              Activate
            </button>
          )}


          {job.status!=="closed" && (
            <button
              onClick={()=>updateStatus("closed")}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition"
            >
              <XCircle size={14}/>
              Close Job
            </button>
          )}

        </div>

      </div>



      {/* CONTENT GRID */}

      <div className="grid lg:grid-cols-12 gap-8">

        {/* DESCRIPTION */}

        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">

          <div className="flex items-center gap-2 mb-6">
            <Activity className="text-indigo-600"/>
            <h3 className="text-xs font-black uppercase tracking-widest">
              Job Description
            </h3>
          </div>

          <p className="text-slate-600 whitespace-pre-line leading-relaxed">
            {job.description}
          </p>

        </div>



        {/* JOB OVERVIEW */}

        <div className="lg:col-span-4 space-y-6">

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">

            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">
              Job Overview
            </h3>


            <div className="space-y-4 text-sm">

              <div className="flex justify-between">
                <span className="text-slate-400 font-bold uppercase text-xs">
                  Status
                </span>

                <span className={`px-2 py-1 rounded text-xs font-bold ${statusStyle[job.status]}`}>
                  {job.status}
                </span>
              </div>


              <div className="flex justify-between">
                <span className="text-slate-400 font-bold uppercase text-xs">
                  Location
                </span>

                <span className="font-semibold text-slate-900">
                  {job.location}
                </span>
              </div>


              <div className="flex justify-between">
                <span className="text-slate-400 font-bold uppercase text-xs">
                  Job Type
                </span>

                <span className="font-semibold text-slate-900">
                  {job.jobType}
                </span>
              </div>


              <div className="flex justify-between">
                <span className="text-slate-400 font-bold uppercase text-xs">
                  Salary
                </span>

                <span className="font-semibold text-slate-900">
                  ₹{job.salaryRange || "TBD"}
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  )

}