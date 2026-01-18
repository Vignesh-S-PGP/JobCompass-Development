import { useState } from "react"
import api from "../../services/api"

export default function CreateJob() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    skillsRequired: "",
    experience: "",
    location: "",
    jobType: "",
    salaryRange: ""
  })

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

const handleSubmit = async e => {
  e.preventDefault()

  await api.post("/jobs", {
    ...form,
    skillsRequired: form.skillsRequired
      .split(",")
      .map(s => s.trim())
  })

  alert("Job created")
}


  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <h1 className="text-xl font-bold">Create Job</h1>

      <input name="title" placeholder="Job title" onChange={handleChange} className="w-full border p-2" />
      <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full border p-2" />
      <input name="skillsRequired" placeholder="Skills (comma separated)" onChange={handleChange} className="w-full border p-2" />
      <input name="experience" placeholder="Experience" onChange={handleChange} className="w-full border p-2" />
      <input name="location" placeholder="Location" onChange={handleChange} className="w-full border p-2" />
      <input name="jobType" placeholder="Job Type" onChange={handleChange} className="w-full border p-2" />
      <input name="salaryRange" placeholder="Salary" onChange={handleChange} className="w-full border p-2" />

      <button className="bg-black text-white px-4 py-2 rounded">Create Job</button>
    </form>
  )
}
