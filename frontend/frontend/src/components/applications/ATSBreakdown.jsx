export default function ATSBreakdown({ ats, score }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">
        ATS Evaluation
      </h2>

      <div className="text-4xl font-bold text-green-700 mb-6">
        {score}%
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Matched Skills</h3>
          <ul className="list-disc list-inside text-green-700 text-sm">
            {ats.matched_skills?.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Missing Skills</h3>
          <ul className="list-disc list-inside text-red-600 text-sm">
            {ats.missing_skills?.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      </div>

      <p className="text-sm text-gray-600 mt-4">
        {ats.reason}
      </p>
    </div>
  )
}
