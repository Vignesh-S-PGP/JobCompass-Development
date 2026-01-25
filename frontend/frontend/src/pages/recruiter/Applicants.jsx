import { useEffect, useState } from "react"
import { useParams, useLocation } from "react-router-dom"
import api from "../../services/api"

export default function Applicants() {
  const { jobId } = useParams()
  const location = useLocation()
  const [apps, setApps] = useState([])

  console.log("🟥 Applicants rendered")
  console.log("🟥 URL PATH =", location.pathname)
  console.log("🟥 PARAMS =", { jobId })

  useEffect(() => {
    console.log("🟥 useEffect fired with jobId =", jobId)

    // HARD STOP for safety
    if (!jobId || jobId === "undefined") {
      console.error("❌ INVALID jobId, aborting API call")
      return
    }

    api.get(`/applications/job/${jobId}`)
      .then(res => {
        console.log("✅ applications response =", res.data)
        setApps(res.data.applications || [])
      })
      .catch(err => {
        console.error("❌ api error", err)
      })

  }, [jobId])

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Applicants</h1>

      {apps.length === 0 && (
        <p className="text-gray-500">No applicants yet</p>
      )}

      {apps.map((a, i) => (
        <div key={a.applicationId || a._id || i} className="border p-4 mb-3">
          <p><b>Name:</b> {a.user?.email}</p>
          <p><b>Resume:</b> {a.resume?.filename}</p>
          <p><b>Status:</b> {a.status}</p>

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
