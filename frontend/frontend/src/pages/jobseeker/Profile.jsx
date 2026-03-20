import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  Camera,
  MapPin,
  Briefcase,
  Plus,
  X,
  CheckCircle2,
  Trash2,
  GraduationCap
} from "lucide-react";

export default function Profile() {

  const [form, setForm] = useState({
    fullName: "",
    headline: "",
    location: "",
    experience: "",
    skills: [],
    bio: "",
    profileImage: "",
    education: [],
    detailedExperience: []
  });

  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    api.get("/profile").then(res => {
      if (res.data.profile) {
        setForm({
          ...form,
          ...res.data.profile,
          education: res.data.profile.education || [],
          detailedExperience: res.data.profile.detailedExperience || []
        });
      }
    });
  }, []);

  /* ---------------------- SKILLS ---------------------- */

  const addSkill = () => {
    if (!skillInput.trim()) return;
    if (form.skills.includes(skillInput.trim())) return;

    setForm({
      ...form,
      skills: [...form.skills, skillInput.trim()]
    });

    setSkillInput("");
  };

  const removeSkill = skill => {
    setForm({
      ...form,
      skills: form.skills.filter(s => s !== skill)
    });
  };

  /* ---------------------- EDUCATION ---------------------- */

  const addEducation = () => {
    setForm({
      ...form,
      education: [...form.education, { school: "", degree: "", year: "" }]
    });
  };

  const updateEducation = (index, field, value) => {
    const newEdu = [...form.education];
    newEdu[index][field] = value;

    setForm({
      ...form,
      education: newEdu
    });
  };

  const removeEducation = index => {
    setForm({
      ...form,
      education: form.education.filter((_, i) => i !== index)
    });
  };

  /* ---------------------- EXPERIENCE ---------------------- */

  const addExperience = () => {
    setForm({
      ...form,
      detailedExperience: [
        ...form.detailedExperience,
        { company: "", role: "", description: "" }
      ]
    });
  };

  const updateExperience = (index, field, value) => {
    const newExp = [...form.detailedExperience];
    newExp[index][field] = value;

    setForm({
      ...form,
      detailedExperience: newExp
    });
  };

  const removeExperience = index => {
    setForm({
      ...form,
      detailedExperience: form.detailedExperience.filter((_, i) => i !== index)
    });
  };

  /* ---------------------- IMAGE ---------------------- */

  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm({ ...form, profileImage: reader.result });
    };
    reader.readAsDataURL(file);
  };

  /* ---------------------- SAVE ---------------------- */

  const handleSubmit = async () => {

    setSaving(true);

    await api.put("/profile", {
      ...form,
      experience: Number(form.experience)
    });

    setSaving(false);
    setShowSuccess(true);

    setTimeout(() => setShowSuccess(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <h1 className="text-2xl font-semibold text-slate-900">
          Profile Settings
        </h1>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition
          ${
            saving
              ? "bg-slate-200 text-slate-400"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          {saving ? "Saving..." : showSuccess ? <CheckCircle2 size={16} /> : "Save"}
        </button>

      </div>

      {/* PROFILE CARD */}

      <div className="bg-white border border-slate-200 rounded-xl p-6">

        <div className="flex items-center gap-6">

          <div className="relative">

            <img
              src={form.profileImage || "/avatar-placeholder.png"}
              className="w-24 h-24 rounded-full object-cover"
            />

            <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700">
              <Camera size={14}/>
              <input type="file" hidden onChange={handleImageUpload}/>
            </label>

          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">

            <input
              placeholder="Full name"
              value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })}
              className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />

            <input
              placeholder="Professional headline"
              value={form.headline}
              onChange={e => setForm({ ...form, headline: e.target.value })}
              className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />

            <div className="flex items-center gap-2 border rounded-lg px-3">
              <MapPin size={16} className="text-slate-400"/>
              <input
                placeholder="Location"
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                className="w-full py-2 text-sm outline-none"
              />
            </div>

            <div className="flex items-center gap-2 border rounded-lg px-3">
              <Briefcase size={16} className="text-slate-400"/>
              <input
                type="number"
                placeholder="Years experience"
                value={form.experience}
                onChange={e => setForm({ ...form, experience: e.target.value })}
                className="w-full py-2 text-sm outline-none"
              />
            </div>

          </div>

        </div>

      </div>

      {/* BIO */}

      <div className="bg-white border border-slate-200 rounded-xl p-6">

        <h3 className="text-sm font-semibold mb-4">
          Professional Summary
        </h3>

        <textarea
          value={form.bio}
          onChange={e => setForm({ ...form, bio: e.target.value })}
          className="w-full border rounded-lg p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
          rows="4"
          placeholder="Write about your experience..."
        />

      </div>

      {/* SKILLS */}

      <div className="bg-white border border-slate-200 rounded-xl p-6">

        <h3 className="text-sm font-semibold mb-4">
          Skills
        </h3>

        <div className="flex gap-2 mb-4">

          <input
            value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            placeholder="Add skill"
            className="flex-1 border rounded-lg px-4 py-2 text-sm outline-none"
          />

          <button
            onClick={addSkill}
            className="bg-indigo-600 text-white px-4 rounded-lg hover:bg-indigo-700"
          >
            <Plus size={16}/>
          </button>

        </div>

        <div className="flex flex-wrap gap-2">

          {form.skills.map(skill => (

            <div
              key={skill}
              className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-lg text-xs"
            >
              {skill}

              <button onClick={() => removeSkill(skill)}>
                <X size={12}/>
              </button>

            </div>

          ))}

        </div>

      </div>

      {/* EXPERIENCE */}

      <div className="bg-white border border-slate-200 rounded-xl p-6">

        <div className="flex justify-between mb-6">

          <h3 className="text-sm font-semibold">
            Work Experience
          </h3>

          <button
            onClick={addExperience}
            className="text-indigo-600 text-sm flex items-center gap-1"
          >
            <Plus size={14}/> Add
          </button>

        </div>

        <div className="space-y-4">

          {form.detailedExperience.map((exp, index) => (

          <div
  key={index}
  className={`relative border rounded-xl p-5 transition hover:shadow-lg
  ${index % 2 === 0 ? "bg-slate-50" : "bg-white"}
  border-l-4 border-indigo-500`}
>

  <button
    onClick={() => removeExperience(index)}
    className="absolute top-4 right-4 text-slate-400 hover:text-red-500"
  >
    <Trash2 size={16}/>
  </button>

  <div className="grid md:grid-cols-2 gap-4">

    <div>
      <label className="text-xs text-slate-500 font-medium">Company</label>
      <input
        value={exp.company}
        onChange={e => updateExperience(index,"company",e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm w-full mt-1"
        placeholder="Company name"
      />
    </div>

    <div>
      <label className="text-xs text-slate-500 font-medium">Role</label>
      <input
        value={exp.role}
        onChange={e => updateExperience(index,"role",e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm w-full mt-1"
        placeholder="Job title"
      />
    </div>

  </div>

  <div className="mt-3">
    <label className="text-xs text-slate-500 font-medium">Description</label>
    <textarea
      value={exp.description}
      onChange={e => updateExperience(index,"description",e.target.value)}
      className="border rounded-lg px-3 py-2 text-sm w-full mt-1"
      rows="3"
      placeholder="Describe your responsibilities"
    />
  </div>

</div>

          ))}

        </div>

      </div>

      {/* EDUCATION */}

      <div className="bg-white border border-slate-200 rounded-xl p-6">

        <div className="flex justify-between mb-6">

          <h3 className="text-sm font-semibold">
            Education
          </h3>

          <button
            onClick={addEducation}
            className="text-indigo-600 text-sm flex items-center gap-1"
          >
            <Plus size={14}/> Add
          </button>

        </div>

        <div className="space-y-4">

          {form.education.map((edu,index)=>(

       <div
  key={index}
  className={`relative border rounded-xl p-5 transition hover:shadow-lg
  ${index % 2 === 0 ? "bg-slate-50" : "bg-white"}
  border-l-4 border-emerald-500`}
>

  <button
    onClick={()=>removeEducation(index)}
    className="absolute top-4 right-4 text-slate-400 hover:text-red-500"
  >
    <Trash2 size={16}/>
  </button>

  <div className="grid md:grid-cols-3 gap-4">

    <div>
      <label className="text-xs text-slate-500 font-medium">Institution</label>
      <input
        value={edu.school}
        onChange={e=>updateEducation(index,"school",e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm w-full mt-1"
        placeholder="University / College"
      />
    </div>

    <div>
      <label className="text-xs text-slate-500 font-medium">Degree</label>
      <input
        value={edu.degree}
        onChange={e=>updateEducation(index,"degree",e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm w-full mt-1"
        placeholder="Degree"
      />
    </div>

    <div>
      <label className="text-xs text-slate-500 font-medium">Year</label>
      <input
        value={edu.year}
        onChange={e=>updateEducation(index,"year",e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm w-full mt-1"
        placeholder="Year"
      />
    </div>

  </div>

</div>

          ))}

        </div>

      </div>

    </div>
  );
}