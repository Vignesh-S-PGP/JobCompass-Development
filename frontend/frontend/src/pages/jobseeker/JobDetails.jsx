import { useEffect, useState } from "react"
import api from "../../services/api"
import ATSModal from "./ATSModal"

export default function JobDetails({ job, onBack }) {
  const [resumes, setResumes] = useState([])
  const [resumeId, setResumeId] = useState("")
  const [atsLoading, setAtsLoading] = useState(false)
  const [atsResult, setAtsResult] = useState(null)

  const company = job.company || {}

  useEffect(() => {
    api.get("/resumes").then(res =>
      setResumes(res.data.resumes || [])
    )
  }, [])

  const applyJob = async () => {
    if (!resumeId) return alert("Select resume")

    setAtsLoading(true)
    try {
      const res = await api.post("/applications/apply", {
        jobId: job._id,
        resumeId
      })
      setAtsResult(res.data)
    } finally {
      setAtsLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <button
        onClick={onBack}
        className="mb-6 text-sm text-gray-600 hover:underline"
      >
        ← Back to jobs
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <aside className="md:col-span-1">
          <div className="bg-white rounded-xl shadow p-6 sticky top-6">

            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                className="w-20 h-20 object-contain mb-4"
              />
            ) : (
              <div className="w-20 h-20 rounded bg-gray-200 flex items-center justify-center mb-4 text-xl font-bold">
                {company.name?.[0]}
              </div>
            )}

            <h2 className="text-xl font-bold">{company.name}</h2>
            <p className="text-sm text-gray-600">{company.industry}</p>

            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <p><b>Location:</b> {company.location}</p>
              <p><b>Company Size:</b> {company.size}</p>

              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline block"
                >
                  Visit Website →
                </a>
              )}
            </div>

            {company.about && (
              <p className="mt-4 text-sm text-gray-600">
                {company.about}
              </p>
            )}
          </div>
        </aside>

        <main className="md:col-span-2">
          <div className="bg-white rounded-xl shadow p-8">

            <h1 className="text-3xl font-bold">{job.title}</h1>

            <p className="text-gray-600 mt-1">
              {job.location} • {job.jobType} • {job.experience}+ yrs
            </p>

            <div className="mt-6">
              <h3 className="font-semibold text-lg">Job Description</h3>
              <p className="mt-2 text-gray-700 whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {job.skillsRequired?.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg">Skills Required</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {job.skillsRequired.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 border-t pt-6">
              <h3 className="font-semibold mb-2">
                Apply with AI ATS
              </h3>

              <select
                className="border p-2 w-full rounded"
                value={resumeId}
                onChange={e => setResumeId(e.target.value)}
              >
                <option value="">Select Resume</option>
                {resumes.map(r => (
                  <option key={r._id} value={r._id}>
                    {r.filename}
                  </option>
                ))}
              </select>

              <button
                onClick={applyJob}
                className="mt-4 w-full bg-black text-white py-3 rounded-lg text-lg hover:opacity-90"
              >
                Apply & Get ATS Score
              </button>
            </div>
          </div>
        </main>
      </div>

      <ATSModal
        loading={atsLoading}
        data={atsResult}
        onClose={() => setAtsResult(null)}
      />
    </div>
  )
}
