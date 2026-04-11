import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../../services/api"
import ResumeReviewModal from "./ResumeReviewModal"

import {
  MessageSquare,
  User,
  Eye,
  SlidersHorizontal
} from "lucide-react"

export default function Applicants() {

  const { jobId } = useParams()
  const navigate = useNavigate()

  const [apps,setApps] = useState([])
  const [selectedApp,setSelectedApp] = useState(null)

  const [scoreFilter,setScoreFilter] = useState("all")
  const [customScore,setCustomScore] = useState("")

  const [limitFilter,setLimitFilter] = useState("all")
  const [customLimit,setCustomLimit] = useState("")

  const [statusFilter,setStatusFilter] = useState("all")

  /* ---------------- FETCH ---------------- */

  useEffect(()=>{
    if(!jobId) return

    api.get(`/applications/job/${jobId}`)
      .then(res=>{
        setApps(res.data.applications || [])
      })
      .catch(err=>{
        console.error("Error fetching applications:", err)
      })

  },[jobId])

  /* ---------------- CHAT ---------------- */

  const startChat = async(applicationId)=>{
    const res = await api.post("/chat/start",{applicationId})
    navigate(`/recruiter/chat/${res.data.conversationId}`)
  }

  /* ---------------- UPDATE STATUS ---------------- */

  const updateStatus = async(applicationId,status)=>{

    await api.patch(`/applications/${applicationId}/status`,{status})

    setApps(prev =>
      prev.map(a =>
        a.applicationId === applicationId
          ? { ...a, status }
          : a
      )
    )

    setSelectedApp(prev =>
      prev?.applicationId === applicationId
        ? { ...prev, status }
        : prev
    )
  }

  /* ---------------- FILTER LOGIC ---------------- */

  let filtered = [...apps]

  // STATUS FILTER
  if(statusFilter !== "all"){
    filtered = filtered.filter(a => a.status === statusFilter)
  }

  // SCORE FILTER
  if(scoreFilter !== "all"){
    const scoreValue = scoreFilter === "custom"
      ? Number(customScore)
      : Number(scoreFilter)

    if(scoreValue){
      filtered = filtered.filter(a => a.atsScore >= scoreValue)
    }
  }

  // LIMIT FILTER
  if(limitFilter !== "all"){
    const limitValue = limitFilter === "custom"
      ? Number(customLimit)
      : Number(limitFilter)

    if(limitValue){
      filtered = filtered.slice(0,limitValue)
    }
  }

  /* ---------------- UI ---------------- */

  return (

    <div className="max-w-7xl mx-auto space-y-8 pb-20">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-black text-slate-900">
            Applicants
          </h1>
          <p className="text-slate-500">
            Review, filter and manage candidates
          </p>
        </div>

        <div className="text-sm text-slate-400 font-semibold">
          Total: {filtered.length}
        </div>

      </div>

      {/* FILTER BAR */}
      <div className="bg-white border rounded-2xl p-5 flex flex-wrap gap-4 items-center shadow-sm">

        <SlidersHorizontal size={18} />

        {/* STATUS */}
        <select
          value={statusFilter}
          onChange={e=>setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="all">All Status</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="rejected">Rejected</option>
          <option value="applied">Applied</option>
        </select>

        {/* SCORE */}
        <select
          value={scoreFilter}
          onChange={e=>setScoreFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="all">All Scores</option>
          <option value="90">ATS ≥ 90</option>
          <option value="80">ATS ≥ 80</option>
          <option value="70">ATS ≥ 70</option>
          <option value="custom">Custom</option>
        </select>

        {scoreFilter === "custom" && (
          <input
            type="number"
            placeholder="Enter score"
            value={customScore}
            onChange={e=>setCustomScore(e.target.value)}
            className="border px-3 py-2 rounded-lg w-32"
          />
        )}

        {/* LIMIT */}
        <select
          value={limitFilter}
          onChange={e=>setLimitFilter(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="all">All</option>
          <option value="10">Top 10</option>
          <option value="15">Top 15</option>
          <option value="20">Top 20</option>
          <option value="custom">Custom</option>
        </select>

        {limitFilter === "custom" && (
          <input
            type="number"
            placeholder="Limit"
            value={customLimit}
            onChange={e=>setCustomLimit(e.target.value)}
            className="border px-3 py-2 rounded-lg w-24"
          />
        )}

      </div>

      {/* APPLICANTS LIST */}
      <div className="space-y-4">

        {filtered.map((a,index)=>(

          <div
            key={a.applicationId}
            className="bg-white border rounded-2xl p-5 flex justify-between items-center hover:shadow-md transition group"
          >

            {/* LEFT */}
            <div className="flex items-center gap-5">

              {/* RANK */}
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold">
                #{index+1}
              </div>

              {/* INFO */}
              <div>

                <p className="font-semibold text-slate-900 text-lg">
                  {a.user_name || "Candidate"}
                </p>

                <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">

                  <span>
                    ATS Score: <span className="font-semibold text-indigo-600">{a.atsScore}%</span>
                  </span>

                  <span className={`px-2 py-1 rounded text-xs font-semibold
                    ${a.status === "shortlisted" && "bg-green-100 text-green-700"}
                    ${a.status === "rejected" && "bg-red-100 text-red-600"}
                    ${a.status === "applied" && "bg-blue-100 text-blue-600"}
                  `}>
                    {a.status}
                  </span>

                </div>

              </div>

            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-3">

              <button
                onClick={()=>startChat(a.applicationId)}
                className="p-2 rounded-lg hover:bg-indigo-50 transition"
              >
                <MessageSquare size={18}/>
              </button>

              <button
                onClick={()=>navigate(`/recruiter/applicants/${a.applicationId}/profile`)}
                className="px-3 py-1 border rounded-lg text-xs font-semibold hover:bg-slate-100 transition flex items-center gap-1"
              >
                <User size={14}/>
                Profile
              </button>

              <button
                onClick={()=>setSelectedApp(a)}
                className="px-3 py-1 bg-slate-900 text-white rounded-lg text-xs flex items-center gap-1 hover:bg-black transition"
              >
                <Eye size={14}/>
                Review
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* MODAL */}
      {selectedApp && (

        <ResumeReviewModal
          app={selectedApp}
          onClose={()=>setSelectedApp(null)}
          onUpdateStatus={updateStatus}
        />

      )}

    </div>

  )

}