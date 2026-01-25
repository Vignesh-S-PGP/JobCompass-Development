import { useEffect, useState } from "react"
import api from "../../services/api"

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [resumes, setResumes] = useState([])
  const [selectedResume, setSelectedResume] = useState({})

  useEffect(() => {
    api.get("/jobs/recommended").then(res => setJobs(res.data.jobs))
    api.get("/resumes").then(res => setResumes(res.data.resumes))
  }, [])

  const applyJob = async (jobId) => {
    const resumeId = selectedResume[jobId]
    if (!resumeId) {
      alert("Select resume first")
      return
    }

    await api.post("/applications/apply", {
      jobId,
      resumeId
    })

    alert("Applied successfully")
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Recommended Jobs</h1>

      {jobs.map(job => (
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
      ))}
    </div>
  )
}
