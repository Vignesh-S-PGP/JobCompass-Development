import { useEffect, useState } from "react"
import api from "../../services/api"

const JobCompassLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      {/* The Compass Container */}
      <div className="compass-loader">
        <div className="face">
          {/* Cardinal Directions */}
          <div className="mark n">J</div>
          <div className="mark e">E</div>
          <div className="mark s">S</div>
          <div className="mark w">W</div>
          
          {/* The Needle */}
          <div className="needle"></div>
          
          {/* The Center Pin */}
          <div className="pivot"></div>
        </div>
      </div>

      <p className="mt-6 font-semibold text-center text-black text-lg tracking-wide">
        JobCompass is analyzing your resume…
      </p>
    </div>
  );
};

/* =========================
   📊 ATS Modal
========================= */
const ATSModal = ({ loading, data, onClose }) => {
  if (!loading && !data) return null

  const ats = data?.ats ?? {}
  const matched = Array.isArray(ats.matched_skills) ? ats.matched_skills : []
  const missing = Array.isArray(ats.missing_skills) ? ats.missing_skills : []
  const score = data?.atsScore ?? ats.score ?? 0
  const reason = ats.reason ?? "No detailed explanation provided."

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl">

        {loading ? (
          <JobCompassLoader />
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4 text-center">
              AI ATS Evaluation
            </h2>

            <p className="text-center text-4xl font-bold text-green-700">
              {score}%
            </p>

            {/* Matched Skills */}
            <div className="mt-4">
              <h3 className="font-semibold">Matched Skills</h3>
              {matched.length === 0 ? (
                <p className="text-gray-500 text-sm">No strong matches found</p>
              ) : (
                <ul className="list-disc list-inside text-green-700">
                  {matched.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Missing Skills */}
            <div className="mt-4">
              <h3 className="font-semibold">Missing Skills</h3>
              {missing.length === 0 ? (
                <p className="text-gray-500 text-sm">No major gaps detected</p>
              ) : (
                <ul className="list-disc list-inside text-red-600">
                  {missing.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Reason */}
            <p className="mt-4 text-sm text-gray-600">
              {reason}
            </p>

            <button
              onClick={onClose}
              className="mt-6 w-full bg-black text-white py-2 rounded"
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  )
}

/* =========================
   💼 Jobs Page
========================= */
export default function Jobs() {
  const [recommended, setRecommended] = useState([])
  const [allJobs, setAllJobs] = useState([])
  const [resumes, setResumes] = useState([])
  const [selectedResume, setSelectedResume] = useState({})
  const [atsLoading, setAtsLoading] = useState(false)
  const [atsResult, setAtsResult] = useState(null)

  useEffect(() => {
    api.get("/job-feed").then(res => {
      setRecommended(res.data.recommended || [])
      setAllJobs(res.data.all || [])
    })
    api.get("/resumes").then(res => setResumes(res.data.resumes || []))
  }, [])

  const applyJob = async (jobId) => {
  const resumeId = selectedResume[jobId]
  if (!resumeId) {
    alert("Select resume first")
    return
  }

  setAtsLoading(true)
  setAtsResult(null)

  try {
    const res = await api.post("/applications/apply", { jobId, resumeId })

    // 🔥 IMPORTANT DEBUG LOGS
    console.log("🧠 FULL APPLY API RESPONSE =", res.data)
    console.log("🧠 ATS OBJECT =", res.data?.ats)

    setAtsResult(res.data)
  } catch (err) {
    console.error("❌ APPLY ERROR", err)
  } finally {
    setAtsLoading(false)
  }
}


  const renderJob = (job) => (
    <div key={job._id} className="bg-white p-4 mb-4 shadow rounded">
      <h2 className="font-bold">{job.title}</h2>
      <p>{job.description}</p>

      <select
        className="border p-2 mt-2 w-full"
        value={selectedResume[job._id] || ""}
        onChange={(e) =>
          setSelectedResume({ ...selectedResume, [job._id]: e.target.value })
        }
      >
        <option value="">Select Resume</option>
        {resumes.map(r => (
          <option key={r._id} value={r._id}>{r.filename}</option>
        ))}
      </select>

      <button
        onClick={() => applyJob(job._id)}
        className="bg-black text-white px-4 py-2 mt-2 rounded w-full"
      >
        Apply
      </button>
    </div>
  )

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Recommended Jobs</h1>
      {recommended.map(renderJob)}

      <h1 className="text-xl font-bold mt-8 mb-4">All Jobs</h1>
      {allJobs.map(renderJob)}

      <ATSModal
        loading={atsLoading}
        data={atsResult}
        onClose={() => setAtsResult(null)}
      />
    </div>
  )
}
