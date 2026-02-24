import { useState, useEffect } from "react"
import api from "../../services/api"
import { Shield, Trash2, UserX, UserCheck, Mail } from "lucide-react"

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [filter])

  const fetchUsers = async () => {
    try {
      const res = await api.get(`/admin/users?role=${filter}`)
      setUsers(res.data.users)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = async (userId, currentStatus) => {
    try {
      await api.patch(`/admin/users/${userId}/status`, {
        isActive: !currentStatus
      })
      fetchUsers()
    } catch (err) {
      console.error(err)
    }
  }

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This will be a soft delete.")) return
    try {
      await api.delete(`/admin/users/${userId}`)
      fetchUsers()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold">User Management</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
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
              <th className="px-6 py-4 font-semibold text-gray-600">User</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Role</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Created At</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                      {user.email[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{user.email}</p>
                      <p className="text-xs text-gray-400">ID: {user._id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === "admin" ? "bg-red-100 text-red-600" :
                    user.role === "recruiter" ? "bg-blue-100 text-blue-600" :
                    "bg-green-100 text-green-600"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${user.isActive ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}`}>
                    {user.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleStatus(user._id, user.isActive)}
                      className={`p-2 rounded-lg hover:bg-gray-100 ${user.isActive ? "text-amber-500" : "text-green-500"}`}
                      title={user.isActive ? "Deactivate" : "Activate"}
                    >
                      {user.isActive ? <UserX size={18} /> : <UserCheck size={18} />}
                    </button>
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                      title="Delete"
                    >
                      <Trash2 size={18} />
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
}
