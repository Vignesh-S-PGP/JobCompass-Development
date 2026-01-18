import { useEffect, useState } from "react"
import api from "../../services/api"

export default function Company() {
  const [company, setCompany] = useState(null)
  const [form, setForm] = useState({
    name: "",
    website: "",
    description: ""
  })

  useEffect(() => {
    api.get("/company/my").then(res => {
      setCompany(res.data.company)
    })
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    await api.post("/company", form)
navigate("/recruiter/dashboard")

    alert("Company created")
    window.location.reload()
  }

  if (company) {
    return (
      <div>
        <h1 className="text-2xl font-bold">{company.name}</h1>
        <p>{company.description}</p>
        <p>{company.website}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <h1 className="text-xl font-bold">Create Company</h1>
      <input name="name" placeholder="Company name" onChange={e => setForm({...form, name:e.target.value})} className="border p-2 w-full" />
      <input name="website" placeholder="Website" onChange={e => setForm({...form, website:e.target.value})} className="border p-2 w-full" />
      <textarea name="description" placeholder="Description" onChange={e => setForm({...form, description:e.target.value})} className="border p-2 w-full" />
      <button className="bg-black text-white px-4 py-2">Save</button>
    </form>
  )
}
