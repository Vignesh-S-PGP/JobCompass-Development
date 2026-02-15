import { useEffect, useState } from "react"
import api from "../../services/api"

export default function Company() {
  const [form, setForm] = useState({
    name: "",
    industry: "",
    location: "",
    size: "",
    website: "",
    about: "",
    logo: ""
  })

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get("/company/my").then(res => {
      if (res.data.company) {
        setForm(res.data.company)
      }
    })
  }, [])

  const handleLogoUpload = e => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () =>
      setForm({ ...form, logo: reader.result })
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    setSaving(true)
    await api.post("/company", form)
    setSaving(false)
    alert("Company profile saved")
  }

  return (
    <div className="max-w-5xl mx-auto p-6">

      {/* Hero Section */}
      <div className="bg-white rounded-xl shadow p-6 flex items-center gap-6">
        <div className="relative">
          <img
            src={form.logo || "/company-placeholder.png"}
            alt="logo"
            className="w-32 h-32 rounded-lg object-cover border"
          />
          <label className="absolute bottom-2 right-2 bg-black text-white p-1 rounded-full cursor-pointer">
            ✎
            <input type="file" hidden onChange={handleLogoUpload} />
          </label>
        </div>

        <div className="flex-1">
          <input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Company name"
            className="text-3xl font-bold w-full outline-none"
          />
          <p className="text-gray-600 mt-1">
            {form.industry || "Industry"} · {form.location || "Location"}
          </p>

          {form.website && (
            <a
              href={form.website}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 text-sm mt-2 inline-block"
            >
              {form.website}
            </a>
          )}
        </div>
      </div>

      {/* About */}
      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <h3 className="font-semibold text-lg mb-2">About Company</h3>
        <textarea
          value={form.about}
          onChange={e => setForm({ ...form, about: e.target.value })}
          placeholder="Describe your company culture, mission, and vision…"
          className="w-full border rounded p-3 min-h-[140px]"
        />
      </div>

      {/* Details */}
      <div className="bg-white rounded-xl shadow p-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          value={form.industry}
          onChange={e => setForm({ ...form, industry: e.target.value })}
          placeholder="Industry (e.g. Tech, SaaS)"
          className="border p-3 rounded"
        />

        <input
          value={form.location}
          onChange={e => setForm({ ...form, location: e.target.value })}
          placeholder="Location"
          className="border p-3 rounded"
        />

        <input
          value={form.size}
          onChange={e => setForm({ ...form, size: e.target.value })}
          placeholder="Company size (e.g. 11–50)"
          className="border p-3 rounded"
        />

        <input
          value={form.website}
          onChange={e => setForm({ ...form, website: e.target.value })}
          placeholder="Website URL"
          className="border p-3 rounded"
        />
      </div>

      {/* Save */}
      <div className="mt-6 text-right">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-black text-white px-6 py-2 rounded"
        >
          {saving ? "Saving…" : "Save Company Profile"}
        </button>
      </div>
    </div>
  )
}
