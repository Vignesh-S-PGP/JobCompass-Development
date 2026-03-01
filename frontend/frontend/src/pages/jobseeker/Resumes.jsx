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
  Calendar,
  Sparkles,
  ChevronRight,
  Info,
  Layers,
  Search
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Input from "../../components/ui/Input";
import EmptyState from "../../components/ui/EmptyState";
import { ListSkeleton } from "../../components/ui/Skeleton";

export default function Resumes() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [previewId, setPreviewId] = useState(null);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const res = await getResumes();
      setResumes(res.data.resumes || []);
    } catch {
      setError("System failed to synchronize resume records.");
    } finally {
      setLoading(false);
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
    setUploading(true);
    setError("");
    try {
      await uploadResume(file, title);
      setFile(null);
      setTitle("");
      fetchResumes();
    } catch (err) {
      setError(err.response?.data?.error || "Archive upload failed.");
    } finally {
      setUploading(false);
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

  if (loading && resumes.length === 0) return <ListSkeleton />;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 pb-10 border-b border-slate-100">
        <div>
           <Badge variant="primary" className="mb-4">Secure Storage</Badge>
           <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">
             Asset <span className="text-primary-600">Vault</span>.
           </h1>
           <p className="text-slate-500 font-medium text-lg mt-4 max-w-xl">
             Manage your professional credentials and resume profiles within the secure ecosystem vault.
           </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950 text-white px-8 py-4 rounded-3xl shadow-xl shadow-slate-200/50 self-start md:self-auto group">
           <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Vault Records</span>
              <span className="text-3xl font-black leading-none mt-1 group-hover:text-primary-500 transition-colors">{resumes.length}</span>
           </div>
           <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/5">
              <FileText size={20} className="text-primary-500" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT: UPLOAD TERMINAL */}
        <div className="lg:col-span-4 space-y-10">
          <Card className="p-10 border-2 border-slate-900 shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <FilePlus size={24} className="text-primary-600" />
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Vault Upload</h3>
              </div>

              {error && (
                <div className="mb-8 p-5 bg-rose-50 border border-rose-100 rounded-[1.5rem] flex items-center gap-4 text-rose-600 animate-in slide-up">
                  <AlertCircle size={20} className="shrink-0" />
                  <p className="text-[10px] font-black uppercase leading-relaxed">{error}</p>
                </div>
              )}

              <div className="space-y-8">
                <Input
                  label="Document Designation"
                  placeholder="e.g. Senior Systems Lead 2024"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  icon={Briefcase}
                  className="py-4"
                />

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Module (PDF)</label>
                  <div className="relative group/upload">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className={`
                      border-2 border-dashed rounded-[2rem] p-10 text-center transition-all duration-300
                      ${file
                        ? 'border-primary-500 bg-primary-50/30'
                        : 'border-slate-100 bg-slate-50 group-hover/upload:border-primary-300 group-hover/upload:bg-white'}
                    `}>
                      <UploadCloud size={32} className={`mx-auto mb-4 transition-transform duration-500 group-hover/upload:-translate-y-1 ${file ? 'text-primary-600' : 'text-slate-300'}`} />
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate px-4">
                        {file ? file.name : "Transmit PDF Module"}
                      </p>
                      <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mt-2">Max Payload: 10MB</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleUpload}
                  loading={uploading}
                  className="w-full py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary-600/20"
                  icon={ArrowRight}
                >
                  Initiate Upload
                </Button>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/5 rounded-full blur-2xl -mr-16 -mt-16" />
          </Card>

          <div className="bg-slate-950 p-10 rounded-[3rem] text-white relative overflow-hidden group">
              <div className="relative z-10">
                <Sparkles size={32} className="mb-6 text-primary-500" />
                <h3 className="font-black text-white text-lg mb-3 uppercase tracking-tight leading-none">AI Profile Indexing</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed mb-10">
                  Uploaded assets are automatically parsed by the AI-ATS engine to optimize your alignment with global mandates.
                </p>
                <div className="h-1 w-16 bg-primary-600 rounded-full" />
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl -mr-16 -mt-16" />
          </div>
        </div>

        {/* RIGHT: DOCUMENT REGISTRY */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between px-4 pb-4 border-b border-slate-50">
             <div className="flex items-center gap-4">
                <ShieldCheck size={20} className="text-primary-600" />
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900">Synchronized Registry</h2>
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Vault ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          </div>

          {resumes.length === 0 ? (
            <EmptyState
              title="Vault is Empty"
              description="No documents detected in your current secure storage. Upload your resume to begin applying for indexed mandates."
              icon={Layers}
            />
          ) : (
            <div className="space-y-4">
              {resumes.map((resume) => (
                <Card
                  key={resume._id}
                  hover
                  className="p-8 group flex flex-col md:flex-row md:items-center justify-between gap-8"
                >
                  <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-300 border border-slate-100 group-hover:bg-primary-50 group-hover:text-primary-600 group-hover:border-primary-200 transition-all duration-500 shadow-inner">
                      <FileText size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                         <Badge variant="primary" className="bg-primary-50 text-primary-700 text-[8px] border-none">Verified Asset</Badge>
                         <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase">
                            <Calendar size={12} />
                            {resume.uploadedAt ? new Date(resume.uploadedAt).toLocaleDateString("en-GB") : "Timestamp Unknown"}
                         </div>
                      </div>
                      <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tighter group-hover:text-primary-600 transition-colors leading-none mb-2">
                        {resume.title || "UNTITLED_MODULE"}
                      </h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{resume.filename}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewId(resume._id)}
                      className="px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all shadow-xl shadow-transparent group-hover:shadow-slate-200/50"
                      icon={Eye}
                    >
                      Inspect
                    </Button>
                    <button
                      onClick={() => handleDelete(resume._id)}
                      className="p-4 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
                      title="Purge Record"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="bg-primary-50 p-10 rounded-[3rem] border border-primary-100 flex gap-6 items-center group mt-10">
             <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-primary-600/10 group-hover:scale-110 transition-transform">
                <Info size={24} className="text-primary-600" />
             </div>
             <div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1">Asset Policy</h4>
                <p className="text-xs font-medium text-slate-600 leading-relaxed max-w-2xl">
                  You can maintain up to <span className="font-black text-primary-600">5 distinct asset profiles</span> within your vault. Use unique document designations to quickly switch between tailored submissions.
                </p>
             </div>
          </div>
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
