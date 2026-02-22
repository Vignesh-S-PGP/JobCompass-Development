import { useNavigate } from "react-router-dom"

export default function ApplicationCard({ app }) {
  const navigate = useNavigate()

  const statusColor = {
    applied: "bg-yellow-100 text-yellow-700",
    shortlisted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700"
  }

  return (
    <div className="bg-white rounded-xl shadow p-5 flex justify-between items-center">

      {/* LEFT */}
      <div className="flex items-center gap-4">
        <img
          src={app.company.logo}
          alt={app.company.name}
          className="w-12 h-12 rounded"
        />

        <div>
          <h3 className="font-semibold">{app.job.title}</h3>
          <p className="text-sm text-gray-500">
            {app.company.name} • {app.job.location}
          </p>
        </div>
      </div>

      {/* CENTER */}
      <div className="text-center">
        <p className="text-sm text-gray-500">ATS Score</p>
        <p className="text-2xl font-bold">{app.atsScore}%</p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
       <span
  className={`px-3 py-1 rounded-full text-xs font-semibold
    ${a.status === "shortlisted"
      ? "bg-green-100 text-green-700"
      : a.status === "rejected"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700"}
  `}
>
  {a.status.toUpperCase()}
</span>

        <button
          onClick={() => navigate(`/applications/${app._id}`)}
          className="border px-4 py-1 rounded hover:bg-gray-100"
        >
          View
        </button>
      </div>
    </div>
  )
}
