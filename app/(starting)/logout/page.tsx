"use client";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function LogoutPage() {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center bg-[#F3F3F7] p-10 rounded-lg">
        <Image
          src="/logo.png"
          alt="Logo"
          width={100}
          height={100}
          className="mx-auto my-20"
        />
        <h1 className="text-2xl font-bold mb-4 text-[#4D4D4D]">Are you sure you want to log out?</h1>
        <p className="text-[#4D4D4D]">This action will log you out of your account.</p>
        <p className="text-[#4D4D4D]">But you already knew that.</p>
        <p className="text-[#4D4D4D]">:)</p>
        <div className="flex px-20 w-full justify-between mt-10">
          <Link href="/" className="px-4 py-2 rounded-md border border-gray-500 bg-white text-gray-600 hover:bg-gray-50 hover:cursor-pointer">Cancel</Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-4 py-2 rounded-md border border-red-500 bg-white text-red-600 hover:bg-red-50 hover:cursor-pointer"
          >
            Log out
          </button>
        </div>
      </div>
    </div> 
  );
}
