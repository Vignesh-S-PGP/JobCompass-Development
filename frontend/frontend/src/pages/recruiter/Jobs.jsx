import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../services/api"

import {
  Plus,
  Users,
  MapPin,
  Briefcase,
  MoreVertical,
  Circle,
  PauseCircle,
  CheckCircle,
  XCircle
} from "lucide-react"

export default function RecruiterJobs() {

  const navigate = useNavigate()

  const [jobs,setJobs] = useState([])
  const [filter,setFilter] = useState("all")
  const [openMenu,setOpenMenu] = useState(null)

  const menuRefs = useRef({})


  /* FETCH JOBS */

  useEffect(()=>{

    api.get("/jobs/recruiter")
      .then(res=>{
        setJobs(res.data.jobs.map(j=>({...j,jobId:j._id})))
      })

  },[])


  /* CLOSE MENU ON OUTSIDE CLICK */

  useEffect(()=>{

    const handler = (e)=>{

      if(
        openMenu &&
        menuRefs.current[openMenu] &&
        !menuRefs.current[openMenu].contains(e.target)
      ){
        setOpenMenu(null)
      }

    }

    document.addEventListener("mousedown",handler)

    return ()=>document.removeEventListener("mousedown",handler)

  },[openMenu])


  /* ACTIONS */

  const updateStatus = async(jobId,status)=>{

    await api.patch(`/jobs/${jobId}/status`,{status})

    setJobs(j =>
      j.map(x => (x.jobId === jobId ? {...x,status} : x))
    )

    setOpenMenu(null)

  }

  const deleteJob = async(jobId)=>{

    if(!window.confirm("Delete this job permanently?")) return

    await api.delete(`/jobs/${jobId}`)

    setJobs(j=>j.filter(x=>x.jobId!==jobId))

  }


  /* FILTER */

  const filtered = jobs.filter(j =>
    filter === "all" ? true : j.status === filter
  )


  /* STATS */

  const stats = {
    total: jobs.length,
    active: jobs.filter(j=>j.status==="active").length,
    paused: jobs.filter(j=>j.status==="paused").length,
    closed: jobs.filter(j=>j.status==="closed").length
  }


  return (

    <div className="max-w-7xl mx-auto space-y-8">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">
            Job Listings
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage and monitor your posted jobs
          </p>

        </div>


        <button
          onClick={()=>navigate("/recruiter/jobs/create")}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl text-sm font-semibold transition"
        >
          <Plus size={16}/>
          Post Job
        </button>

      </div>


      {/* STATS */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        <StatCard
          label="Total Jobs"
          value={stats.total}
          icon={<Briefcase size={20}/>}
        />

        <StatCard
          label="Active"
          value={stats.active}
          icon={<CheckCircle size={20}/>}
          color="emerald"
        />

        <StatCard
          label="Paused"
          value={stats.paused}
          icon={<PauseCircle size={20}/>}
          color="amber"
        />

        <StatCard
          label="Closed"
          value={stats.closed}
          icon={<XCircle size={20}/>}
          color="rose"
        />

      </div>


      {/* FILTER PILLS */}

      <div className="flex gap-2">

        {["all","active","paused","closed"].map(s=>(
          <button
            key={s}
            onClick={()=>setFilter(s)}
            className={`px-4 py-2 rounded-full text-xs font-semibold capitalize transition
              ${filter===s
                ? "bg-indigo-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}
            `}
          >
            {s}
          </button>
        ))}

      </div>


      {/* JOB GRID */}

      {filtered.length === 0 ? (

        <div className="text-center py-20 border rounded-2xl bg-white">

          <p className="text-slate-400 text-sm">
            No jobs found
          </p>

        </div>

      ) : (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filtered.map(job=>(

            <div
              key={job.jobId}
              className="bg-white border border-slate-200 rounded-2xl p-6 transition hover:shadow-lg hover:-translate-y-1 duration-200 relative"
            >

              {/* STATUS + MENU */}

              <div className="flex justify-between items-center mb-4">

                <span
                  className={`text-xs font-semibold flex items-center gap-1 capitalize
                    ${job.status==="active" && "text-emerald-600"}
                    ${job.status==="paused" && "text-amber-600"}
                    ${job.status==="closed" && "text-rose-600"}
                  `}
                >
                  <Circle size={8} fill="currentColor"/>
                  {job.status}
                </span>


                <div
                  ref={el => (menuRefs.current[job.jobId] = el)}
                  className="relative"
                >

                  <button
                    onClick={()=>setOpenMenu(openMenu===job.jobId ? null : job.jobId)}
                    className="p-1 rounded hover:bg-slate-100"
                  >
                    <MoreVertical size={18}/>
                  </button>


                  {openMenu===job.jobId && (

                    <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg z-50">

                      <MenuBtn onClick={()=>navigate(`/recruiter/jobs/${job.jobId}`)}>
                        View Details
                      </MenuBtn>

                      {job.status!=="closed" && (

                        <MenuBtn onClick={()=>navigate(`/recruiter/jobs/${job.jobId}/edit`)}>
                          Edit Job
                        </MenuBtn>

                      )}

                      {job.status==="active" && (

                        <MenuBtn onClick={()=>updateStatus(job.jobId,"paused")}>
                          Pause Job
                        </MenuBtn>

                      )}

                      {job.status==="paused" && (

                        <MenuBtn onClick={()=>updateStatus(job.jobId,"active")}>
                          Activate Job
                        </MenuBtn>

                      )}

                      {job.status!=="closed" && (

                        <MenuBtn
                          onClick={()=>updateStatus(job.jobId,"closed")}
                          className="text-red-600"
                        >
                          Close Job
                        </MenuBtn>

                      )}

                      <MenuBtn
                        onClick={()=>deleteJob(job.jobId)}
                        className="text-red-600"
                      >
                        Delete Job
                      </MenuBtn>

                    </div>

                  )}

                </div>

              </div>


              {/* TITLE */}

              <h2 className="font-semibold text-lg text-slate-900 line-clamp-2 mb-4">
                {job.title}
              </h2>


              {/* DETAILS */}

              <div className="space-y-2 text-sm text-slate-500 mb-6">

                <div className="flex items-center gap-2">
                  <MapPin size={14}/>
                  {job.location}
                </div>

                <div className="flex items-center gap-2">
                  <Briefcase size={14}/>
                  {job.jobType}
                </div>

              </div>


              {/* CTA */}

              {job.status!=="closed" && (

                <button
                  onClick={()=>navigate(`/recruiter/jobs/${job.jobId}/applicants`)}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-semibold transition"
                >
                  <Users size={16}/>
                  Review Applicants
                </button>

              )}

            </div>

          ))}

        </div>

      )}

    </div>

  )

}



/* STAT CARD */

function StatCard({label,value,icon,color="indigo"}){

  return(

    <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">

      <div>

        <p className="text-xs text-slate-500">
          {label}
        </p>

        <p className="text-2xl font-semibold text-slate-900">
          {value}
        </p>

      </div>

      <div className={`p-2 rounded-lg bg-${color}-100 text-${color}-600`}>
        {icon}
      </div>

    </div>

  )

}



/* MENU BUTTON */

function MenuBtn({children,onClick,className=""}){

  return(

    <button
      onClick={e=>{
        e.stopPropagation()
        onClick()
      }}
      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-100 ${className}`}
    >
      {children}
    </button>

  )

}