import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../../services/api"
import { ArrowLeft, Edit, PauseCircle, PlayCircle, XCircle } from "lucide-react"

export default function RecruiterJobDetails() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/jobs/${jobId}`)
      .then(res => setJob(res.data.job))
      .finally(() => setLoading(false))
  }, [jobId])

  const updateStatus = async (status) => {
    await api.patch(`/jobs/${jobId}/status`, { status })
    setJob(j => ({ ...j, status }))
  }

  if (loading) return <div className="p-10">Loading…</div>
  if (!job) return <div className="p-10">Job not found</div>

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <button
          onClick={() => navigate("/recruiter/jobs")}
          className="flex items-center gap-2 text-sm font-bold"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <span className={`text-xs font-black uppercase px-3 py-1 rounded-full ${
          job.status === "active" ? "bg-green-100 text-green-700" :
          job.status === "paused" ? "bg-amber-100 text-amber-700" :
          "bg-red-100 text-red-700"
        }`}>
          {job.status}
        </span>
      </div>

      {/* TITLE */}
      <h1 className="text-3xl font-black uppercase">{job.title}</h1>

      {/* META */}
      <div className="text-sm text-slate-500 space-y-1">
        <p>📍 {job.location}</p>
        <p>💼 {job.jobType}</p>
        <p>💰 ₹{job.salaryRange || "TBD"}</p>
      </div>

      {/* DESCRIPTION */}
      <div className="prose max-w-none">
        <pre className="whitespace-pre-wrap font-sans">
          {job.description}
        </pre>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3 pt-6 border-t">

        <button
          onClick={() => navigate(`/recruiter/jobs/${jobId}/edit`)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-xs font-black uppercase"
        >
          <Edit size={14} /> Edit Job
        </button>

        {job.status === "active" && (
          <button
            onClick={() => updateStatus("paused")}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-black uppercase"
          >
            <PauseCircle size={14} /> Pause
          </button>
        )}

        {job.status === "paused" && (
          <button
            onClick={() => updateStatus("active")}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-black uppercase"
          >
            <PlayCircle size={14} /> Activate
          </button>
        )}

        {job.status !== "closed" && (
          <button
            onClick={() => updateStatus("closed")}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-black uppercase"
          >
            <XCircle size={14} /> Close Job
          </button>
        )}
      </div>
    </div>
  )
}