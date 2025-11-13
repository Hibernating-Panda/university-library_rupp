import Image from 'next/image';
import prisma from "@/lib/prisma";
import Link from "next/link";
import UserTable from "./UserTable";
import { 
  LayoutDashboard,
  Users,
  LogOut,
  User as UserIcon,
  Clock,
  Calendar
} from "lucide-react";

export default async function AdminPage() {
  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  const currentTime = `${displayHour}:${minutes} ${ampm}`;

  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const currentDate = `${monthNames[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

  // ✅ Server-side Prisma fetch
  const users = await prisma.user.findMany({
    where: { role: { not: "ADMIN" }},
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" }
  });

  type User = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
};

  return (
    <div className="min-h-screen bg-gray-100 grid grid-cols-12">
      
      {/* ✅ Sidebar stays */}
      <div className="col-span-2 w-2/12 fixed left-0 top-0 h-screen bg-[#141414] text-white flex flex-col z-50">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Image width={50} height={50} src="/dark_logo.png" alt="Logo" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Library</h1>
              <p className="text-xs text-gray-400">MANAGEMENT</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-3xl p-1 flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="font-medium">Admin</span>
                <p className="text-sm text-gray-400">Admin</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            <li>
              <Link href="/admin" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 hover:text-white text-gray-400">
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/users" className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 text-white">
                <Users className="w-5 h-5" />
                <span>Users</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <Link href="/logout" className="flex items-center gap-3 p-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white">
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </Link>
        </div>
      </div>

      {/* ✅ Main Content */}
      <div className="col-span-10 col-start-3">

        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800">Users Management</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-gray-600">
              <Clock className="w-5 h-5" />
              <span className="text-sm">{currentTime}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Calendar className="w-5 h-5" />
              <span className="text-sm">{currentDate}</span>
            </div>
          </div>
        </div>

        {/* ✅ This passes server data into client table */}
        <div className="p-8 bg-gray-100 min-h-[calc(100vh-73px)]">
          <UserTable
            users={users.map((u: User) => ({
              ...u,
              createdAt: u.createdAt.toISOString(),
            }))}
          />
        </div>
      </div>
    </div>
  );
}
