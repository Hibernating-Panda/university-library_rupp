"use client";

import { Clock, Calendar, User } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function StaffNavbar() {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [user, setUser] = useState(null);

  // 🔥 Fetch user from the SAME /api/profile endpoint
  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/user/profile");
      if (!res.ok) return;

      const data = await res.json();
      setUser(data);
    }

    fetchUser();
  }, []);

  // Time & Date
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
      const monthNames = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
      const month = monthNames[now.getMonth()];
      const year = now.getFullYear();
      setCurrentDate(`${day}-${month}-${year}`);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pt-5 mr-5 flex items-center justify-between fixed top-0 right-0 w-10/12 z-50 bg-gradient-to-br from-[#FA7C54] to-[#EC2C5A]">
      <div className="flex items-center p-5 justify-between w-full bg-[#F3F3F7]">

        <div></div>

        <div className="flex items-center gap-4">

          {/* TIME & DATE */}
          <div className="bg-white rounded-3xl shadow-sm border px-6 py-3 flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-5 h-5 text-red-500" />
              <span>{currentTime}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-5 h-5 text-red-500" />
              <span>{currentDate}</span>
            </div>
          </div>

          {/* USER PROFILE */}
          <Link href="/staff/profile" className="cursor-pointer bg-white rounded-3xl shadow-sm border p-1 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
              {user?.profile ? (
                <Image
                  src={user.profile}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-gray-600" />
              )}
            </div>

            <span className="text-gray-700 font-medium pr-3">
              {user?.name || "Guest"}
            </span>
          </Link>

        </div>
      </div>
    </div>
  );
}
