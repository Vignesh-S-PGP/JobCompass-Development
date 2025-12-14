import { useEffect, useState } from "react"
import { uploadResume, getResumes } from "../../services/resumeService"

export default function Resumes() {
  const [file, setFile] = useState(null)
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchResumes = async () => {
    try {
      const res = await getResumes()
      setResumes(res.data.resumes)
    } catch (err) {
      setError("Failed to load resumes")
    }
  }

  useEffect(() => {
    fetchResumes()
  }, [])

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file")
      console.log("Selected file:", file)

      return
    }

    setLoading(true)
    // setError("")

    try {
      await uploadResume(file)
      setFile(null)
      fetchResumes()
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">My Resumes</h1>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-medium mb-4">
          Upload Resume (PDF)
        </h2>

        {error && (
          <p className="text-red-600 mb-3">{error}</p>
        )}

       <input
  type="file"
  accept=".pdf"
  onChange={(e) => {
    const selected = e.target.files[0]
    console.log("FILE SELECTED:", selected)
    setFile(selected)
    setError("")
  }}
  className="mb-4 block"
/>

<button
  type="button"
  onClick={() => {
    console.log("FILE AT UPLOAD CLICK:", file)
    handleUpload()
  }}
  disabled={loading}
  className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
>
  {loading ? "Uploading..." : "Upload"}
</button>


      </div>

      {/* Resume List */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-medium mb-4">
          Uploaded Resumes
        </h2>

        {resumes.length === 0 ? (
          <p className="text-gray-500">
            No resumes uploaded yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {resumes.map((resume) => (
  <div
    key={resume._id}
    className="flex items-center justify-between rounded-md border px-4 py-3"
  >
    <div className="font-medium text-gray-900">
      {resume.filename}
    </div>

    <div className="text-sm text-gray-500">
      {resume.uploadedAt
        ? new Date(resume.uploadedAt).toLocaleDateString()
        : ""}
    </div>
  </div>
))}

          </ul>
        )}
      </div>
    </div>
  )
}
