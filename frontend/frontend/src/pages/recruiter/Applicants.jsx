import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../../services/api"

/* =========================
   📄 Resume + ATS Modal
========================= */
function ResumeReviewModal({ app, onClose, onUpdateStatus }) {
  const [pdfUrl, setPdfUrl] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!app) return

    const resumeId =
      app.resume?._id?.$oid ||
      app.resume?._id ||
      app.resumeId

    if (!resumeId) {
      setError("Resume ID missing")
      return
    }

    let objectUrl = null
    setError(null)
    setPdfUrl(null)

    api.get(`/resumes/view/${resumeId}`, {
      responseType: "blob",
      timeout: 20000
    })
      .then(res => {
        const blob = new Blob([res.data], { type: "application/pdf" })
        objectUrl = URL.createObjectURL(blob)
        setPdfUrl(objectUrl)
      })
      .catch(err => {
        console.error("❌ Resume load failed:", err)
        setError("Unable to load resume PDF")
      })

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [app])

  if (!app) return null

  const ats = app.ats || {}
  const matched = ats.matched_skills || []
  const missing = ats.missing_skills || []
  const summary = ats.summary
  const recommendations = ats.recommendations || []

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex">

      {/* LEFT — PDF */}
      <div className="w-3/5 bg-gray-100 p-4">
        {error ? (
          <div className="h-full flex items-center justify-center text-red-600">
            {error}
          </div>
        ) : pdfUrl ? (
          <iframe src={pdfUrl} className="w-full h-full rounded" />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Loading resume…
          </div>
        )}
      </div>

      {/* RIGHT — ATS */}
      <div className="w-2/5 bg-white p-6 overflow-y-auto">
        <h2 className="text-xl font-bold mb-2">ATS Evaluation</h2>

        <div className="text-4xl font-bold text-green-700 mb-4">
          {app.atsScore}%
        </div>

        {summary && (
          <div className="mb-4 p-3 bg-slate-50 border rounded text-sm">
            <strong>Summary:</strong> {summary}
          </div>
        )}

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

      

        <div className="flex gap-2">
          <button
            disabled={app.status === "shortlisted"}
            onClick={() => onUpdateStatus(app.applicationId, "shortlisted")}
            className={`flex-1 py-2 rounded text-white
              ${app.status === "shortlisted"
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"}`}
          >
            Shortlist
          </button>

          <button
            disabled={app.status === "rejected"}
            onClick={() => onUpdateStatus(app.applicationId, "rejected")}
            className={`flex-1 py-2 rounded text-white
              ${app.status === "rejected"
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"}`}
          >
            Reject
          </button>
        </div>

        <button onClick={onClose} className="mt-4 w-full border py-2 rounded">
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
  const navigate = useNavigate()
  const [apps, setApps] = useState([])
  const [selectedApp, setSelectedApp] = useState(null)

  useEffect(() => {
    if (!jobId) return
    api.get(`/applications/job/${jobId}`)
      .then(res => setApps(res.data.applications || []))
      .catch(console.error)
  }, [jobId])

  const startChat = async (applicationId) => {
    const res = await api.post("/chat/start", { applicationId })
    navigate(`/recruiter/chat/${res.data.conversationId}`)
  }

  const updateStatus = async (applicationId, status) => {
    await api.patch(`/applications/${applicationId}/status`, { status })

    setApps(prev =>
      prev.map(a =>
        a.applicationId === applicationId ? { ...a, status } : a
      )
    )

    setSelectedApp(prev =>
      prev?.applicationId === applicationId ? { ...prev, status } : prev
    )
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Applicants</h1>

      {apps.map((a, index) => (
        <div
          key={a.applicationId}
          className="bg-white rounded-lg shadow p-4 flex items-center gap-4 mb-3"
        >
          <div className="font-bold text-gray-400 w-6">
            #{index + 1}
          </div>

          <div className="flex-1">
            <p className="font-semibold">
              {a.user?.fullName || "Candidate"}
            </p>
            <p className="text-sm text-gray-500">
              ATS Score: {a.atsScore}%
            </p>
          </div>

          <button
            onClick={() => startChat(a.applicationId)}
            className="p-2 rounded hover:bg-indigo-100"
          >
            💬
          </button>

          <button
            onClick={() =>
              navigate(`/recruiter/applicants/${a.applicationId}/profile`)
            }
            className="px-3 py-1 text-xs font-bold border rounded hover:bg-slate-100"
          >
            View Profile
          </button>

          <button
            onClick={() => setSelectedApp(a)}
            className="border px-3 py-1 rounded hover:bg-gray-100"
          >
            Review
          </button>
        </div>
      ))}

      {selectedApp && (
        <ResumeReviewModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
          onUpdateStatus={updateStatus}
        />
      )}
    </div>
  )
}