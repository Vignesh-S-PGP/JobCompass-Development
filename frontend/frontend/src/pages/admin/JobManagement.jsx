
import { useState, useEffect } from "react"
import api from "../../services/api"
import { Trash2, ExternalLink, AlertCircle } from "lucide-react"

export default function JobManagement() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const res = await api.get("/admin/jobs")
      setJobs(res.data.jobs)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to remove this job?")) return
    try {
      await api.delete(`/admin/jobs/${jobId}`)
      fetchJobs()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">Job Management</h2>
        <p className="text-sm text-gray-500 mt-1">Monitor and manage all job postings across the platform.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-600">Job Title</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Company</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Experience</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {jobs.map((job) => (
              <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-medium text-blue-600 hover:underline cursor-pointer">{job.title}</p>
                  <p className="text-xs text-gray-400">ID: {job._id}</p>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  {job.companyId}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    job.status === "active" ? "text-green-600 bg-green-50" :
                    job.status === "closed" ? "text-red-600 bg-red-50" :
                    "text-amber-600 bg-amber-50"
                  }`}>
                    {job.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {job.experience} years
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => deleteJob(job._id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                      title="Delete Job"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                      <ExternalLink size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

import { useEffect, useState } from "react";
import api from "../../services/api";
import { Trash2, Briefcase, MapPin, DollarSign, Clock } from "lucide-react";

export default function JobManagement() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = () => {
    api.get("/admin/jobs").then(res => {
      setJobs(res.data.jobs);
      setLoading(false);
    });
  };

  const deleteJob = (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      api.delete(`/admin/jobs/${id}`).then(() => fetchJobs());
    }
  };

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Job Postings.</h1>
          <p className="text-slate-500 font-bold mt-2">Oversee all active and inactive listings</p>
        </div>
        <div className="bg-slate-900 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest">
          {jobs.length} Active
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {jobs.map(j => (
          <div key={j._id} className="bg-white p-8 rounded-[32px] border border-slate-200 hover:border-indigo-500 transition-all group relative shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{j.title}</h3>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Exp: {j.experience} Years</p>
              </div>
              <button
                onClick={() => deleteJob(j._id)}
                className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-slate-50 pt-6">
              <div className="flex items-center gap-2 text-slate-500">
                <MapPin size={16} className="text-slate-300" />
                <span className="text-xs font-bold">{j.location}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <DollarSign size={16} className="text-slate-300" />
                <span className="text-xs font-bold">{j.salaryRange || 'Market'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Clock size={16} className="text-slate-300" />
                <span className="text-xs font-bold">{j.jobType}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

}
