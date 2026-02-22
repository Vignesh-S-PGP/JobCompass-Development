import { useEffect, useState } from "react";
import api from "../../services/api";
import { Trash2, User, Mail, Shield, Calendar } from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    api.get("/admin/users").then(res => {
      setUsers(res.data.users);
      setLoading(false);
    });
  };

  const deleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      api.delete(`/admin/users/${id}`).then(() => fetchUsers());
    }
  };

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">User Directory.</h1>
          <p className="text-slate-500 font-bold mt-2">Manage all registered accounts</p>
        </div>
        <div className="bg-slate-900 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest">
          {users.length} Registered
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <th className="px-8 py-6">User Identity</th>
              <th className="px-8 py-6">Role</th>
              <th className="px-8 py-6">Joined Date</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map(u => (
              <tr key={u._id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-black text-slate-900">{u.email.split('@')[0]}</p>
                      <p className="text-xs font-bold text-slate-400 flex items-center gap-1">
                        <Mail size={12} /> {u.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    u.role === 'admin' ? 'bg-indigo-100 text-indigo-600' :
                    u.role === 'recruiter' ? 'bg-emerald-100 text-emerald-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
                    <Calendar size={14} className="text-slate-300" />
                    {new Date(u.createdAt).toLocaleDateString()}
                  </p>
                </td>
                <td className="px-8 py-6 text-right">
                  {u.role !== 'admin' && (
                    <button
                      onClick={() => deleteUser(u._id)}
                      className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
