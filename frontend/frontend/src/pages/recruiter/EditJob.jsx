import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../../services/api"

export default function RecruiterEditJob() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)

  useEffect(() => {
    api.get(`/jobs/${jobId}`)
      .then(res => setForm(res.data.job))
  }, [jobId])

  const update = async () => {
    await api.put(`/jobs/${jobId}`, {
      title: form.title,
      description: form.description,
      location: form.location,
      jobType: form.jobType,
      salaryRange: form.salaryRange
    })
    navigate(`/recruiter/jobs/${jobId}`)
  }

  if (!form) return <div className="p-10">Loading…</div>

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">

      <h1 className="text-2xl font-black uppercase">Edit Job</h1>

      <input
        className="w-full border p-3 rounded-xl"
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
        placeholder="Job Title"
      />

      <textarea
        rows={8}
        className="w-full border p-3 rounded-xl"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
        placeholder="Job Description"
      />

      <input
        className="w-full border p-3 rounded-xl"
        value={form.location}
        onChange={e => setForm({ ...form, location: e.target.value })}
        placeholder="Location"
      />

      <select
        className="w-full border p-3 rounded-xl"
        value={form.jobType}
        onChange={e => setForm({ ...form, jobType: e.target.value })}
      >
        <option value="remote">Remote</option>
        <option value="onsite">Onsite</option>
        <option value="hybrid">Hybrid</option>
      </select>

      <input
        className="w-full border p-3 rounded-xl"
        value={form.salaryRange}
        onChange={e => setForm({ ...form, salaryRange: e.target.value })}
        placeholder="Salary"
      />

      <div className="flex gap-3 pt-4">
        <button
          onClick={update}
          className="bg-black text-white px-6 py-3 rounded-xl text-xs font-black uppercase"
        >
          Save Changes
        </button>

        <button
          onClick={() => navigate(-1)}
          className="border px-6 py-3 rounded-xl text-xs font-black uppercase"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}