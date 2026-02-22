import { FileText, Eye, Download } from "lucide-react";
import ResumePreviewModal from "../../pages/jobseeker/ResumePreviewModal";
import { useState } from "react";

export default function ResumePreview({ resume }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
        <div className="w-1 h-3 bg-indigo-600 rounded-full" />
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Asset Control</h2>
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white">
            <FileText size={18} />
          </div>
          <div className="truncate">
            <p className="text-xs font-black text-slate-900 truncate uppercase tracking-tight">
              {resume.title || resume.filename}
            </p>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Document Portal</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => setOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
          >
            <Eye size={14} /> Open Document
          </button>
          <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-slate-500 hover:bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-100 transition-all">
            <Download size={14} /> Download
          </button>
        </div>
      </div>

      {open && (
        <ResumePreviewModal
          resumeId={resume._id}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}