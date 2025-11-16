"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { User as UserIcon } from "lucide-react";
import { BookOpen } from "lucide-react";

interface StaffType {
  id: number;
  name: string;
  email: string;
  profile?: string;
}

export default function ClientHome() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBooks, setTotalBooks] = useState(0);
  const [staff, setStaff] = useState<StaffType[]>([]);
  const [bookStatus, setBookStatus] = useState({
    totalBooks: 0,
    borrowed: 0,
    available: 0
  });

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

  // Pie chart calculations
  const total = bookStatus.totalBooks;
  const borrowed = bookStatus.borrowed;
  const available = bookStatus.available;

  const borrowedPercentage = total ? (borrowed / total) * 100 : 0;
  const availablePercentage = total ? (available / total) * 100 : 0;

  const radius = 80;
  const createArc = (startAngle: number, endAngle: number) => {
    const start = (startAngle - 90) * (Math.PI / 180);
    const end = (endAngle - 90) * (Math.PI / 180);

    const x1 = 100 + radius * Math.cos(start);
    const y1 = 100 + radius * Math.sin(start);
    const x2 = 100 + radius * Math.cos(end);
    const y2 = 100 + radius * Math.sin(end);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M 100 100 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  const borrowedAngle = (borrowedPercentage / 100) * 360;
  const availableAngle = (availablePercentage / 100) * 360;

  const borrowedPath = createArc(0, borrowedAngle);
  const availablePath = createArc(borrowedAngle, borrowedAngle + availableAngle);

  return (
    <div className="grid grid-cols-12 pr-5 pl-1 pt-27 min-h-screen">
      <div className="col-span-10 col-start-3 z-20 bg-[#F3F3F7] h-full">
      <div className="p-10 grid grid-cols-2 gap-6">
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
         
        <div className="bg-white rounded-lg shadow-sm z-50 p-3">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Book Status</h3>
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg width="200" height="200" viewBox="0 0 200 200" className="-rotate-90">
              <path d={borrowedPath} fill="#EC2C5A" />
              <path d={availablePath} fill="#FA7C54" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-center">
              <p className="text-xl font-bold text-gray-800">{total}</p>
              <p className="text-xs text-gray-600">Total</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-4">
          <span className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-4 h-4 rounded-full bg-[#EC2C5A]"></span>
            Borrowed: {borrowed}
          </span>
          <span className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-4 h-4 rounded-full bg-[#FA7C54]"></span>
            Available: {available}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">All Staff</h3>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {staff.map((s, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  {s.profile ? (
                    <Image
                      src={s.profile}
                      alt="Profile"
                      width={1000}
                      height={1000}
                      unoptimized
                      className="max-w-8 max-h-8 rounded-full"
                    />
                  ) : (
                    <UserIcon className="w-4 h-4 text-gray-600" />
                  )}
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
  );
}
