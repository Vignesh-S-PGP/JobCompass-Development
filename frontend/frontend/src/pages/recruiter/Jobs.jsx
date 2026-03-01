import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../services/api"
import {
  Plus,
  Users,
  MapPin,
  Briefcase,
  MoreHorizontal,
  Circle,
  Search,
  Filter,
  ArrowUpRight,
  Trash2,
  PauseCircle,
  PlayCircle,
  XCircle,
  Edit3,
  ExternalLink
} from "lucide-react"
import { ListSkeleton } from "../../components/ui/Skeleton"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Badge from "../../components/ui/Badge"
import Input from "../../components/ui/Input"
import EmptyState from "../../components/ui/EmptyState"

export default function RecruiterJobs() {
  const [jobs, setJobs] = useState([])
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [openMenu, setOpenMenu] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const menuRefs = useRef({})

  /* ---------- FETCH JOBS ---------- */
  useEffect(() => {
    api.get("/jobs/recruiter").then(res => {
      setJobs(res.data.jobs.map(j => ({ ...j, jobId: j._id })))
    }).finally(() => setLoading(false))
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
    try {
      await api.patch(`/jobs/${jobId}/status`, { status })
      setJobs(j =>
        j.map(x => (x.jobId === jobId ? { ...x, status } : x))
      )
      setOpenMenu(null)
    } catch (err) {
      console.error("Failed to update status", err)
    }
  }

  const deleteJob = async jobId => {
    if (!window.confirm("Delete this job permanently? This action cannot be undone.")) return
    try {
      await api.delete(`/jobs/${jobId}`)
      setJobs(j => j.filter(x => x.jobId !== jobId))
      setOpenMenu(null)
    } catch (err) {
      console.error("Failed to delete job", err)
    }
  }

  const filteredJobs = jobs.filter(j => {
    const matchesFilter = filter === "all" ? true : j.status === filter
    const matchesSearch = j.title.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  if (loading) return <ListSkeleton />;

  /* ---------- UI ---------- */
  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 pb-10 border-b border-slate-100">
         <div>
            <Badge variant="primary" className="mb-4">Global Repository</Badge>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              Mandate <span className="text-primary-600">Registry</span>.
            </h1>
            <p className="text-slate-500 font-medium text-lg mt-4 max-w-xl">
              Manage your active and historical job listings within the platform ecosystem.
            </p>
         </div>

         <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:max-w-xl">
            <div className="flex-1 w-full">
               <Input
                 icon={Search}
                 placeholder="Search mandates..."
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="py-4 shadow-xl shadow-slate-200/50"
               />
            </div>
            <Button
              onClick={() => navigate("/recruiter/jobs/create")}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
              icon={Plus}
            >
              Post Mandate
            </Button>
         </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3">
        {["all", "open", "paused", "closed"].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-6 py-3 rounded-2xl text-[10px] uppercase font-black tracking-widest transition-all ${
              filter === s
                ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20 scale-105"
                : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50"
            }`}
          >
            {s} Mandates
          </button>
        ))}
      </div>

      {/* JOB CARDS */}
      {filteredJobs.length === 0 ? (
        <EmptyState
          title="No mandates indexed"
          description="We couldn't find any job listings matching your current registry filter."
          actionLabel="Post New Job"
          onAction={() => navigate("/recruiter/jobs/create")}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredJobs.map(job => (
            <Card
              key={job.jobId}
              hover
              className={`p-8 group flex flex-col relative ${job.status === "closed" ? "opacity-75 grayscale-[0.5]" : ""}`}
            >
              {/* STATUS + MENU */}
              <div className="flex justify-between items-start mb-8">
                <Badge variant={job.status === "open" ? "success" : job.status === "paused" ? "warning" : "danger"} className="px-3 py-1 text-[8px] border-none">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    {job.status}
                  </div>
                </Badge>

                <div
                  ref={el => (menuRefs.current[job.jobId] = el)}
                  className="relative"
                >
                  <button
                    onClick={() => setOpenMenu(openMenu === job.jobId ? null : job.jobId)}
                    className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
                  >
                    <MoreHorizontal size={20} />
                  </button>

                  {openMenu === job.jobId && (
                    <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 p-2 animate-in scale-in origin-top-right">
                      <MenuBtn onClick={() => navigate(`/recruiter/jobs/${job.jobId}`)} icon={ExternalLink}>
                        View Pipeline
                      </MenuBtn>

                      {job.status !== "closed" && (
                        <MenuBtn onClick={() => navigate(`/recruiter/jobs/${job.jobId}/edit`)} icon={Edit3}>
                          Edit Mandate
                        </MenuBtn>
                      )}

                      {job.status === "open" && (
                        <MenuBtn onClick={() => updateStatus(job.jobId, "paused")} icon={PauseCircle}>
                          Pause mandate
                        </MenuBtn>
                      )}

                      {job.status === "paused" && (
                        <MenuBtn onClick={() => updateStatus(job.jobId, "open")} icon={PlayCircle}>
                          Activate mandate
                        </MenuBtn>
                      )}

                      {job.status !== "closed" && (
                        <MenuBtn
                          onClick={() => updateStatus(job.jobId, "closed")}
                          className="text-rose-600 hover:bg-rose-50"
                          icon={XCircle}
                        >
                          Close Mandate
                        </MenuBtn>
                      )}

                      <div className="h-px bg-slate-50 my-2 mx-2" />

                      <MenuBtn
                        onClick={() => deleteJob(job.jobId)}
                        className="text-rose-600 hover:bg-rose-50"
                        icon={Trash2}
                      >
                        Purge Record
                      </MenuBtn>
                    </div>
                  )}
                </div>
              </div>

              {/* BODY */}
              <div className="flex-1 space-y-4 mb-10">
                 <h2 className="text-xl font-black text-slate-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight leading-tight line-clamp-2">
                   {job.title}
                 </h2>

                 <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                       <MapPin size={14} className="text-primary-600" /> {job.location}
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                       <Briefcase size={14} className="text-primary-600" /> {job.jobType}
                    </div>
                 </div>
              </div>

              {/* FOOTER */}
              <div className="flex items-center gap-4 border-t border-slate-50 pt-8 mt-auto">
                 <div className="flex-1 flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Total Talent</span>
                    <span className="text-lg font-black text-slate-900">{(job.applicants || []).length} professionals</span>
                 </div>
                 <Button
                    onClick={() => navigate(`/recruiter/jobs/${job.jobId}/applicants`)}
                    className="px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-primary-600/10"
                    icon={Users}
                 >
                    Review
                 </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

/* ---------- MENU BUTTON ---------- */
function MenuBtn({ children, onClick, className = "", icon: Icon }) {
  return (
    <button
      onClick={e => {
        e.stopPropagation()
        onClick()
      }}
      className={`w-full flex items-center justify-between px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all hover:bg-slate-50 ${className}`}
    >
      {children}
      {Icon && <Icon size={14} />}
    </button>
  )
}
