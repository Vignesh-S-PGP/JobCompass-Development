import { useState, useEffect } from "react";
import api from "../../services/api";
import { Trash2, UserX, UserCheck } from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    try {
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
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <p className="text-center text-slate-500">Loading users...</p>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold">User Management</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-4 py-2 outline-none"
        >
          <option value="">All Roles</option>
          <option value="job_seeker">Job Seekers</option>
          <option value="recruiter">Recruiters</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-gray-600">Email</th>
              <th className="px-6 py-4 text-gray-600">Role</th>
              <th className="px-6 py-4 text-gray-600">Status</th>
              <th className="px-6 py-4 text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{u.email}</td>
                <td className="px-6 py-4 capitalize">{u.role}</td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs font-bold ${
                      u.isActive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {u.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => toggleStatus(u._id, u.isActive)}
                    className="p-2 rounded hover:bg-gray-100"
                  >
                    {u.isActive ? (
                      <UserX size={16} />
                    ) : (
                      <UserCheck size={16} />
                    )}
                  </button>
                  <button
                    onClick={() => deleteUser(u._id)}
                    className="p-2 rounded hover:bg-red-50 text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}