import { useEffect, useState } from "react"
import api from "../../services/api"

export default function Profile() {
  const [form, setForm] = useState({
    fullName: "",
    headline: "",
    location: "",
    experience: "",
    skills: "",
    bio: ""
  })

  useEffect(() => {
    api.get("/profile").then(res => {
      if (res.data.profile) {
        setForm({
          ...res.data.profile,
          skills: res.data.profile.skills.join(", ")
        })
      }
    })
  }, [])

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    await api.put("/profile", {
      ...form,
      experience: Number(form.experience),
      skills: form.skills.split(",").map(s => s.trim())
    })

    alert("Profile saved")
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">My Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" className="w-full border p-2" />
        <input name="headline" value={form.headline} onChange={handleChange} placeholder="Headline (e.g. Python Developer)" className="w-full border p-2" />
        <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="w-full border p-2" />
        <input name="experience" value={form.experience} onChange={handleChange} placeholder="Experience (years)" type="number" className="w-full border p-2" />

        <textarea name="skills" value={form.skills} onChange={handleChange} placeholder="Skills (comma separated)" className="w-full border p-2" />
        <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Short bio" className="w-full border p-2" />

        <button className="bg-black text-white px-4 py-2 rounded">
          Save Profile
        </button>
      </form>
    </div>
  )
}
