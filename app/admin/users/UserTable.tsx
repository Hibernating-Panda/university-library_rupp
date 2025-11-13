"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Role = "ADMIN" | "STAFF" | "USER";

export default function UserTable({
  users,
}: {
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: Role;
    createdAt: string;
  }>;
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ✅ SEARCH STATE
  const [search, setSearch] = useState("");

  async function setRole(id: string, role: Exclude<Role, "ADMIN">) {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update role");
      }

      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to update role");
    } finally {
      setBusyId(null);
    }
  }

  async function removeUser(id: string) {
    if (!confirm("Remove this user?")) return;

    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to remove user");
      }

      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to remove user");
    } finally {
      setBusyId(null);
    }
  }

  // ✅ Filter users by search
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">

      {/* ✅ SEARCH BAR */}
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center text-gray-600">
        <input
          type="text"
          placeholder="Search users by name or email..."
          className="w-full max-w-xs px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      <table className="min-w-full text-left">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Created</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((u, i) => (
            <tr key={u.id} className="border-b last:border-0">
              <td className="px-6 py-4 text-sm text-gray-800">{i + 1}</td>
              <td className="px-6 py-4 text-sm text-gray-800">{u.name}</td>
              <td className="px-6 py-4 text-sm text-gray-800">{u.email}</td>
              <td className="px-6 py-4 text-sm text-gray-800">{u.role}</td>
              <td className="px-6 py-4 text-sm text-gray-800">
                {new Date(u.createdAt).toLocaleString()}
              </td>

              <td className="px-4 py-2 space-x-2">
                {u.role === "STAFF" ? (
                  <button
                    disabled={busyId === u.id}
                    onClick={() => setRole(u.id, "USER")}
                    className="px-3 py-1 rounded border border-green-500 text-green-600 hover:bg-green-50 disabled:opacity-60 cursor-pointer"
                  >
                    Set User
                  </button>
                ) : (
                  <button
                    disabled={busyId === u.id}
                    onClick={() => setRole(u.id, "STAFF")}
                    className="px-3 py-1 rounded border border-green-500 text-green-600 hover:bg-green-50 disabled:opacity-60 cursor-pointer"
                  >
                    Set Staff
                  </button>
                )}

                <button
                  disabled={busyId === u.id}
                  onClick={() => removeUser(u.id)}
                  className="px-3 py-1 rounded border border-red-500 text-red-600 hover:bg-red-50 disabled:opacity-60 cursor-pointer"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}

          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-zinc-500 text-center">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
