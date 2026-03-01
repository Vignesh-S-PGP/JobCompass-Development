import { useState, useEffect } from "react";
import api from "../../services/api";
import { Trash2, UserX, UserCheck, ShieldCheck, Filter, Search, MoreHorizontal, UserCircle, Mail, ShieldAlert } from "lucide-react";
import { ListSkeleton } from "../../components/ui/Skeleton";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Input from "../../components/ui/Input";
import EmptyState from "../../components/ui/EmptyState";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        filter ? `/admin/users?role=${filter}` : "/admin/users"
      );
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (userId, currentStatus) => {
    try {
      await api.patch(`/admin/users/${userId}/status`, {
        isActive: !currentStatus,
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action is permanent.")) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <ListSkeleton />;

  const getRoleVariant = (role) => {
    const map = { admin: "danger", recruiter: "primary", job_seeker: "success" };
    return map[role] || "default";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 pb-10 border-b border-slate-100">
         <div>
            <Badge variant="danger" className="mb-4">Governance Control</Badge>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              User <span className="text-primary-600">Nodes</span>.
            </h1>
            <p className="text-slate-500 font-medium text-lg mt-4 max-w-xl">
              Manage platform access and verify professional identities within the ecosystem.
            </p>
         </div>

         <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:max-w-xl">
            <div className="flex-1 w-full">
               <Input
                 icon={Search}
                 placeholder="Search by email..."
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="py-4 shadow-xl shadow-slate-200/50"
               />
            </div>
            <div className="relative w-full sm:w-auto">
               <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-600">
                  <Filter size={18} />
               </div>
               <select
                 value={filter}
                 onChange={(e) => setFilter(e.target.value)}
                 className="w-full sm:w-auto bg-white border border-slate-200 rounded-2xl pl-12 pr-10 py-4 text-[10px] font-black uppercase tracking-widest outline-none shadow-xl shadow-slate-200/50 appearance-none cursor-pointer hover:border-primary-600 transition-colors"
               >
                 <option value="">Global Roles</option>
                 <option value="job_seeker">Professionals</option>
                 <option value="recruiter">Recruiters</option>
                 <option value="admin">Admins</option>
               </select>
            </div>
         </div>
      </div>

      {filteredUsers.length === 0 ? (
        <EmptyState
           title="No identities located"
           description="We couldn't find any user nodes matching your current filter parameters."
           actionLabel="Reset Filters"
           onAction={() => { setFilter(""); setSearch(""); }}
        />
      ) : (
        <Card className="overflow-hidden border-none shadow-2xl rounded-[2.5rem]">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 text-white">
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Node Identity</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Security Clearance</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Operational Status</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 text-right">Mandates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="group hover:bg-slate-50/80 transition-all duration-300">
                    <td className="px-10 py-6">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-slate-200 group-hover:border-primary-600 group-hover:text-primary-600 transition-all shadow-sm">
                             <UserCircle size={24} />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-sm font-black text-slate-900 tracking-tight">{u.email}</span>
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {u._id.slice(-8)}</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-10 py-6">
                       <Badge variant={getRoleVariant(u.role)} className="px-4 py-1.5 rounded-xl border-none shadow-sm font-black uppercase tracking-widest text-[9px]">
                          {u.role.replace('_', ' ')}
                       </Badge>
                    </td>
                    <td className="px-10 py-6">
                       <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${u.isActive ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${u.isActive ? "text-emerald-600" : "text-rose-600"}`}>
                             {u.isActive ? "Operational" : "Deactivated"}
                          </span>
                       </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                       <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                          <Button
                            variant="outline"
                            onClick={() => toggleStatus(u._id, u.isActive)}
                            className={`p-3 rounded-xl border-none ${u.isActive ? "bg-rose-50 text-rose-600 hover:bg-rose-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"}`}
                            title={u.isActive ? "Deactivate Node" : "Reactivate Node"}
                          >
                            {u.isActive ? <UserX size={18} /> : <UserCheck size={18} />}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => deleteUser(u._id)}
                            className="p-3 rounded-xl border-none bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all"
                            title="Purge Record"
                          >
                            <Trash2 size={18} />
                          </Button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ADMIN GOVERNANCE SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12">
         <Card className="p-10 bg-slate-950 text-white relative overflow-hidden group">
            <div className="relative z-10">
               <ShieldAlert size={40} className="text-rose-500 mb-6 group-hover:scale-110 transition-transform duration-500" />
               <h3 className="text-xl font-black uppercase tracking-tight mb-4">Identity Verification</h3>
               <p className="text-xs font-medium text-slate-400 mb-8 leading-relaxed uppercase tracking-widest">Perform system-wide audits of professional identities and security credentials.</p>
               <Button variant="danger" className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">Execute System Audit</Button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl -mr-16 -mt-16" />
         </Card>

         <Card className="p-10 border-2 border-slate-900 group">
            <ShieldCheck size={40} className="text-primary-600 mb-6 group-hover:scale-110 transition-transform duration-500" />
            <h3 className="text-xl font-black uppercase tracking-tight mb-4 text-slate-900">Access Management</h3>
            <p className="text-xs font-medium text-slate-500 mb-8 leading-relaxed uppercase tracking-widest">Adjust platform clearance levels and manage administrative permissions.</p>
            <Button className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">Configure Clearance</Button>
         </Card>
      </div>
    </div>
  );
}
