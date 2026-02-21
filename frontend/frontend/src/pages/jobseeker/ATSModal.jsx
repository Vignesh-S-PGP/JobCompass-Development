import JobCompassLoader from "../../components/JobCompassLoader"

export default function ATSModal({ loading, data, onClose }) {
  if (!loading && !data) return null

  const ats = data?.ats ?? {}
  const matched = Array.isArray(ats.matched_skills) ? ats.matched_skills : []
  const missing = Array.isArray(ats.missing_skills) ? ats.missing_skills : []
  const score = data?.atsScore ?? ats.score ?? 0
  const reason = ats.reason ?? "No detailed explanation provided."

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">

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

            <div className="mt-4">
              <h3 className="font-semibold">Matched Skills</h3>
              {matched.length === 0 ? (
                <p className="text-gray-500 text-sm">No strong matches found</p>
              ) : (
                <ul className="list-disc list-inside text-green-700">
                  {matched.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              )}
            </div>

            <div className="mt-4">
              <h3 className="font-semibold">Missing Skills</h3>
              {missing.length === 0 ? (
                <p className="text-gray-500 text-sm">No major gaps detected</p>
              ) : (
                <ul className="list-disc list-inside text-red-600">
                  {missing.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              )}
            </div>

            <p className="mt-4 text-sm text-gray-600">{reason}</p>

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
