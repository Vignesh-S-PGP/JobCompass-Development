import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../../services/api"
import {
  ArrowLeft,
  MessageSquare,
  User,
  FileSearch,
  CheckCircle,
  XCircle,
  MoreVertical,
  Star
} from "lucide-react"

function ResumeReviewModal({ app, onClose, onUpdateStatus }) {
  const [pdfUrl, setPdfUrl] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!app) return

    const resumeId = app.resume?._id?.$oid || app.resume?._id || app.resumeId

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

    api
      .get(`/resumes/view/${resumeId}`, {
        responseType: "blob",
        timeout: 20000,
      })
      .then((res) => {

        const blob = new Blob([res.data], {
          type: "application/pdf",
        })
        objectUrl = URL.createObjectURL(blob)
        setPdfUrl(objectUrl)
      })
      .catch(() => {
        setError("Unable to load resume PDF")
      })

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [app])

  if (!app) return null

  const ats = app.ats || {}

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-6xl h-[90vh] rounded-[32px] overflow-hidden flex shadow-2xl">

        {/* LEFT — PDF VIEWER */}
        <div className="flex-1 bg-slate-100 relative">
          <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-200">
            Resume Preview
          </div>
          {error ? (
            <div className="h-full flex flex-col items-center justify-center text-red-500 p-10 text-center">
              <XCircle size={48} className="mb-4 opacity-20" />
              <p className="font-bold">{error}</p>
            </div>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full"
              title="Resume"
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="font-bold animate-pulse uppercase tracking-widest text-xs">Fetching Document...</p>
            </div>
          )}
        </div>

        {/* RIGHT — ATS DETAILS */}
        <div className="w-[400px] border-l border-slate-100 flex flex-col">
          <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-xl font-black text-slate-900">Analysis.</h2>
               <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <XCircle size={24} className="text-slate-300" />
               </button>
            </div>

            <div className="bg-indigo-50 rounded-3xl p-6 mb-8 text-center border border-indigo-100">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-1">ATS Match Score</p>
              <div className="text-5xl font-black text-indigo-600">
                {app.atsScore}%
              </div>
            </div>

            <div className="space-y-8">
              <section>
                <div className="flex items-center gap-2 mb-3">
                   <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Matched Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(ats.matched_skills || []).map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-black uppercase tracking-tighter border border-emerald-100">{s}</span>
                  ))}
                  {(ats.matched_skills || []).length === 0 && <p className="text-xs text-slate-400 italic">No direct matches identified</p>}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-3">
                   <div className="w-1.5 h-4 bg-rose-500 rounded-full" />
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Missing Gaps</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(ats.missing_skills || []).map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-rose-50 text-rose-700 rounded-lg text-[10px] font-black uppercase tracking-tighter border border-rose-100">{s}</span>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-3">
                   <div className="w-1.5 h-4 bg-indigo-500 rounded-full" />
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">AI Reasoning</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl">
                  {ats.reason || "Automatic scoring completed based on skill density and experience relevance."}
                </p>
              </section>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="p-8 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-4">
            <button
              disabled={app.status === "shortlisted"}
              onClick={() => onUpdateStatus(app.applicationId, "shortlisted")}
              className={`py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg transition-all
                ${app.status === "shortlisted"
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-900/10"}`}
            >
              Shortlist
            </button>

            <button
              disabled={app.status === "rejected"}
              onClick={() => onUpdateStatus(app.applicationId, "rejected")}
              className={`py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg transition-all
                ${app.status === "rejected"
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  : "bg-rose-600 text-white hover:bg-rose-700 shadow-rose-900/10"}`}
            >
              Reject
            </button>
          </div>
        </div>

    <div className="fixed inset-0 bg-black/70 z-50 flex">
      <div className="w-3/5 bg-gray-100 p-4">
        {error ? (
          <div className="h-full flex items-center justify-center text-red-600">{error}</div>
        ) : pdfUrl ? (
          <iframe src={pdfUrl} className="w-full h-full rounded" title="Resume" />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">Loading resume…</div>
        )}
      </div>

      <div className="w-2/5 bg-white p-6 overflow-y-auto">
        <h2 className="text-xl font-bold mb-2">ATS Evaluation</h2>

        <div className="text-4xl font-bold text-green-700 mb-4">{app.atsScore}%</div>

        <section className="mb-4">
          <h3 className="font-semibold mb-1">Matched Skills</h3>
          <ul className="list-disc list-inside text-green-700 text-sm">
            {(ats.matched_skills || []).map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>

        <section className="mb-4">
          <h3 className="font-semibold mb-1">Missing Skills</h3>
          <ul className="list-disc list-inside text-red-600 text-sm">
            {(ats.missing_skills || []).map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>

        <p className="text-sm text-gray-600 mb-6">{ats.reason}</p>

        <div className="flex gap-2">
          <button
            disabled={app.status === "shortlisted"}
            onClick={() => onUpdateStatus(app.applicationId, "shortlisted")}
            className={`flex-1 py-2 rounded text-white ${
              app.status === "shortlisted" ? "bg-green-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Shortlist
          </button>

          <button
            disabled={app.status === "rejected"}
            onClick={() => onUpdateStatus(app.applicationId, "rejected")}
            className={`flex-1 py-2 rounded text-white ${
              app.status === "rejected" ? "bg-red-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
            }`}
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

export default function Applicants() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState(null)

  useEffect(() => {
    if (!jobId) return


    api.get(`/applications/job/${jobId}`)
      .then(res => setApps(res.data.applications || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))

    api
      .get(`/applications/job/${jobId}`)
      .then((res) => setApps(res.data.applications || []))
      .catch((err) => console.error(err))

  }, [jobId])

  const startChat = async (applicationId) => {
    const res = await api.post("/chat/start", {
      applicationId,
    })
    navigate(`/recruiter/chat/${res.data.conversationId}`)
  }

  const updateStatus = async (applicationId, status) => {
    try {
      await api.patch(`/applications/${applicationId}/status`, { status })


      setApps(prev =>
        prev.map(a =>
          a.applicationId === applicationId
            ? { ...a, status }
            : a
        )
      )

      setSelectedApp(prev =>
        prev && prev.applicationId === applicationId
          ? { ...prev, status }
          : prev
      )

      setApps((prev) => prev.map((a) => (a.applicationId === applicationId ? { ...a, status } : a)))
      setSelectedApp((prev) => (prev && prev.applicationId === applicationId ? { ...prev, status } : prev))

    } catch (err) {
      console.error("❌ Status update failed", err)
      alert("Failed to update status")
    }
  }

  const startChat = async (applicationId) => {
    try {
      const res = await api.post("/chat/start", { applicationId })
      navigate(`/recruiter/chat/${res.data.conversationId}`)
    } catch (err) {
      console.error("Failed to start chat", err)
    }
  }

  if (loading) return (
    <div className="max-w-5xl mx-auto p-10 space-y-4">
       {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-slate-100 rounded-3xl animate-pulse" />)}
    </div>
  )

  return (

    <div className="max-w-5xl mx-auto p-4 md:p-10 space-y-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
           <button onClick={() => navigate(-1)} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
              <ArrowLeft size={20} />
           </button>
           <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Applicants.</h1>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{apps.length} Total Candidates</p>
           </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl">
           <button className="px-4 py-2 bg-white rounded-xl text-xs font-black uppercase tracking-widest shadow-sm">Priority</button>
           <button className="px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-400">Recent</button>
        </div>
      </div>

      <div className="space-y-4">
        {apps.map(a => (
          <div
            key={a.applicationId}
            className="bg-white rounded-[32px] border border-slate-100 p-6 flex items-center justify-between group hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-900/5 transition-all"
          >
            <div className="flex items-center gap-6">
               <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 relative">
                  {a.user?.profileImage ? (
                    <img src={a.user.profileImage} className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <User className="text-indigo-400" />
                  )}
                  <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-black text-white ${a.atsScore > 70 ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                     {a.atsScore}
                  </div>
               </div>

               <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-black text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">{a.user?.fullName || "Anonymous Candidate"}</h3>
                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-[0.2em] border ${
                      a.status === 'shortlisted' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                      a.status === 'rejected' ? 'bg-rose-50 border-rose-200 text-rose-600' :
                      'bg-slate-50 border-slate-200 text-slate-400'
                    }`}>
                       {a.status}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-400 mt-0.5">{a.user?.headline || "Applicant"}</p>
               </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => startChat(a.applicationId)}
                className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                title="Start Conversation"
              >
                <MessageSquare size={20} />
              </button>

              <button
                onClick={() => navigate(`/recruiter/applicants/${a.applicationId}/profile`)}
                className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                title="View Full Profile"
              >
                <User size={20} />
              </button>

              <button
                onClick={() => setSelectedApp(a)}
                className="flex items-center gap-3 px-6 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
              >
                <FileSearch size={18} /> Review
              </button>
            </div>
          </div>
        ))}

        {apps.length === 0 && (
          <div className="py-20 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-slate-200" size={40} />
             </div>
             <p className="text-slate-400 font-bold">No applicants yet for this position.</p>
          </div>
        )}
      </div>

    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Applicants</h1>

      {apps.map((a) => (
        <div key={a.applicationId} className="bg-white rounded-lg shadow p-4 flex items-center gap-4 mb-3">
          <div className="flex-1">
            <p className="font-semibold">{a.user?.fullName || "Candidate"}</p>
            <p className="text-sm text-gray-500">ATS Score: {a.atsScore}%</p>
          </div>

          <button onClick={() => startChat(a.applicationId)} className="p-2 rounded hover:bg-indigo-100" title="Message applicant">
            💬
          </button>

          <button
            onClick={() => navigate(`/recruiter/applicants/${a.applicationId}/profile`)}
            className="px-3 py-1 text-xs font-bold border rounded hover:bg-slate-100"
          >
            View Profile
          </button>

          <button onClick={() => setSelectedApp(a)} className="border px-3 py-1 rounded hover:bg-gray-100">
            Review
          </button>
        </div>
      ))}


      <ResumeReviewModal app={selectedApp} onClose={() => setSelectedApp(null)} onUpdateStatus={updateStatus} />
    </div>
  )
}
