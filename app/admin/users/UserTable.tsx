"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Users, X, Trash2, Eye, Edit3 } from "lucide-react";

type Role = "ADMIN" | "STAFF" | "USER";

interface User {
  id: string; 
  name: string;
  email: string;
  studentId: string;
  role: Role;
  createdAt: string;
  profile?: string;
  bio?: string;
  major?: string;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  studentId: string;
  role: Role;
}

export default function UserTable({
  users,
}: {
  users: User[];
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "">("");

  // ✅ Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    studentId: "",
    role: "USER" as Role,
  });

  function resetForm() {
    setFormData({
      name: "",
      email: "",
      password: "",
      studentId: "",
      role: "USER",
    });
  }

  // ✅ Add user handler
  async function handleAddUser() {
    if (!formData.name || !formData.email || !formData.password || !formData.studentId) {
      setError("Please fill out all fields");
      return;
    }

    setError(null);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to add user");
      }

      setIsAddModalOpen(false);
      resetForm();
      router.refresh();
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Failed to add user");
    }
  }

  // ✅ Edit user handler (including role)
  async function handleEditUser() {
    if (!selectedUser?.id) return;
    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update user");
      }

      setIsEditModalOpen(false);
      resetForm();
      router.refresh();
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(error.message);
    }
  }

  // ✅ Delete user handler
  async function handleDeleteUser() {
    if (!selectedUser?.id) return;
    setBusyId(selectedUser.id);
    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete user");
      }
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      router.refresh();
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(error.message);
    } finally {
      setBusyId(null);
    }
  }

  // ✅ Search & filter (includes studentId)
  const filteredUsers = users.filter(
    (u) =>
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.studentId.toLowerCase().includes(search.toLowerCase())) &&
      (roleFilter === "" || u.role === roleFilter)
  );

  return (
    <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden text-gray-700">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <div className="flex space-x-2 w-full">
          <input
            type="text"
            placeholder="Search by name, email, or student ID..."
            className="w-full max-w-md px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as Role | "")}
            className="px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All</option>
            <option value="USER">User</option>
            <option value="STAFF">Staff</option>
          </select>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 text-nowrap"
        >
          + Add User
        </button>
      </div>

      {error && <p className="text-sm text-red-600 mb-3 px-4">{error}</p>}

      {/* Table */}
      <table className="min-w-full text-left">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-sm font-semibold">#</th>
            <th className="px-6 py-3 text-sm font-semibold">Student ID</th>
            <th className="px-6 py-3 text-sm font-semibold">Name</th>
            <th className="px-6 py-3 text-sm font-semibold">Email</th>
            <th className="px-6 py-3 text-sm font-semibold">Role</th>
            <th className="px-6 py-3 text-sm font-semibold">Created</th>
            <th className="px-6 py-3 text-sm font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((u, i) => (
              <tr key={u.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{i + 1}</td>
                <td className="px-6 py-4 text-sm">{u.studentId}</td>
                <td className="px-6 py-4 text-sm">{u.name}</td>
                <td className="px-6 py-4 text-sm">{u.email}</td>
                <td className="px-6 py-4 text-sm">{u.role}</td>
                <td className="px-6 py-4 text-sm">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedUser(u);
                      setIsViewModalOpen(true);
                    }}
                    className="px-3 py-1 border border-gray-400 rounded hover:bg-gray-100 flex items-center gap-1"
                  >
                    <Eye size={16} /> View
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(u);
                      setFormData({
                        name: u.name,
                        email: u.email,
                        password: "",
                        studentId: u.studentId,
                        role: u.role,
                      });
                      setIsEditModalOpen(true);
                    }}
                    className="px-3 py-1 border border-blue-500 text-blue-600 rounded hover:bg-blue-50 flex items-center gap-1"
                  >
                    <Edit3 size={16} /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(u);
                      setIsDeleteModalOpen(true);
                    }}
                    className="px-3 py-1 border border-red-500 text-red-600 rounded hover:bg-red-50 flex items-center gap-1"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-6 text-gray-500">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ Edit Modal */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b px-6 py-4 flex justify-between">
              <h2 className="text-xl font-bold">Edit User</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
              >
                <X size={16} />
              </button>
            </div>

            <div className="px-6 py-6 space-y-4">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Name"
                className="w-full px-4 py-3 border rounded-lg"
              />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email"
                className="w-full px-4 py-3 border rounded-lg"
              />
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                placeholder="Student ID"
                className="w-full px-4 py-3 border rounded-lg"
              />
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                className="w-full px-4 py-3 border rounded-lg"
              >
                <option value="USER">User</option>
                <option value="STAFF">Staff</option>
              </select>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="New Password (leave blank to keep current)"
                className="w-full px-4 py-3 border rounded-lg"
              />

            </div>

            <div className="border-t px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleEditUser}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ View Modal */}
      {isViewModalOpen && selectedUser && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => {
            setIsViewModalOpen(false);
            setSelectedUser(null);
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b border-black px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-700" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">View User</h2>
              </div>
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedUser(null);
                }}
                 className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-700" />
              </button>
            </div>
            {/* Main Content Card */}
            <div className="p-6">
              <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
                <div className="flex">
                  {/* Left Section - User Details */}
                  <div className="flex-1 p-6 space-y-4">
                    <div className="pb-4 border-b border-black">
                      <p className="text-gray-700">
                        <span className="font-medium">User ID : </span>
                        <span>{selectedUser.studentId}</span>
                      </p>
                    </div>
                    <div className="pb-4 border-b border-black">
                      <p className="text-gray-700">
                        <span className="font-medium">Name : </span>
                        <span>{selectedUser.name}</span>
                      </p>
                    </div>
                    <div className="pb-4 border-b border-black">
                      <p className="text-gray-700">
                        <span className="font-medium">Email : </span>
                        <span>{selectedUser.email}</span>
                      </p>
                    </div>
                    <div className="pb-4 border-b border-black">
                      <p className="text-gray-700">
                        <span className="font-medium">Role : </span>
                        <span>{selectedUser.role}</span>
                      </p>
                    </div>
                  </div>

                  {/* Vertical Divider */}
                  <div className="w-px bg-gray-300"></div>

                  {/* Right Section - Saved By */}
                  <div className="flex-1 p-6">
                    <div className="space-y-2">
                      <p className="text-gray-700 font-medium">Saved by :</p>
                      <p className="text-gray-700">Seng</p>
                      <p className="text-gray-600 text-sm">(Admin)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Footer - Close Button */}
            <div className="px-6 pb-6 flex justify-center">
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedUser(null);
                }}
                className="px-8 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-900 transition-colors w-full max-w-xs"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Delete Modal */}
      {isDeleteModalOpen && selectedUser && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center">
              <Trash2 className="mx-auto mb-3 text-red-600" size={40} />
              <h2 className="text-xl font-semibold mb-2">Delete User</h2>
              <p>Are you sure you want to delete this user?</p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={busyId === selectedUser.id}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-60"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Add User Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => {
            setIsAddModalOpen(false);
            resetForm();
          }}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Users className="w-6 h-6 text-gray-700" />
                <h2 className="text-2xl font-bold text-gray-800">Add User</h2>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  resetForm();
                }}
                className="w-8 h-8 rounded-lg border border-gray-400 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            {/* Form Content */}
            <div className="px-6 py-6 space-y-4">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Name"
                className="w-full px-4 py-3 border rounded-lg"
              />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email"
                className="w-full px-4 py-3 border rounded-lg"
              />
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                placeholder="Student ID"
                className="w-full px-4 py-3 border rounded-lg"
              />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Password"
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>

            {/* Action Buttons */}
            <div className="border-t px-6 py-4 flex items-center justify-end gap-4">
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  resetForm();
                }}
                className="px-6 py-2 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
