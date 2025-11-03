import Link from "next/link";

export default function StaffPage() {
  return (
    <div className="p-6">
      <div className="w-full flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Staff Dashboard</h1>
          <p className="text-sm text-zinc-600 mt-2">Manage library content.</p>
        </div>
        <Link href="/logout" className="px-4 py-2 rounded-md border border-red-500 text-red-600 hover:bg-red-50">Log out</Link>
      </div>
    </div>
  );
}
