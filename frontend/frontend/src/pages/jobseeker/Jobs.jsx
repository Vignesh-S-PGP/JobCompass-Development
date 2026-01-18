import { useEffect, useState } from "react"
import api from "../../services/api"

export default function Jobs() {
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    api.get("/job-feed").then(res => {
      setJobs(res.data.jobs)
    })
  }, [])

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Recommended Jobs</h1>

      {jobs.length === 0 && (
        <p>No matching jobs found</p>
      )}

      {jobs.map(job => (
        <div key={job._id} className="border p-4 mb-3 rounded">
          <h2 className="font-semibold">{job.title}</h2>
          <p>{job.description}</p>
          <p className="text-sm text-gray-600">
            {job.location} | {job.jobType}
          </p>
        </div>
      ))}
    </div>
  )
}
