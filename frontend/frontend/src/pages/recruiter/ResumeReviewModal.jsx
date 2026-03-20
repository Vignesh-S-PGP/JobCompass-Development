import { useEffect, useState } from "react"
import api from "../../services/api"

import {
  X,
  CheckCircle2,
  AlertCircle
} from "lucide-react"

export default function ResumeReviewModal({ app, onClose, onUpdateStatus }) {

  const [pdfUrl,setPdfUrl] = useState(null)
  const [error,setError] = useState(null)

  useEffect(()=>{

    if(!app) return

    const resumeId =
      app.resume?._id?.$oid ||
      app.resume?._id ||
      app.resumeId

    let url

    api.get(`/resumes/view/${resumeId}`,{responseType:"blob"})
      .then(res=>{
        url = URL.createObjectURL(
          new Blob([res.data],{type:"application/pdf"})
        )
        setPdfUrl(url)
      })
      .catch(()=>{
        setError("Unable to load resume")
      })

    return ()=>{
      if(url) URL.revokeObjectURL(url)
    }

  },[app])


  const ats = app.ats || {}
  const matched = ats.matched_skills || []
  const missing = ats.missing_skills || []


  return(

    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6">

      <div className="w-full max-w-7xl h-[90vh] bg-white rounded-2xl overflow-hidden flex shadow-2xl">

        {/* PDF */}

        <div className="flex-1 bg-slate-100">

          {error
            ? <div className="h-full flex items-center justify-center text-red-500">
                {error}
              </div>
            : pdfUrl
              ? <iframe src={pdfUrl} className="w-full h-full"/>
              : <div className="h-full flex items-center justify-center text-slate-400">
                  Loading resume…
                </div>
          }

        </div>


        {/* ATS PANEL */}

        <div className="w-[420px] border-l p-6 overflow-y-auto">

          <div className="flex justify-between items-center mb-6">

            <h2 className="font-bold text-lg">
              ATS Evaluation
            </h2>

            <button onClick={onClose}>
              <X/>
            </button>

          </div>


          {/* SCORE */}

          <div className="text-center mb-6">

            <div className="text-5xl font-black text-indigo-600">
              {app.atsScore}%
            </div>

            <p className="text-sm text-slate-500">
              Match Score
            </p>

          </div>


          {/* MATCHED */}

          <div className="mb-6">

            <div className="flex items-center gap-2 text-green-600 mb-2">
              <CheckCircle2 size={16}/>
              <strong>Matched Skills</strong>
            </div>

            <div className="flex flex-wrap gap-2">

              {matched.map((s,i)=>(
                <span
                  key={i}
                  className="px-3 py-1 bg-green-50 text-green-700 rounded text-xs font-bold"
                >
                  {s}
                </span>
              ))}

            </div>

          </div>


          {/* MISSING */}

          <div className="mb-6">

            <div className="flex items-center gap-2 text-red-600 mb-2">
              <AlertCircle size={16}/>
              <strong>Missing Skills</strong>
            </div>

            <div className="flex flex-wrap gap-2">

              {missing.map((s,i)=>(
                <span
                  key={i}
                  className="px-3 py-1 bg-red-50 text-red-600 rounded text-xs font-bold"
                >
                  {s}
                </span>
              ))}

            </div>

          </div>


          {/* SUMMARY */}

          {ats.summary && (

            <div className="bg-slate-50 border p-3 rounded text-sm mb-6">
              {ats.summary}
            </div>

          )}


          {/* ACTION BUTTONS */}

          <div className="flex gap-3">

            <button
              disabled={app.status==="shortlisted"}
              onClick={()=>onUpdateStatus(app.applicationId,"shortlisted")}
              className={`flex-1 py-3 rounded text-white font-bold
                ${app.status==="shortlisted"
                  ? "bg-green-300"
                  : "bg-green-600 hover:bg-green-700"}
              `}
            >
              Shortlist
            </button>


            <button
              disabled={app.status==="rejected"}
              onClick={()=>onUpdateStatus(app.applicationId,"rejected")}
              className={`flex-1 py-3 rounded text-white font-bold
                ${app.status==="rejected"
                  ? "bg-red-300"
                  : "bg-red-600 hover:bg-red-700"}
              `}
            >
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

    </div>

  )

}