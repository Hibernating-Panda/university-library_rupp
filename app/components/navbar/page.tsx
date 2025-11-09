"use client";

import { Clock, Calendar, ChevronDown, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const { data: session } = useSession();

  const user = session?.user;

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      // Format time: 09:00 AM
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, "0");
      setCurrentTime(`${displayHours}:${displayMinutes} ${ampm}`);

      // Format date: 4-MAR-2023
      const day = now.getDate();
      const monthNames = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ];
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
      <div className="flex items-center p-5 pl-15 justify-between w-full bg-[#F3F3F7]">

        <div></div>

        {/* Right: Date/Time + User */}
        <div className="flex items-center gap-4">
          {/* Date & Time */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 px-6 py-3 flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-5 h-5 text-red-500" />
              <span className="text-md font-medium">{currentTime}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-5 h-5 text-red-500" />
              <span className="text-md font-medium">{currentDate}</span>
            </div>
          </div>

          {/* User */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-1 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
            <span className="text-gray-700 font-medium">
              {user?.name || "Guest"}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
