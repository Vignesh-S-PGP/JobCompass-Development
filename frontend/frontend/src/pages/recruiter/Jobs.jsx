import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../services/api"
import { 
  Plus, 
  Users, 
  MapPin, 
  Briefcase, 
  ChevronRight,
  MoreVertical,
  Circle
} from "lucide-react"

export default function RecruiterJobs() {
  const [jobs, setJobs] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    api.get("/jobs/recruiter")
      .then(res => {
        const fixed = res.data.jobs.map(j => ({
          ...j,
          jobId: j._id?.$oid || j._id
        }))
        setJobs(fixed)
      })
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="min-h-screen bg-white py-8 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* TOP ACTION BAR */}
        <div className="flex items-center justify-between mb-12 border-b border-slate-100 pb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">My Jobs</h1>
            <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">
              {jobs.length} Active Postings
            </p>
          </div>
          
          <button
            onClick={() => navigate("/recruiter/jobs/create")}
            className="bg-black text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95"
          >
            <Plus size={16} /> Post New Job
          </button>
        </div>

        {/* EMPTY STATE */}
        {jobs.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl">
            <p className="text-slate-400 font-medium">No job listings found.</p>
          </div>
        ) : (
          /* JOB GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => (
              <div
                key={job.jobId}
                className="group border border-slate-200 rounded-2xl p-6 hover:border-black transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-600">
                      <Circle size={8} fill="currentColor" className="animate-pulse" />
                      Active
                    </span>
                    <button className="text-slate-300 hover:text-slate-900 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>

                  <h2 className="text-lg font-black text-slate-900 leading-snug mb-4 h-12 line-clamp-2 uppercase italic tracking-tighter">
                    {job.title}
                  </h2>
                  
                  <div className="space-y-2 mb-8">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <MapPin size={12} className="text-slate-300" /> {job.location}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <Briefcase size={12} className="text-slate-300" /> {job.jobType}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-end justify-between border-t border-slate-50 pt-4">
                    <div>
                       <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Compensation</p>
                       <p className="font-black text-slate-900 text-sm">₹{job.salaryRange || 'TBD'}</p>
                    </div>
                    <p className="text-[9px] font-bold text-slate-300 italic">
                      {new Date(job.createdAt).toLocaleDateString('en-GB')}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/recruiter/jobs/${job.jobId}/applicants`)}
                    className="w-full bg-slate-900 text-white py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group-hover:bg-black"
                  >
                    Review Applicants <Users size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}