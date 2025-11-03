"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Role = "ADMIN" | "STAFF" | "USER";

export default function UserTable({ users }: { users: Array<{ id: string; name: string; email: string; role: Role; createdAt: string | Date }> }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    } catch (e: any) {
      setError(e.message || "Failed to update role");
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
    } catch (e: any) {
      setError(e.message || "Failed to remove user");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mt-6 overflow-x-auto">
      {error ? <p className="text-sm text-red-600 mb-3">{error}</p> : null}
      <table className="min-w-full text-left text-sm">
        <thead className="border-b bg-zinc-50 text-black">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Created</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b last:border-0">
              <td className="px-4 py-2">{u.name}</td>
              <td className="px-4 py-2">{u.email}</td>
              <td className="px-4 py-2">{u.role}</td>
              <td className="px-4 py-2">{new Date(u.createdAt).toLocaleString()}</td>
              <td className="px-4 py-2 space-x-2">
                {u.role === "STAFF" ? (
                  <button
                    disabled={busyId === u.id}
                    onClick={() => setRole(u.id, "USER")}
                    className="px-3 py-1 rounded border border-zinc-300 hover:bg-zinc-50 disabled:opacity-60"
                  >
                    Set User
                  </button>
                ) : (
                  <button
                    disabled={busyId === u.id}
                    onClick={() => setRole(u.id, "STAFF")}
                    className="px-3 py-1 rounded border border-zinc-300 hover:bg-zinc-50 disabled:opacity-60"
                  >
                    Set Staff
                  </button>
                )}
                <button
                  disabled={busyId === u.id}
                  onClick={() => removeUser(u.id)}
                  className="px-3 py-1 rounded border border-red-500 text-red-600 hover:bg-red-50 disabled:opacity-60"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-zinc-500" colSpan={5}>No users found.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
