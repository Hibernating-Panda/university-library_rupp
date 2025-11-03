"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    setLoading(true);
    setError(null);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/",
    });
    // next-auth handles redirect; if it returns, it's likely an error in credentials
    if (result && (result as any).error) {
      setError((result as any).error || "Invalid credentials");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-black">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 border p-6 rounded-md bg-white">
        <h1 className="text-xl font-semibold">Log in</h1>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <div className="space-y-1">
          <label className="text-sm">Email</label>
          <input name="email" type="email" className="w-full border rounded px-3 py-2" required />
        </div>
        <div className="space-y-1">
          <label className="text-sm">Password</label>
          <input name="password" type="password" className="w-full border rounded px-3 py-2" required />
        </div>
        <button disabled={loading} className="w-full px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-60">
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
    </div>
  );
}

