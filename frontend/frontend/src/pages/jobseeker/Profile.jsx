import { useEffect, useState } from "react"
import api from "../../services/api"

export default function Profile() {
  const [form, setForm] = useState({
    fullName: "",
    headline: "",
    location: "",
    experience: "",
    skills: [],
    bio: "",
    profileImage: ""
  })

  const [skillInput, setSkillInput] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get("/profile").then(res => {
      if (res.data.profile) {
        setForm(res.data.profile)
      }
    })
  }, [])

  const addSkill = () => {
    if (!skillInput.trim()) return
    if (form.skills.includes(skillInput.trim())) return

    setForm({
      ...form,
      skills: [...form.skills, skillInput.trim()]
    })
    setSkillInput("")
  }

  const removeSkill = skill =>
    setForm({
      ...form,
      skills: form.skills.filter(s => s !== skill)
    })

  const handleImageUpload = e => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () =>
      setForm({ ...form, profileImage: reader.result })
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    setSaving(true)
    await api.put("/profile", {
      ...form,
      experience: Number(form.experience)
    })
    setSaving(false)
    alert("Profile updated")
  }

  return (
    <div className="max-w-5xl mx-auto p-6">

      {/* Header Card */}
      <div className="bg-white rounded-xl shadow p-6 flex gap-6 items-center">
        <div className="relative">
          <img
            src={form.profileImage || "/avatar-placeholder.png"}
            alt="profile"
            className="w-28 h-28 rounded-full object-cover border"
          />
          <label className="absolute bottom-0 right-0 bg-black text-white p-1 rounded-full cursor-pointer">
            ✎
            <input type="file" hidden onChange={handleImageUpload} />
          </label>
        </div>

        <div className="flex-1">
          <input
            value={form.fullName}
            onChange={e => setForm({ ...form, fullName: e.target.value })}
            placeholder="Your name"
            className="text-2xl font-bold w-full outline-none"
          />
          <input
            value={form.headline}
            onChange={e => setForm({ ...form, headline: e.target.value })}
            placeholder="Professional headline"
            className="text-gray-600 w-full outline-none mt-1"
          />
          <div className="flex gap-4 mt-2 text-sm text-gray-500">
            <input
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              placeholder="Location"
              className="outline-none"
            />
            <input
              type="number"
              value={form.experience}
              onChange={e => setForm({ ...form, experience: e.target.value })}
              placeholder="Experience (yrs)"
              className="outline-none w-32"
            />
          </div>
        </div>
      </div>

      {/* About */}
      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <h3 className="font-semibold text-lg mb-2">About Me</h3>
        <textarea
          value={form.bio}
          onChange={e => setForm({ ...form, bio: e.target.value })}
          placeholder="Write a short professional summary..."
          className="w-full border rounded p-3 min-h-[120px]"
        />
      </div>

      {/* Skills */}
      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <h3 className="font-semibold text-lg mb-3">Skills</h3>

        <div className="flex gap-2 mb-3">
          <input
            value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            placeholder="Add a skill"
            className="border p-2 rounded w-full"
          />
          <button
            onClick={addSkill}
            className="bg-black text-white px-4 rounded"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {form.skills.map(skill => (
            <span
              key={skill}
              className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="text-red-500"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="mt-6 text-right">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-black text-white px-6 py-2 rounded"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  )
}
