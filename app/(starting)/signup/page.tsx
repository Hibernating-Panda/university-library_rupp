"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter(); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

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
    <div className="flex items-center justify-center px-4 text-black w-full">
      <form onSubmit={onSubmit} className="w-full max-w-lg space-y-4 border px-20 py-2 rounded-md bg-white">
        <Image
          src="/logo.png"
          alt="Logo"
          width={100}
          height={100}
          className="mx-auto my-10"
        />
        <h2 className="text-xl font-medium text-gray-800 mb-0 text-center">
          Sign Up
        </h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Sign up to continue to your Digital Library
        </p>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input name="name" className="w-full border rounded px-3 py-2" required />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input name="email" type="email" className="w-full border rounded px-3 py-2" required />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative w-full">
            <input name="password" type={show ? "text" : "password"} className="w-full border rounded px-3 py-2" required />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#FA7C54] hover:opacity-80 hover:cursor-pointer"
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <div className="relative w-full">
            <input name="confirmPassword" type={show1 ? "text" : "password"} className="w-full border rounded px-3 py-2" required />
            <button
              type="button"
              onClick={() => setShow1(!show1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#FA7C54] hover:opacity-80 hover:cursor-pointer"
            >
              {show1 ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <button disabled={loading} className="w-full px-4 py-2 rounded-md bg-[#FA7C54] text-white disabled:opacity-60 hover:opacity-80 hover:cursor-pointer mt-4">
          {loading ? "Signing up..." : "Sign up"}
        </button>
        <p className="text-sm text-gray-500">
          Already have an account? <Link href="/login" className="text-[#FA7C54] hover:opacity-80 underline">Login Here</Link>
        </p>
      </form>
    </div>
  );
}
