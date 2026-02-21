import { useEffect, useState } from "react"
import api from "../../services/api"

export default function ResumePreviewModal({ resumeId, onClose }) {
  const [pdfUrl, setPdfUrl] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!resumeId) return

    let objectUrl = null
    setError(null)
    setPdfUrl(null)

    api.get(`/resumes/view/${resumeId}`, {
      responseType: "blob",
      timeout: 20000
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
    }
  }, [resumeId])

  if (!resumeId) return null

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="w-[95vw] max-w-6xl h-[90vh] bg-white rounded-xl overflow-hidden flex flex-col">

        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold">Resume Preview</h3>
          <button onClick={onClose} className="text-gray-600">✕</button>
        </div>

        <div className="flex-1 bg-gray-100">
          {error ? (
            <div className="h-full flex items-center justify-center text-red-600">
              {error}
            </div>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full"
              title="Resume PDF"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Loading resume…
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
