import { useEffect, useState } from "react";
import api from "../../services/api";
import { uploadResume, getResumes } from "../../services/resumeService";
import ResumePreviewModal from "./ResumePreviewModal";

import {
  FileText,
  UploadCloud,
  Trash2,
  Eye,
  Calendar,
  Plus
} from "lucide-react";

export default function Resumes() {

  const [file,setFile] = useState(null);
  const [title,setTitle] = useState("");
  const [resumes,setResumes] = useState([]);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const [previewId,setPreviewId] = useState(null);

  const fetchResumes = async ()=>{

    try{

      const res = await getResumes();
      setResumes(res.data.resumes || []);

    }catch{
      setError("Failed to fetch resumes.");
    }

  };

  useEffect(()=>{
    fetchResumes();
  },[]);


  const handleUpload = async ()=>{

    if(!file){
      setError("Select a PDF file.");
      return;
    }

    setLoading(true);
    setError("");

    try{

      await uploadResume(file,title);

      setFile(null);
      setTitle("");

      fetchResumes();

    }catch(err){

      setError(err.response?.data?.error || "Upload failed.");

    }finally{
      setLoading(false);
    }

  };


  const handleDelete = async(id)=>{

    if(!confirm("Delete this resume permanently?")) return;

    try{

      await api.delete(`/resumes/${id}`);
      fetchResumes();

    }catch{
      alert("Unable to delete this resume.");
    }

  };


  return(

    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-semibold text-slate-900">
            Resume Manager
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Upload and manage your resumes
          </p>

        </div>

        <div className="bg-white border rounded-xl px-6 py-3 shadow-sm">

          <p className="text-xs text-slate-400">
            Total Resumes
          </p>

          <p className="text-xl font-semibold text-indigo-600">
            {resumes.length}
          </p>

        </div>

      </div>


      {/* UPLOAD CARD */}

      <div className="bg-white border rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">

        <div className="flex items-center gap-3 text-slate-700 font-medium">

          <UploadCloud size={20}/>
          Upload Resume

        </div>

        <input
          type="text"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          placeholder="Resume title"
          className="flex-1 border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
        />

        <div className="relative">

          <input
            type="file"
            accept=".pdf"
            onChange={(e)=>setFile(e.target.files[0])}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />

          <div className="border border-dashed rounded-lg px-4 py-2 text-sm text-slate-500">
            {file ? file.name : "Choose PDF"}
          </div>

        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
        >

          <Plus size={16}/>
          {loading ? "Uploading..." : "Upload"}

        </button>

      </div>


      {/* ERROR */}

      {error && (

        <div className="text-red-500 text-sm">
          {error}
        </div>

      )}


      {/* RESUME GRID */}

      {resumes.length === 0 ? (

        <div className="bg-white border rounded-xl p-16 text-center">

          <FileText size={40} className="mx-auto text-slate-200 mb-4"/>

          <p className="text-sm text-slate-500">
            No resumes uploaded yet
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {resumes.map(resume => (

            <div
              key={resume._id}
              className="bg-white border rounded-xl p-6 hover:shadow-md hover:border-indigo-500 transition flex flex-col justify-between"
            >

              {/* TOP */}

              <div className="flex items-start gap-4">

                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">

                  <FileText className="text-slate-400"/>

                </div>

                <div>

                  <p className="font-medium text-slate-900">
                    {resume.title || resume.filename}
                  </p>

                  <p className="text-xs text-slate-500">
                    {resume.filename}
                  </p>

                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">

                    <Calendar size={12}/>

                    {resume.uploadedAt
                      ? new Date(resume.uploadedAt).toLocaleDateString()
                      : "—"}

                  </div>

                </div>

              </div>


              {/* ACTIONS */}

              <div className="flex items-center justify-between mt-6">

                <button
                  onClick={()=>setPreviewId(resume._id)}
                  className="flex items-center gap-1 text-sm text-indigo-600 hover:underline"
                >

                  <Eye size={16}/>
                  Preview

                </button>

                <button
                  onClick={()=>handleDelete(resume._id)}
                  className="text-slate-400 hover:text-red-500"
                >

                  <Trash2 size={18}/>

                </button>

              </div>

            </div>

          ))}

        </div>

      )}


      {previewId && (

        <ResumePreviewModal
          resumeId={previewId}
          onClose={()=>setPreviewId(null)}
        />

      )}

    </div>

  );

}