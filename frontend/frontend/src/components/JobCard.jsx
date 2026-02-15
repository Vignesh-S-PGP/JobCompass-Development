export default function JobCard({ job, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white p-5 rounded-xl shadow hover:shadow-lg cursor-pointer flex gap-4 transition"
    >
      {/* Company Logo */}
      <img
        src={
          job.company?.logo ||
          `https://logo.clearbit.com/${job.company?.name}.com`
        }
        alt={job.company?.name}
        className="w-14 h-14 rounded-lg object-contain bg-gray-100 p-2"
      />

      {/* Job Info */}
      <div className="flex-1">
        <h2 className="text-lg font-semibold">{job.title}</h2>

        <p className="text-sm text-gray-500">
          {job.company?.name} • {job.location}
        </p>

        <p className="mt-2 text-gray-700 line-clamp-2">
          {job.description}
        </p>
      </div>
    </div>
  )
}
