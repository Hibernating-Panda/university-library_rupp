"use client";
import Image from 'next/image';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  LogOut, 
  User as UserIcon,
  Clock,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AdminPages() {
const pathname = usePathname();
const [currentTime, setCurrentTime] = useState("");
const [currentDate, setCurrentDate] = useState("");
const { data: session } = useSession();
const [profileImage, setProfileImage] = useState("/default-avatar.png");
const [totalUsers, setTotalUsers] = useState(0);
const [totalBooks, setTotalBooks] = useState(0);
const [bookStatus, setBookStatus] = useState({
  totalBooks: 0,
  borrowed: 0,
  available: 0
});

// Load profile data on component mount
useEffect(() => {
  const loadProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      setProfileImage(data.profile || "/default-avatar.png");
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  };

  loadProfile();
}, []);

interface StaffType {
  id: number;
  name: string;
  email: string;
}
const [staff, setStaff] = useState<StaffType[]>([]);


useEffect(() => {
  fetch("/api/user/total_user")
    .then(res => res.json())
    .then(data => setTotalUsers(data.totalUsers));

  fetch("/api/books/total_book")
    .then(res => res.json())
    .then(data => setTotalBooks(data.totalBooks));

  fetch("/api/books/book_status")
    .then(res => res.json())
    .then(data => setBookStatus(data));

    fetch("/api/staff")
    .then(res => res.json())
    .then(data => setStaff(data));
}, []);

const user = session?.user;
useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, "0");
      setCurrentTime(`${displayHours}:${displayMinutes} ${ampm}`);

      const day = now.getDate();
      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      const month = monthNames[now.getMonth()];
      const year = now.getFullYear();
      setCurrentDate(`${month} ${day.toString().padStart(2, "0")}, ${year}`);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Pie chart data - borrowed vs returned
  const total = bookStatus.totalBooks;
  const borrowed = bookStatus.borrowed;
  const available = bookStatus.available;
  const borrowedPercentage = (borrowed / total) * 100;
  const availablePercentage = (available / total) * 100;

  // Calculate pie chart segments
  const radius = 80;
  
  // Calculate angles for SVG path
  const borrowedAngle = (borrowedPercentage / 100) * 360;
  const availableAngle = (availablePercentage / 100) * 360;
  
  // Helper function to create SVG arc path
  const createArc = (startAngle: number, endAngle: number, radius: number) => {
    const start = (startAngle - 90) * (Math.PI / 180);
    const end = (endAngle - 90) * (Math.PI / 180);
    const x1 = 100 + radius * Math.cos(start);
    const y1 = 100 + radius * Math.sin(start);
    const x2 = 100 + radius * Math.cos(end);
    const y2 = 100 + radius * Math.sin(end);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M 100 100 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };
  
  const borrowedPath = createArc(0, borrowedAngle, radius);
  const availablePath = createArc(borrowedAngle, borrowedAngle + availableAngle, radius);

  return (
    <div className="min-h-screen bg-gray-100 grid grid-cols-12">
      {/* Sidebar - Fixed */}
      <div className="col-span-2 w-2/12 col-end-2 fixed left-0 top-0 h-screen bg-[#141414] text-white flex flex-col z-50">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Image width={100} height={100} src="/dark_logo.png" alt="Logo" className="" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Library</h1>
              <p className="text-xs text-gray-400">MANAGEMENT</p>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Link href="/admin/profile" className="rounded-3xl shadow-sm p-1 flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <Image
              src={profileImage}
              alt="Profile"
              width={100}
              height={100}
              className="rounded-full border-2 border-orange-200 object-cover max-w-10 max-h-10"
            />
            </div>
            <div>
                <span className="font-medium">
                {user?.name || "Admin"}
                </span>
                <p className="text-sm text-gray-400">Admin</p>
            </div>
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            <li>
              <Link 
                href="/admin" 
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    pathname === "/admin" 
                      ? "bg-gray-800 text-white" 
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/users" 
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    pathname === "/admin/users" 
                      ? "bg-gray-800 text-white" 
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
              >
                <Users className="w-5 h-5" />
                <span>Users</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Log Out */}
        <div className="p-4 border-t border-gray-800">
          <Link href="/logout" className="flex items-center gap-3 p-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors w-full">
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      {/* Main Content - with left margin for sidebar */}
      <div className="col-span-10 col-start-3">
        {/* Header - Sticky */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
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

        {/* Main Content Area - Scrollable */}
        <div className="p-8 bg-gray-100 min-h-[calc(100vh-73px)]">
          {/* Metrics Cards */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-2">Total User Base</p>
                  <p className="text-3xl font-bold text-gray-800">{totalUsers}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-2">Book Count</p>
                  <p className="text-3xl font-bold text-gray-800">{totalBooks}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-2">Book Quantity</p>
                  <p className="text-3xl font-bold text-gray-800">{total}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

          </div>

          {/* Charts and Lists */}
          <div className="grid grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Book Status</h3>
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
                    {/* Borrowed Books - Dark Gray */}
                    <path
                      d={borrowedPath}
                      fill="#374151"
                    />
                    {/* Available Books - Light Gray */}
                    <path
                      d={availablePath}
                      fill="#9ca3af"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center transform">
                      <p className="text-2xl font-bold text-white">{total}</p>
                      <p className="text-sm text-white">Total</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-700"></div>
                  <span className="text-sm text-gray-600">Total Borrowed Books: {bookStatus.borrowed}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                  <span className="text-sm text-gray-600">Total Available Books: {bookStatus.available}</span>
                </div>
              </div>
            </div>

            {/* Overdue Borrowers */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">All Staff</h3>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
                {staff.map((s, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-800">{s.name}</p>
                        <p className="text-xs text-gray-500">{s.email}</p>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}
