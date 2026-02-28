import { useEffect, useState } from "react";
import api from "../../services/api";
import { uploadResume, getResumes } from "../../services/resumeService";
import ResumePreviewModal from "./ResumePreviewModal";
import { 
  FileText, 
  UploadCloud, 
  Trash2, 
  Eye, 
  FilePlus, 
  ShieldCheck,
  AlertCircle,
  Calendar
} from "lucide-react";

export default function Resumes() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewId, setPreviewId] = useState(null);

  const fetchResumes = async () => {
    try {
      const res = await getResumes();
      setResumes(res.data.resumes || []);
    } catch {
      setError("System failed to synchronize resume records.");
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleUpload = async () => {
    if (!file) {
      setError("No document selected for deployment.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await uploadResume(file, title);
      setFile(null);
      setTitle("");
      fetchResumes();
    } catch (err) {
      setError(err.response?.data?.error || "Archive upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Confirm permanent deletion of this record?")) return;
    try {
      await api.delete(`/resumes/${id}`);
      fetchResumes();
    } catch {
      alert("Action failed: Record locked or inaccessible.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 pt-6 px-4 animate-in fade-in duration-700">
      
      {/* HEADER SECTION */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter">Resumes.</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2">
            AI-Ready Document Repository
          </p>
        </div>

        <div className="bg-white border-2 border-slate-100 p-4 rounded-2xl min-w-[150px] shadow-sm flex items-center gap-4">
          <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
             <FileText size={24} />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Archived</p>
            <p className="text-3xl font-black text-slate-900 leading-none">{resumes.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT: UPLOAD TERMINAL (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border-2 border-slate-900 rounded-[32px] p-8 shadow-[12px_12px_0px_0px_rgba(15,23,42,0.05)]">
            <div className="flex items-center gap-3 mb-6">
              <FilePlus size={18} className="text-indigo-600" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">New Deployment</h3>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600">
                <AlertCircle size={16} />
                <p className="text-[10px] font-black uppercase">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Dev Lead"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">PDF Module</label>
                <div className="relative group">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${file ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-200 group-hover:border-slate-400'}`}>
                    <UploadCloud size={24} className={`mx-auto mb-2 ${file ? 'text-indigo-600' : 'text-slate-300'}`} />
                    <p className="text-[10px] font-black text-slate-500 uppercase truncate">
                      {file ? file.name : "Select PDF File"}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleUpload}
                disabled={loading}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-indigo-600 transition-all disabled:opacity-50 shadow-lg mt-4"
              >
                {loading ? "Transmitting..." : "Initialize Upload"}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: DOCUMENT REGISTRY (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
             <ShieldCheck size={18} className="text-slate-400" />
             <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Secure Registry</h2>
          </div>

          {resumes.length === 0 ? (
            <div className="bg-slate-50 border-2 border-dashed border-slate-100 rounded-[32px] p-20 text-center">
              <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No documents detected in current vault.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {resumes.map((resume) => (
                <div
                  key={resume._id}
                  className="group bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-50 transition-all"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 leading-tight">
                        {resume.title || resume.filename}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-bold text-slate-400 truncate max-w-[150px]">
                          {resume.filename}
                        </span>
                        <div className="w-1 h-1 bg-slate-200 rounded-full" />
                        <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase italic">
                          <Calendar size={10} />
                          {resume.uploadedAt ? new Date(resume.uploadedAt).toLocaleDateString("en-IN") : "—"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setPreviewId(resume._id)}
                      className="flex items-center gap-2 bg-slate-50 text-slate-600 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all"
                    >
                      <Eye size={14} /> View
                    </button>
                    <button
                      onClick={() => handleDelete(resume._id)}
                      className="p-2.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {previewId && (
        <ResumePreviewModal
          resumeId={previewId}
          onClose={() => setPreviewId(null)}
        />
      )}
    </div>
  );
}