import { useEffect, useState } from "react"
import api from "../../services/api"
import { useNavigate } from "react-router-dom"

export default function AppliedJobs() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get("/applications/my")
      .then(res => {
        setApplications(res.data.applications || [])
      })
      .catch(err => {
        console.error("❌ Failed to load applications:", err)
        setApplications([])
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="text-gray-500">
        Loading applications…
      </div>
    )
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold">
          My Applications
        </h1>
        <p className="text-gray-600">
          Track the status of your job applications
        </p>
      </div>

      {applications.length === 0 && (
        <div className="text-gray-500">
          You haven’t applied to any jobs yet.
        </div>
      )}

      <div className="space-y-4">
        {applications.map(app => (
          <div
            key={app.applicationId}
            className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
          >

            <div>
              <p className="font-semibold">
                {app.job?.title || "Job"}
              </p>

              <p className="text-sm text-gray-500">
                {app.company?.name || "Company"}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Status:{" "}
                <span className="capitalize font-medium">
                  {app.status}
                </span>
              </p>
            </div>

            {/* RIGHT */}
            <div className="text-right">
              {typeof app.atsScore === "number" && (
                <p className="text-green-700 font-bold text-lg">
                  {app.atsScore}%
                </p>
              )}

              <button
                onClick={() =>
                  navigate(`/jobseeker/applications/${app.applicationId}`)
                }
                className="mt-2 text-sm border px-3 py-1 rounded hover:bg-gray-100"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
