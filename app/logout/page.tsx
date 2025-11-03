"use client";
import { signOut } from "next-auth/react";

export default function LogoutPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="px-4 py-2 rounded-md border border-red-500 text-red-600 hover:bg-red-50"
      >
        Log out
      </button>
    </div>
  );
}
