import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../../services/api"

export default function Applicants() {
  const { jobId } = useParams()
  const [apps, setApps] = useState([])

  useEffect(() => {
    if (!jobId) return

    api.get(`/applications/job/${jobId}`)
      .then(res => setApps(res.data.applications || []))
      .catch(err => console.error(err))
  }, [jobId])

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Applicants (Ranked by AI)</h1>

      {apps.length === 0 && <p>No applicants yet</p>}

      {apps.map(a => (
        <div
          key={a.applicationId}
          className="border p-4 mb-3 rounded shadow"
        >
          <p><b>Email:</b> {a.user?.email}</p>
          <p><b>Resume:</b> {a.resume?.filename}</p>

          <p className="text-green-700 font-bold">
            ATS Score: {a.atsScore}%
          </p>

          <p className="text-sm text-gray-600">
            {a.ats?.summary}
          </p>

          <div className="mt-2">
            <button className="bg-green-600 text-white px-3 py-1 rounded">
              Shortlist
            </button>

            <button className="bg-red-600 text-white px-3 py-1 ml-2 rounded">
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
