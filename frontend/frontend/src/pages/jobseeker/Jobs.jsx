import { useEffect, useState } from "react"
import api from "../../services/api"

export default function Jobs() {
  const [recommended, setRecommended] = useState([])
  const [allJobs, setAllJobs] = useState([])
  const [resumes, setResumes] = useState([])
  const [selectedResume, setSelectedResume] = useState({})

  useEffect(() => {
    api.get("/job-feed").then(res => {
      setRecommended(res.data.recommended || [])
      setAllJobs(res.data.all || [])
    })

    api.get("/resumes").then(res => setResumes(res.data.resumes))
  }, [])

  const applyJob = async (jobId) => {
    const resumeId = selectedResume[jobId]
    if (!resumeId) {
      alert("Select resume first")
      return
    }

    await api.post("/applications/apply", { jobId, resumeId })
    alert("Applied successfully")
  }

  const renderJob = (job) => (
    <div key={job._id} className="bg-white p-4 mb-4 shadow rounded">
      <h2 className="font-bold">{job.title}</h2>
      <p>{job.description}</p>

      <select
        className="border p-2 mt-2 w-full"
        value={selectedResume[job._id] || ""}
        onChange={(e) =>
          setSelectedResume({
            ...selectedResume,
            [job._id]: e.target.value
          })
        }
      >
        <option value="">Select Resume</option>
        {resumes.map(r => (
          <option key={r._id} value={r._id}>
            {r.filename}
          </option>
        ))}
      </select>

      <button
        onClick={() => applyJob(job._id)}
        className="bg-black text-white px-4 py-2 mt-2 rounded w-full"
      >
        Apply
      </button>
    </div>
  )

  return (
    <div>
      {/* 🔹 Recommended */}
      <h1 className="text-xl font-bold mb-4">Recommended Jobs</h1>
      {recommended.length === 0 && (
        <p className="text-gray-500">
          No recommendations yet. Complete your profile to get better matches.
        </p>
      )}
      {recommended.map(renderJob)}

      {/* 🔹 All Jobs */}
      <h1 className="text-xl font-bold mt-8 mb-4">All Jobs</h1>
      {allJobs.length === 0 && (
        <p className="text-gray-500">No jobs available.</p>
      )}
      {allJobs.map(renderJob)}
    </div>
  )
}
