import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../../services/api"
import ATSBreakdown from "../../components/applications/ATSBreakdown"
import ResumePreview from "../../components/applications/ResumePreview"

export default function ApplicationDetail() {
  const { id } = useParams()
  const [app, setApp] = useState(null)

  useEffect(() => {
    api.get(`/applications/${id}`).then(res => {
      setApp(res.data.application)
      
    })
  }, [id])

  if (!app) {
    return <div className="p-10">Loading…</div>
  }

  return (
  <div className="max-w-7xl mx-auto p-6 space-y-6">

    <div className="bg-white rounded-xl shadow p-6 flex items-start gap-6">
      <div className="w-20 h-20 rounded-lg border flex items-center justify-center bg-gray-50">
        {app.company?.logo ? (
          <img
            src={app.company.logo}
            alt={app.company.name}
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <span className="text-gray-400 text-sm">No Logo</span>
        )}
      </div>

      <div className="flex-1">
        <h1 className="text-2xl font-bold">
          {app.job?.title || "Job title unavailable"}
        </h1>

        <p className="text-gray-600 font-medium">
          {app.company?.name || "Company unavailable"}
        </p>

        <div className="flex gap-3 mt-2 text-sm text-gray-500">
          <span>{app.job?.location}</span>
          <span>•</span>
          <span className="capitalize">{app.job?.jobType}</span>
        </div>
      </div>

      <div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold
          ${
            app.status === "shortlisted"
              ? "bg-green-100 text-green-700"
              : app.status === "rejected"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {app.status?.toUpperCase()}
        </span>
      </div>
    </div>

    <div className="grid md:grid-cols-3 gap-6">

      <div className="md:col-span-2 space-y-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-3">
            Job Description
          </h2>
          <p className="text-gray-700 whitespace-pre-line">
            {app.job?.description || "No description provided"}
          </p>
        </div>

        <ATSBreakdown
          ats={app.ats}
          score={app.atsScore}
        />
      </div>

      <div className="space-y-6">

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-3">
            Company Details
          </h3>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 border rounded-lg flex items-center justify-center bg-gray-50">
              {app.company?.logo ? (
                <img
                  src={app.company.logo}
                  

                  alt={app.company.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <span className="text-xs text-gray-400">
                  No Logo
                </span>
              )}
            </div>

            <div>
              <p className="font-semibold">
                {app.company?.name}
              </p>
              <p className="text-sm text-gray-500">
                {app.company?.location}
              </p>
            </div>
          </div>
        </div>

        <ResumePreview resume={app.resume} />
      </div>
    </div>
  </div>
)
}

