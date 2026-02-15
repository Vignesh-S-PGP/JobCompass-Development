function ResumeReviewModal({ app, onClose }) {
  const [pdfUrl, setPdfUrl] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!app) return

    const resumeId =
      app.resume?._id?.$oid || app.resume?._id

    if (!resumeId) {
      setError("Resume ID missing")
      return
    }

    let objectUrl = null

    api.get(`/resumes/view/${resumeId}`, {
      responseType: "blob",
      timeout: 20000   // ⏱️ 20 seconds max
    })
      .then(res => {
        const blob = new Blob([res.data], {
          type: "application/pdf"
        })
        objectUrl = URL.createObjectURL(blob)
        setPdfUrl(objectUrl)
      })
      .catch(err => {
        console.error("❌ Resume load failed:", err)
        setError("Unable to load resume PDF")
      })

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
      setPdfUrl(null)
      setError(null)
    }
  }, [app])

  if (!app) return null

  const ats = app.ats || {}
  const matched = ats.matched_skills || []
  const missing = ats.missing_skills || []

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex">

      {/* LEFT — PDF VIEWER */}
      <div className="w-3/5 bg-gray-100 p-4">
        {error ? (
          <div className="h-full flex items-center justify-center text-red-600">
            {error}
          </div>
        ) : pdfUrl ? (
          <iframe
            src={pdfUrl}
            className="w-full h-full rounded"
            title="Resume"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Loading resume…
          </div>
        )}
      </div>

      {/* RIGHT — ATS DETAILS */}
      <div className="w-2/5 bg-white p-6 overflow-y-auto">
        <h2 className="text-xl font-bold mb-2">
          ATS Evaluation
        </h2>

        <div className="text-4xl font-bold text-green-700 mb-4">
          {app.atsScore}%
        </div>

        <section className="mb-4">
          <h3 className="font-semibold mb-1">Matched Skills</h3>
          {matched.length === 0 ? (
            <p className="text-sm text-gray-500">None</p>
          ) : (
            <ul className="list-disc list-inside text-green-700 text-sm">
              {matched.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          )}
        </section>

        <section className="mb-4">
          <h3 className="font-semibold mb-1">Missing Skills</h3>
          {missing.length === 0 ? (
            <p className="text-sm text-gray-500">No major gaps</p>
          ) : (
            <ul className="list-disc list-inside text-red-600 text-sm">
              {missing.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          )}
        </section>

        <p className="text-sm text-gray-600 mb-6">
          {ats.reason}
        </p>

        <div className="flex gap-2">
          <button className="flex-1 bg-green-600 text-white py-2 rounded">
            Shortlist
          </button>
          <button className="flex-1 bg-red-600 text-white py-2 rounded">
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
  )
}
