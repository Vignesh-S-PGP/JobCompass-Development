import { useEffect, useState } from "react"
import api from "../../services/api"
import { uploadResume, getResumes } from "../../services/resumeService"

export default function Resumes() {
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState("")
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [previewId, setPreviewId] = useState(null)

  const fetchResumes = async () => {
    try {
      const res = await getResumes()
      setResumes(res.data.resumes || [])
    } catch {
      setError("Failed to load resumes")
    }
  }

  useEffect(() => {
    fetchResumes()
  }, [])

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file")
      return
    }

    setLoading(true)
    setError("")

    try {
      await uploadResume(file, title)
      setFile(null)
      setTitle("")
      fetchResumes()
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Delete this resume?")) return

    try {
      await api.delete(`/resumes/${id}`)
      fetchResumes()
    } catch {
      alert("Failed to delete resume")
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">

      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold">My Resumes</h1>
        <p className="text-gray-600">
          Manage resumes used for AI-powered job applications
        </p>
      </div>

      {/* UPLOAD CARD */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Upload New Resume
        </h2>

        {error && (
          <p className="text-red-600 mb-4">{error}</p>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Resume Title (e.g. Frontend Developer)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-3 rounded"
          />

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-3 rounded"
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="mt-4 bg-black text-white px-6 py-2 rounded hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Uploading…" : "Upload Resume"}
        </button>
      </div>

      {/* RESUME LIST */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Uploaded Resumes
        </h2>

        {resumes.length === 0 ? (
          <p className="text-gray-500">
            No resumes uploaded yet.
          </p>
        ) : (
          <div className="space-y-4">
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className="flex items-center justify-between border rounded-lg p-4"
              >
                <div>
                  <p className="font-semibold">
                    {resume.title || resume.filename}
                  </p>
                  <p className="text-sm text-gray-500">
                    {resume.filename} •{" "}
                    {resume.uploadedAt &&
                      new Date(resume.uploadedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewId(resume._id)}
                    className="border px-3 py-1 rounded hover:bg-gray-100"
                  >
                    View
                  </button>

                  <button
                    onClick={() => handleDelete(resume._id)}
                    className="text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PDF PREVIEW MODAL */}
      {previewId && (
        <div className="fixed inset-0 bg-black/70 z-50 flex">
          <div className="w-full max-w-6xl bg-white m-auto rounded-lg overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold">Resume Preview</h3>
              <button
                onClick={() => setPreviewId(null)}
                className="text-gray-600"
              >
                ✕
              </button>
            </div>

            <iframe
              src={`${import.meta.env.VITE_API_BASE_URL}/resumes/view/${previewId}`}
              className="w-full h-[80vh]"
              title="Resume PDF"
            />
          </div>
        </div>
      )}
    </div>
  )
}
