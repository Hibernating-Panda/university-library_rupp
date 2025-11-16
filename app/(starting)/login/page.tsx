"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { Eye, EyeOff} from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [show, setShow] = useState(false);

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
    interface SignInError {
      error: string;
      status: number;
      ok: boolean;
      url: string | null;
    }
    // next-auth handles redirect; if it returns, it's likely an error in credentials
    if (result && (result as SignInError).error) {
      setError((result as SignInError).error || "Invalid credentials");
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center px-4 text-black w-full">
      <form onSubmit={onSubmit} className="w-full max-w-lg space-y-4 border px-20 py-6 rounded-md bg-white">
        <Image
          src="/logo.png"
          alt="Logo"
          width={100}
          height={100}
          className="mx-auto my-20"
        />
        <h2 className="text-xl font-medium text-gray-800 mb-0 text-center">
          Welcome Back!
        </h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Sign in to continue to your Digital Library
        </p>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
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
        <button disabled={loading} className="w-full px-4 py-2 rounded-md bg-[#FA7C54] text-white disabled:opacity-60 hover:opacity-80 hover:cursor-pointer mt-4">
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
    </div>
  );
}

