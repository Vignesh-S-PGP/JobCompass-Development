import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../services/api"
import {
  Plus,
  Users,
  MapPin,
  Briefcase,
  MoreVertical,
  Circle
} from "lucide-react"

export default function RecruiterJobs() {
  const [jobs, setJobs] = useState([])
  const [filter, setFilter] = useState("all")
  const [openMenu, setOpenMenu] = useState(null)
  const navigate = useNavigate()
  const menuRefs = useRef({})

  /* ---------- FETCH JOBS ---------- */
  useEffect(() => {
    api.get("/jobs/recruiter").then(res => {
      setJobs(res.data.jobs.map(j => ({ ...j, jobId: j._id })))
    })
  }, [])

  /* ---------- OUTSIDE CLICK ---------- */
  useEffect(() => {
    const handler = e => {
      if (
        openMenu &&
        menuRefs.current[openMenu] &&
        !menuRefs.current[openMenu].contains(e.target)
      ) {
        setOpenMenu(null)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [openMenu])

  /* ---------- ACTIONS ---------- */
  const updateStatus = async (jobId, status) => {
    await api.patch(`/jobs/${jobId}/status`, { status })
    setJobs(j =>
      j.map(x => (x.jobId === jobId ? { ...x, status } : x))
    )
    setOpenMenu(null)
  }

  const deleteJob = async jobId => {
    if (!window.confirm("Delete this job permanently?")) return
    await api.delete(`/jobs/${jobId}`)
    setJobs(j => j.filter(x => x.jobId !== jobId))
  }

  const filtered = jobs.filter(j =>
    filter === "all" ? true : j.status === filter
  )

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black uppercase">My Jobs</h1>
            <p className="text-xs text-slate-400">{jobs.length} total</p>
          </div>

          <button
            onClick={() => navigate("/recruiter/jobs/create")}
            className="bg-black text-white px-5 py-3 rounded-xl text-xs font-black uppercase flex gap-2"
          >
            <Plus size={14} /> Post Job
          </button>
        </div>

        {/* FILTERS */}
        <div className="flex gap-2 mb-8">
          {["all", "active", "paused", "closed"].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-xs uppercase font-black ${
                filter === s ? "bg-black text-white" : "bg-slate-100"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* JOB CARDS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(job => (
            <div
              key={job.jobId}
              className={`border rounded-2xl p-6 relative ${
                job.status === "closed" && "opacity-75"
              }`}
            >
              {/* STATUS + MENU */}
              <div className="flex justify-between mb-4">
                <span className={`text-xs font-black uppercase flex items-center gap-1 ${
                  job.status === "active"
                    ? "text-green-600"
                    : job.status === "paused"
                    ? "text-amber-600"
                    : "text-red-600"
                }`}>
                  <Circle size={8} fill="currentColor" /> {job.status}
                </span>

                <div
                  ref={el => (menuRefs.current[job.jobId] = el)}
                  className="relative"
                >
                  <button onClick={() =>
                    setOpenMenu(openMenu === job.jobId ? null : job.jobId)
                  }>
                    <MoreVertical />
                  </button>

                  {openMenu === job.jobId && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg z-50">
                      <MenuBtn onClick={() => navigate(`/recruiter/jobs/${job.jobId}`)}>
                        View Details
                      </MenuBtn>

                      {job.status !== "closed" && (
                        <MenuBtn onClick={() => navigate(`/recruiter/jobs/${job.jobId}/edit`)}>
                          Edit Job
                        </MenuBtn>
                      )}

                      {job.status === "active" && (
                        <MenuBtn onClick={() => updateStatus(job.jobId, "paused")}>
                          Pause Job
                        </MenuBtn>
                      )}

                      {job.status === "paused" && (
                        <MenuBtn onClick={() => updateStatus(job.jobId, "active")}>
                          Activate Job
                        </MenuBtn>
                      )}

                      {job.status !== "closed" && (
                        <MenuBtn
                          onClick={() => updateStatus(job.jobId, "closed")}
                          className="text-red-600"
                        >
                          Close Job
                        </MenuBtn>
                      )}

                      <MenuBtn
                        onClick={() => deleteJob(job.jobId)}
                        className="text-red-600"
                      >
                        Delete Job
                      </MenuBtn>
                    </div>
                  )}
                </div>
              </div>

              {/* BODY */}
              <h2 className="font-black uppercase italic mb-3 line-clamp-2">
                {job.title}
              </h2>

              <div className="text-sm text-slate-400 mb-6 space-y-1">
                <div className="flex gap-2 items-center">
                  <MapPin size={12} /> {job.location}
                </div>
                <div className="flex gap-2 items-center">
                  <Briefcase size={12} /> {job.jobType}
                </div>
              </div>

              {/* FOOTER */}
              {job.status !== "closed" && (
                <button
                  onClick={() =>
                    navigate(`/recruiter/jobs/${job.jobId}/applicants`)
                  }
                  className="w-full bg-black text-white py-3 rounded-xl text-xs font-black uppercase"
                >
                  Review Applicants <Users size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------- MENU BUTTON ---------- */
function MenuBtn({ children, onClick, className = "" }) {
  return (
    <button
      onClick={e => {
        e.stopPropagation()
        onClick()
      }}
      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-100 ${className}`}
    >
      {children}
    </button>
  )
}