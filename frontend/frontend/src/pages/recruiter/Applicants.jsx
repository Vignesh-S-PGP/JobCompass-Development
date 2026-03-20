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
  const [limitFilter,setLimitFilter] = useState("all")

useEffect(()=>{

  if(!jobId) return

  api.get(`/applications/job/${jobId}`)
    .then(res=>{
      // console.log("Applications API response:", res.data) // ✅ FULL RESPONSE
      // console.log("Applications list:", res.data.applications) // ✅ ONLY ARRAY

      setApps(res.data.applications || [])
    })
    .catch(err=>{
      console.error("Error fetching applications:", err)
    })

},[jobId])


  const startChat = async(applicationId)=>{

    const res = await api.post("/chat/start",{applicationId})

    navigate(`/recruiter/chat/${res.data.conversationId}`)

  }


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

  /* ---------- FILTER LOGIC ---------- */

  let filtered = [...apps]

  if(scoreFilter !== "all"){
    filtered = filtered.filter(a => a.atsScore >= Number(scoreFilter))
  }

  if(limitFilter !== "all"){
    filtered = filtered.slice(0,Number(limitFilter))
  }



  return (

    <div className="max-w-6xl mx-auto space-y-8 pb-20">

      <div>
        <h1 className="text-3xl font-black">Applicants</h1>
        <p className="text-slate-500">Review and shortlist candidates</p>
      </div>


      {/* FILTERS */}

      <div className="bg-white border rounded-xl p-5 flex gap-4 items-center">

        <SlidersHorizontal size={16}/>

        <select
          value={scoreFilter}
          onChange={e=>setScoreFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="all">All Scores</option>
          <option value="90">ATS ≥ 90</option>
          <option value="80">ATS ≥ 80</option>
          <option value="70">ATS ≥ 70</option>
        </select>

        <select
          value={limitFilter}
          onChange={e=>setLimitFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="all">All</option>
          <option value="10">Top 10</option>
          <option value="15">Top 15</option>
          <option value="20">Top 20</option>
        </select>

      </div>



      {/* APPLICANTS */}

      <div className="space-y-3">

        {filtered.map((a,index)=>(

          <div
            key={a.applicationId}
            className="bg-white border rounded-xl p-4 flex justify-between items-center"
          >

            <div className="flex items-center gap-4">

              <div className="text-slate-400 font-bold">
                #{index+1}
              </div>

              <div>

                <p className="font-semibold">
                  {a.user_name || "Candidate"}
                </p>

                <p className="text-sm text-slate-500">
                  ATS Score: {a.atsScore}%
                </p>

              </div>

            </div>


            <div className="flex items-center gap-3">

              <button
                onClick={()=>startChat(a.applicationId)}
                className="p-2 hover:bg-indigo-50 rounded"
              >
                <MessageSquare size={18}/>
              </button>

              <button
                onClick={()=>navigate(`/recruiter/applicants/${a.applicationId}/profile`)}
                className="border px-3 py-1 rounded text-xs font-bold"
              >
                <User size={14}/>
              </button>

              <button
                onClick={()=>setSelectedApp(a)}
                className="bg-slate-900 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
              >
                <Eye size={14}/>
                Review
              </button>

            </div>

          </div>

        ))}

      </div>



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