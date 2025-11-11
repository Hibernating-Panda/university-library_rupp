import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  return (
    <div className="flex-col sticky w-full">
      <div className="w-full flex h-full bg-[#F3F3F7] rounded-t-2xl text-[#4D4D4D]">
        <div className="w-full items-center justify-between flex h-1/8 bg-white rounded-t-2xl px-5">
          <Link href="/" className="flex items-center gap-2">
            <Image width={50} height={50} src="/logo.png" alt="Logo" />
            <p className="text-2xl font-bold text-[#FA7C54]">Library</p>
          </Link> 
          <div className="flex items-center gap-3">
            <Link href="/signup" className="px-4 py-2 rounded-md bg-[#FA7C54] text-white hover:opacity-80">Sign up</Link>
            <Link href="/login" className="px-4 py-2 rounded-md border border-zinc-300 hover:bg-zinc-100">Log in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
