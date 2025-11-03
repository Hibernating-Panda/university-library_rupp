import prisma from "@/lib/prisma";
import Link from "next/link";
import UserTable from "./UserTable";

export default async function AdminPage() {
  const users: Array<{
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "STAFF" | "USER";
    createdAt: Date;
  }> = await prisma.user.findMany({
    where: { role: { not: "ADMIN" } },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <div className="w-full flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-zinc-600 mt-2">All non-admin accounts</p>
        </div>
        <Link href="/logout" className="px-4 py-2 rounded-md border border-red-500 text-red-600 hover:bg-red-50">Log out</Link>
      </div>

      <UserTable users={users.map(u => ({ ...u, createdAt: u.createdAt }))} />
    </div>
  );
}
