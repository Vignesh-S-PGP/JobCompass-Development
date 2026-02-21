import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../../services/api"

/* =========================
   📄 Resume + ATS Modal
========================= */
function ResumeReviewModal({ app, onClose }) {
  const [pdfUrl, setPdfUrl] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!app) return

    const resumeId =
      app.resume?._id?.$oid || app.resume?._id

    if (!resumeId) {
      setError("Resume ID missing")
      return
    }

    let objectUrl = null

    api.get(`/resumes/view/${resumeId}`, {
      responseType: "blob",
      timeout: 20000   // ⏱️ 20 seconds max
    })
      .then(res => {
        const blob = new Blob([res.data], {
          type: "application/pdf"
        })
        objectUrl = URL.createObjectURL(blob)
        setPdfUrl(objectUrl)
      })
      .catch(err => {
        console.error("❌ Resume load failed:", err)
        setError("Unable to load resume PDF")
      })

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
      setPdfUrl(null)
      setError(null)
    }
  }, [app])

  if (!app) return null

  const ats = app.ats || {}
  const matched = ats.matched_skills || []
  const missing = ats.missing_skills || []

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex">

      {/* LEFT — PDF VIEWER */}
      <div className="w-3/5 bg-gray-100 p-4">
        {error ? (
          <div className="h-full flex items-center justify-center text-red-600">
            {error}
          </div>
        ) : pdfUrl ? (
          <iframe
            src={pdfUrl}
            className="w-full h-full rounded"
            title="Resume"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Loading resume…
          </div>
        )}
      </div>

      {/* RIGHT — ATS DETAILS */}
      <div className="w-2/5 bg-white p-6 overflow-y-auto">
        <h2 className="text-xl font-bold mb-2">
          ATS Evaluation
        </h2>

        <div className="text-4xl font-bold text-green-700 mb-4">
          {app.atsScore}%
        </div>

        <section className="mb-4">
          <h3 className="font-semibold mb-1">Matched Skills</h3>
          {matched.length === 0 ? (
            <p className="text-sm text-gray-500">None</p>
          ) : (
            <ul className="list-disc list-inside text-green-700 text-sm">
              {matched.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          )}
        </section>

        <section className="mb-4">
          <h3 className="font-semibold mb-1">Missing Skills</h3>
          {missing.length === 0 ? (
            <p className="text-sm text-gray-500">No major gaps</p>
          ) : (
            <ul className="list-disc list-inside text-red-600 text-sm">
              {missing.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          )}
        </section>

        <p className="text-sm text-gray-600 mb-6">
          {ats.reason}
        </p>

        <div className="flex gap-2">
          <button className="flex-1 bg-green-600 text-white py-2 rounded">
            Shortlist
          </button>
          <button className="flex-1 bg-red-600 text-white py-2 rounded">
            Reject
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full border py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  )
}

/* =========================
   👥 Applicants Page
========================= */
export default function Applicants() {
  const { jobId } = useParams()
  const [apps, setApps] = useState([])
  const [selectedApp, setSelectedApp] = useState(null)

  useEffect(() => {
    if (!jobId) return

    api.get(`/applications/job/${jobId}`)
      .then(res => setApps(res.data.applications || []))
      .catch(err => console.error(err))
  }, [jobId])

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Applicants
      </h1>

      {apps.length === 0 && (
        <p className="text-gray-500">No applicants yet</p>
      )}

      <div className="space-y-4">
        {apps.map((a, index) => {
          const name =
            a.user?.fullName ||
            a.user?.email?.split("@")[0] ||
            "Candidate"

          return (
            <div
              key={a.applicationId}
              className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="text-lg font-bold text-gray-500">
                  #{index + 1}
                </div>

                <div>
                  <p className="font-semibold">{name}</p>
                  <p className="text-sm text-gray-500">
                    AI Score
                  </p>
                </div>
              </div>

              <div className="text-2xl font-bold text-green-700">
                {a.atsScore}%
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedApp(a)}
                  className="border px-3 py-1 rounded hover:bg-gray-100"
                >
                  Review
                </button>

                {/* <button className="bg-green-600 text-white px-3 py-1 rounded">
                  Shortlist
                </button>

                <button className="bg-red-600 text-white px-3 py-1 rounded">
                  Reject
                </button> */}
              </div>
            </div>
          )
        })}
      </div>

      <ResumeReviewModal
        app={selectedApp}
        onClose={() => setSelectedApp(null)}
      />
    </div>
  )
}
