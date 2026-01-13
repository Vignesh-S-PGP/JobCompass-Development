import { useState } from "react"
import jobService from "../../services/jobService"

export default function CreateJob() {
  const [form, setForm] = useState({
    companyName: "",
    title: "",
    description: "",
    skillsRequired: "",
    experience: "",
    location: "",
    jobType: "",
    salaryRange: ""
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const submitJob = async () => {
    const payload = {
      ...form,
      skillsRequired: form.skillsRequired.split(",").map(s => s.trim())
    }

    try {
      await jobService.createJob(payload)
      alert("Job posted successfully")
      setForm({})
    } catch (err) {
      alert("Failed to post job")
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Post New Job</h2>

      {[
        ["companyName", "Company Name"],
        ["title", "Job Title"],
        ["experience", "Experience"],
        ["location", "Location"],
        ["jobType", "Job Type"],
        ["salaryRange", "Salary Range"]
      ].map(([name, label]) => (
        <input
          key={name}
          name={name}
          placeholder={label}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />
      ))}

      <textarea
        name="description"
        placeholder="Job Description"
        onChange={handleChange}
        className="w-full border p-2 mb-3 rounded"
        rows={4}
      />

      <input
        name="skillsRequired"
        placeholder="Skills (comma separated)"
        onChange={handleChange}
        className="w-full border p-2 mb-3 rounded"
      />

      <button
        onClick={submitJob}
        className="bg-black text-white px-6 py-2 rounded"
      >
        Post Job
      </button>
    </div>
  )
}
