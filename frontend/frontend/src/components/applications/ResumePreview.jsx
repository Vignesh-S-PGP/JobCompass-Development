import { FileText, Eye } from "lucide-react";
import ResumePreviewModal from "../../pages/jobseeker/ResumePreviewModal";
import { useState } from "react";

export default function ResumePreview({ resume }) {

  const [open,setOpen] = useState(false);

  return(

    <div className="bg-white border rounded-xl p-6">

      <h3 className="text-sm font-semibold text-slate-900 mb-4">
        Resume
      </h3>

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">

            <FileText size={18} className="text-slate-500"/>

          </div>

          <div>

            <p className="text-sm font-medium text-slate-900">
              {resume.title || resume.filename}
            </p>

            <p className="text-xs text-slate-400">
              Uploaded Resume
            </p>

          </div>

        </div>

        <button
          onClick={()=>setOpen(true)}
          className="flex items-center gap-1 text-sm text-indigo-600 hover:underline"
        >

          <Eye size={16}/>
          Preview

        </button>

      </div>

      {open && (

        <ResumePreviewModal
          resumeId={resume._id}
          onClose={()=>setOpen(false)}
        />

      )}

    </div>

  );

}