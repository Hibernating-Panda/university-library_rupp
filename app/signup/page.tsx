"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to sign up");
      }
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-black">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 border p-6 rounded-md bg-white">
        <h1 className="text-xl font-semibold">Create account</h1>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <div className="space-y-1">
          <label className="text-sm">Name</label>
          <input name="name" className="w-full border rounded px-3 py-2" required />
        </div>
        <div className="space-y-1">
          <label className="text-sm">Email</label>
          <input name="email" type="email" className="w-full border rounded px-3 py-2" required />
        </div>
        <div className="space-y-1">
          <label className="text-sm">Password</label>
          <input name="password" type="password" className="w-full border rounded px-3 py-2" required />
        </div>
        <button disabled={loading} className="w-full px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-60">
          {loading ? "Signing up..." : "Sign up"}
        </button>
      </form>
    </div>
  );
}
