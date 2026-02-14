import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../services/api"

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
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Job Openings</h1>

        <button
          onClick={() => navigate("/recruiter/jobs/create")}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          + Post New Job
        </button>
      </div>

      {/* Empty State */}
      {jobs.length === 0 && (
        <div className="bg-white rounded-lg shadow p-10 text-center">
          <p className="text-gray-600 text-lg mb-4">
            You haven’t posted any jobs yet.
          </p>
          <button
            onClick={() => navigate("/recruiter/jobs/create")}
            className="bg-blue-600 text-white px-5 py-2 rounded"
          >
            Create Your First Job
          </button>
        </div>
      )}

      {/* Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map(job => (
          <div
            key={job.jobId}
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-5 border"
          >
            {/* Title */}
            <h2 className="text-lg font-semibold mb-1">
              {job.title}
            </h2>

            {/* Location */}
            <p className="text-sm text-gray-500 mb-3">
              📍 {job.location}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap gap-2 text-sm mb-4">
              {job.jobType && (
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {job.jobType}
                </span>
              )}

              {job.experience && (
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {job.experience} yrs
                </span>
              )}

              {job.salaryRange && (
                <span className="px-2 py-1 bg-gray-100 rounded">
                  ₹ {job.salaryRange}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center">
              <button
                onClick={() =>
                  navigate(`/recruiter/jobs/${job.jobId}/applicants`)
                }
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                View Applicants
              </button>

              <span className="text-xs text-green-600 font-semibold">
                ● Active
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
