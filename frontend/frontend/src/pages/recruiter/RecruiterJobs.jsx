import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../services/api"

export default function RecruiterJobs() {
  const [jobs, setJobs] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    api.get("/jobs/recruiter")
      .then(res => {
        // ✅ backend already returns string _id
        setJobs(res.data.jobs)
      })
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Jobs</h1>

      {jobs.length === 0 && <p>No jobs posted yet</p>}

      {jobs.map(job => (
        <div
          key={job._id}
          className="border p-4 mb-3 rounded shadow"
        >
          <h2 className="font-semibold text-lg">{job.title}</h2>
          <p>{job.location}</p>

          <button
            className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
            onClick={() => {
              console.log("➡️ navigating with jobId =", job._id)
              navigate(`/recruiter/jobs/${job._id}/applicants`)
            }}
          >
            View Applicants
          </button>
        </div>
      ))}
    </div>
  )
}
