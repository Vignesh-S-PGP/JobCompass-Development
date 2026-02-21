import ResumePreviewModal from "../../pages/jobseeker/ResumePreviewModal"
import { useState } from "react"

export default function ResumePreview({ resume }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="font-semibold mb-2">Resume Used</h3>
      <p className="text-sm text-gray-600 mb-3">
        {resume.title || resume.filename}
      </p>

      <button
        onClick={() => setOpen(true)}
        className="border px-4 py-1 rounded hover:bg-gray-100"
      >
        View Resume
      </button>

      {open && (
        <ResumePreviewModal
          resumeId={resume._id}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  )
}
