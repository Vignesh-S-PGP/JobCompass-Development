import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  ArrowLeft,
  MessageSquare,
  User,
  FileSearch,
  XCircle,
} from "lucide-react";

/* ================= Resume Review Modal ================= */

function ResumeReviewModal({ app, onClose, onUpdateStatus }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!app) return;

    const resumeId = app.resumeId || app.resume?._id;
    if (!resumeId) {
      setError("Resume not found");
      return;
    }

    let objectUrl;

    api
      .get(`/resumes/view/${resumeId}`, { responseType: "blob" })
      .then((res) => {
        const blob = new Blob([res.data], { type: "application/pdf" });
        objectUrl = URL.createObjectURL(blob);
        setPdfUrl(objectUrl);
      })
      .catch(() => setError("Unable to load resume"));

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [app]);

  if (!app) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-5xl h-[85vh] rounded-3xl flex overflow-hidden shadow-xl">
        <div className="flex-1 bg-slate-100">
          {error ? (
            <div className="h-full flex items-center justify-center text-red-500">
              {error}
            </div>
          ) : pdfUrl ? (
            <iframe src={pdfUrl} className="w-full h-full" title="Resume" />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
              Loading resume…
            </div>
          )}
        </div>

        <div className="w-[360px] p-6 border-l flex flex-col">
          <h2 className="text-xl font-black mb-4">ATS Review</h2>
          <div className="text-5xl font-black text-indigo-600 mb-6">
            {app.atsScore}%
          </div>

          <div className="mt-auto space-y-3">
            <button
              onClick={() => onUpdateStatus(app.applicationId, "shortlisted")}
              className="w-full py-3 bg-emerald-600 text-white rounded-xl font-black"
            >
              Shortlist
            </button>
            <button
              onClick={() => onUpdateStatus(app.applicationId, "rejected")}
              className="w-full py-3 bg-rose-600 text-white rounded-xl font-black"
            >
              Reject
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 border rounded-xl font-bold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= Applicants Page ================= */

export default function Applicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    if (!jobId) return;

    api
      .get(`/applications/job/${jobId}`)
      .then((res) => setApps(res.data.applications || []))
      .finally(() => setLoading(false));
  }, [jobId]);

  const startChat = async (applicationId) => {
    const res = await api.post("/chat/start", { applicationId });
    navigate(`/recruiter/chat/${res.data.conversationId}`);
  };

  const updateStatus = async (applicationId, status) => {
    await api.patch(`/applications/${applicationId}/status`, { status });

    setApps((prev) =>
      prev.map((a) =>
        a.applicationId === applicationId ? { ...a, status } : a
      )
    );

    setSelectedApp((prev) =>
      prev?.applicationId === applicationId ? { ...prev, status } : prev
    );
  };

  if (loading) {
    return <p className="p-10 text-center">Loading applicants…</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 border rounded-xl">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-black">Applicants</h1>
      </div>

      {apps.map((a) => (
        <div
          key={a.applicationId}
          className="bg-white p-6 rounded-3xl border flex justify-between items-center"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <User />
            </div>
            <div>
              <p className="font-black">
                {a.user?.fullName || "Candidate"}
              </p>
              <p className="text-sm text-slate-400">
                ATS: {a.atsScore}%
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => startChat(a.applicationId)}
              className="p-3 bg-slate-100 rounded-xl"
            >
              <MessageSquare size={18} />
            </button>
            <button
              onClick={() => setSelectedApp(a)}
              className="px-5 py-3 bg-slate-900 text-white rounded-xl font-black"
            >
              <FileSearch size={18} />
            </button>
          </div>
        </div>
      ))}

      {selectedApp && (
        <ResumeReviewModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
          onUpdateStatus={updateStatus}
        />
      )}
    </div>
  );
}