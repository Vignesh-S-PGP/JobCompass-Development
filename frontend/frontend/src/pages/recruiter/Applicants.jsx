import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../../services/api"
import {
  Users,
  Search,
  ArrowLeft,
  Star,
  MessageCircle,
  ChevronRight,
  Filter,
  Sparkles,
  UserCircle
} from "lucide-react"
import { ListSkeleton } from "../../components/ui/Skeleton"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Badge from "../../components/ui/Badge"
import Input from "../../components/ui/Input"
import EmptyState from "../../components/ui/EmptyState"

/* =========================
   📄 Resume + ATS Modal (Refined)
========================= */
function ResumeReviewModal({ app, onClose, onUpdateStatus }) {
  const [pdfUrl, setPdfUrl] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

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
    setLoading(true)

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
      .finally(() => setLoading(false))

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [app])

  if (!app) return null

  const ats = app.ats || {}
  const matched = ats.matched_skills || []
  const missing = ats.missing_skills || []
  const summary = ats.summary

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in">
      <Card className="w-full max-w-[95vw] h-[90vh] flex flex-col md:flex-row overflow-hidden border-none shadow-2xl rounded-[3rem]">

        {/* LEFT — PDF PREVIEW */}
        <div className="md:w-3/5 bg-slate-50 border-r border-slate-100 relative">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Asset...</p>
            </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center text-rose-500 font-bold p-10 text-center">
              {error}
            </div>
          ) : (
            <iframe src={pdfUrl} className="w-full h-full" />
          )}
        </div>

        {/* RIGHT — ATS EVALUATION */}
        <div className="md:w-2/5 bg-white p-10 md:p-12 overflow-y-auto custom-scrollbar flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">ATS Evaluation</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <ArrowLeft className="rotate-180" size={20} />
            </button>
          </div>

          <div className="flex items-center gap-6 mb-10 bg-slate-950 p-8 rounded-[2rem] text-white">
            <div className="relative">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-white/10" strokeWidth="4" />
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-primary-500" strokeWidth="4" strokeDasharray={`${app.atsScore}, 100`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xl font-black">
                {app.atsScore}%
              </div>
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-primary-500 mb-1">Compatibility</p>
               <p className="text-sm font-bold text-slate-300">Verified Match Rate</p>
            </div>
          </div>

          <div className="flex-1 space-y-10">
            {summary && (
              <section>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Executive Summary</h3>
                <p className="text-sm font-medium text-slate-600 leading-relaxed italic border-l-4 border-primary-100 pl-4 py-1">
                  {summary}
                </p>
              </section>
            )}

            <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                <Sparkles size={14} className="text-emerald-500" /> Matched Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {matched.length === 0 ? (
                  <p className="text-xs text-slate-300 font-bold uppercase italic tracking-widest">None detected</p>
                ) : (
                  matched.map((s, i) => <Badge key={i} variant="success">{s}</Badge>)
                )}
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                <Filter size={14} className="text-rose-500" /> Capability Gaps
              </h3>
              <div className="flex flex-wrap gap-2">
                {missing.length === 0 ? (
                  <p className="text-xs text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-2">
                     <Star size={12} fill="currentColor" /> Optimal Profile Alignment
                  </p>
                ) : (
                  missing.map((s, i) => <Badge key={i} variant="danger">{s}</Badge>)
                )}
              </div>
            </section>
          </div>

          <div className="mt-12 flex gap-4">
            <Button
              variant="outline"
              onClick={() => onUpdateStatus(app.applicationId, "rejected")}
              disabled={app.status === "rejected"}
              className="flex-1 py-4 border-rose-100 text-rose-600 hover:bg-rose-50 hover:border-rose-200"
            >
              Reject Candidate
            </Button>
            <Button
              variant="primary"
              onClick={() => onUpdateStatus(app.applicationId, "shortlisted")}
              disabled={app.status === "shortlisted"}
              className="flex-1 py-4 shadow-xl shadow-primary-600/20"
            >
              Shortlist
            </Button>
          </div>
        </div>
      </Card>
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
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (!jobId) return
    api.get(`/applications/job/${jobId}`)
      .then(res => setApps(res.data.applications || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [jobId])

  const startChat = async (applicationId) => {
    try {
      const res = await api.post("/chat/start", { applicationId })
      navigate(`/recruiter/chat/${res.data.conversationId}`)
    } catch (err) {
      console.error("Chat start failed", err)
    }
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

  const filteredApps = apps.filter(a =>
    a.user?.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusVariant = (status) => {
    const map = { shortlisted: "success", rejected: "danger", pending: "warning", applied: "primary" };
    return map[status] || "default";
  };

  if (loading) return <ListSkeleton />;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">

      {/* HEADER AREA */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 pb-10 border-b border-slate-100">
         <div>
            <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate(-1)} className="mb-6 -ml-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900">
               Return to Repository
            </Button>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              Talent <span className="text-primary-600">Pipeline</span>.
            </h1>
            <p className="text-slate-500 font-medium text-lg mt-4 max-w-xl">
              Screen and evaluate candidates for the active mandate. {apps.length} professionals found.
            </p>
         </div>

         <div className="w-full md:max-w-md">
            <Input
              icon={Search}
              placeholder="Search talent by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="py-4 shadow-xl shadow-slate-200/50"
            />
         </div>
      </div>

      {filteredApps.length === 0 ? (
        <EmptyState
          title="No Candidates Found"
          description="We couldn't find any professionals matching your search parameters in this pipeline."
          actionLabel="Clear Search"
          onAction={() => setSearch("")}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredApps.map((a, index) => (
            <Card key={a.applicationId} hover className="p-8 group relative overflow-hidden flex flex-col">
              {/* Score Overlay */}
              <div className="absolute top-0 right-0 px-6 py-4 bg-slate-950 text-white rounded-bl-[2rem] flex items-center gap-2 group-hover:bg-primary-600 transition-colors duration-500">
                 <span className="text-xl font-black">{a.atsScore}%</span>
                 <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 group-hover:text-primary-200">ATS Match</span>
              </div>

              <div className="flex items-center gap-6 mb-8 pt-4">
                 <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-primary-200 transition-colors">
                    {a.user?.profileImage ? (
                      <img src={a.user.profileImage} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <UserCircle className="text-slate-200" size={32} />
                    )}
                 </div>
                 <div className="flex-1 truncate pr-16">
                    <h3 className="text-xl font-black text-slate-900 truncate uppercase tracking-tight group-hover:text-primary-600 transition-colors">{a.user?.fullName || "Candidate"}</h3>
                    <Badge variant={getStatusVariant(a.status)} className="mt-2">{a.status}</Badge>
                 </div>
              </div>

              <div className="flex-1 space-y-4 mb-10">
                 <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Transmission</span>
                    <span className="text-[10px] font-black text-slate-900">{new Date(a.appliedAt).toLocaleDateString()}</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Experience Tier</span>
                    <span className="text-[10px] font-black text-slate-900">{a.experience || "Entry"} Level</span>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-auto">
                 <Button
                   variant="outline"
                   onClick={() => navigate(`/recruiter/applicants/${a.applicationId}/profile`)}
                   className="py-3 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-950 hover:text-white hover:border-slate-950"
                 >
                   Profile
                 </Button>
                 <Button
                   variant="primary"
                   onClick={() => setSelectedApp(a)}
                   className="py-3 text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary-600/20"
                 >
                   Review ATS
                 </Button>
              </div>

              {/* FLOATING ACTION */}
              <button
                 onClick={() => startChat(a.applicationId)}
                 className="absolute bottom-32 right-8 w-12 h-12 bg-white rounded-2xl border border-slate-100 shadow-xl flex items-center justify-center text-slate-400 hover:text-primary-600 hover:border-primary-600 hover:scale-110 transition-all z-10"
                 title="Quick Message"
              >
                 <MessageCircle size={20} />
              </button>
            </Card>
          ))}
        </div>
      )}

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
