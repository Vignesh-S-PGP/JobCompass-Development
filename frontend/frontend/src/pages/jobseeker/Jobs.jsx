import { useEffect, useState } from "react"
import api from "../../services/api"
import JobCard from "../../components/JobCard"
import JobDetails from "./JobDetails"

export default function Jobs() {
  const [recommended, setRecommended] = useState([])
  const [allJobs, setAllJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)

  useEffect(() => {
    api.get("/job-feed").then(res => {
      setRecommended(res.data.recommended || [])
      setAllJobs(res.data.all || [])
    })
  }, [])

  if (selectedJob) {
    return (
      <JobDetails
        job={selectedJob}
        onBack={() => setSelectedJob(null)}
      />
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Jobs for You</h1>
      <div className="grid gap-4">
        {recommended.map(job => (
          <JobCard
            key={job._id}
            job={job}
            onClick={() => setSelectedJob(job)}
          />
        ))}
      </div>

      <h1 className="text-2xl font-bold mt-10 mb-4">All Jobs</h1>
      <div className="grid gap-4">
        {allJobs.map(job => (
          <JobCard
            key={job._id}
            job={job}
            onClick={() => setSelectedJob(job)}
          />
        ))}
      </div>
    </div>
  )
}
