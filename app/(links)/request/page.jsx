"use client";
import Image from 'next/image';
import { useEffect, useState, useMemo } from "react";

export default function UserRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const filteredRequests = useMemo(() => {
    const q = query.toLowerCase();
    return requests.filter((req) => {
      const book = req.book;
      return (
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        (book.category || "").toLowerCase().includes(q)
      );
    });
  }, [query, requests]);

  useEffect(() => {
    let isMounted = true;

    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/user/requests");
        const data = await res.json();
        if (isMounted) {
          setRequests(data);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching requests:", error);
          setLoading(false);
        }
      }
    };

    fetchRequests();
    const interval = setInterval(fetchRequests, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen w-full grid grid-cols-12 pr-5 absolute text-black">
        <div className="fixed top-8 left-70 w-full z-50 flex justify-start">
            <div className="ml-5 mt-3 w-1/4">
                <div className="flex items-center w-full bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between w-full px-4 py-2 text-[#F76B56]">
                    <input
                    type="text"
                    placeholder="Search"
                    className="outline-none text-gray-700 w-full"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    />
                    <svg
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path
                        d="M15.2375 16.5792L9.87083 11.2125C9.39167 11.5958 8.84062 11.8993 8.21771 12.1229C7.59479 12.3465 6.93194 12.4583 6.22917 12.4583C4.48819 12.4583 3.01492 11.8555 1.80933 10.65C0.603111 9.44374 0 7.97014 0 6.22917C0 4.48819 0.603111 3.0146 1.80933 1.80838C3.01492 0.602792 4.48819 0 6.22917 0C7.97014 0 9.44374 0.602792 10.65 1.80838C11.8555 3.0146 12.4583 4.48819 12.4583 6.22917C12.4583 6.93194 12.3465 7.59479 12.1229 8.21771C11.8993 8.84062 11.5958 9.39167 11.2125 9.87083L16.6031 15.2615C16.7788 15.4372 16.8667 15.6528 16.8667 15.9083C16.8667 16.1639 16.7708 16.3875 16.5792 16.5792C16.4035 16.7549 16.1799 16.8427 15.9083 16.8427C15.6368 16.8427 15.4132 16.7549 15.2375 16.5792ZM6.22917 10.5417C7.42708 10.5417 8.44547 10.1226 9.28433 9.28433C10.1226 8.44547 10.5417 7.42708 10.5417 6.22917C10.5417 5.03125 10.1226 4.01286 9.28433 3.174C8.44547 2.33578 7.42708 1.91667 6.22917 1.91667C5.03125 1.91667 4.01286 2.33578 3.174 3.174C2.33578 4.01286 1.91667 5.03125 1.91667 6.22917C1.91667 7.42708 2.33578 8.44547 3.174 9.28433C4.01286 10.1226 5.03125 10.5417 6.22917 10.5417Z"
                        fill="currentColor"
                    />
                    </svg>
                </div>
                </div>
            </div>
            </div>
      <div className="col-start-3 col-span-10 z-20 mt-20 pt-10 px-10 bg-[#F3F3F7]">
    <div className="w-full p-4">
      <h1 className="text-xl font-semibold mb-4 text-[#F76B56]">Borrow Requests</h1>
      <div className="grid grid-cols-6 px-6 text-[#4D4D4D] font-semibold text-lg text-center">
            <p className="text-left">Cover</p>
            <p>Title</p>
            <p>Author</p>
            <p>Category</p>
            <p>Status</p>
            <p>Requested Date</p>
          </div>

      {filteredRequests.map((req) => {
        let statusColor = "text-gray-600";

        switch (req.status) {
          case "PENDING":
            statusColor = "text-yellow-500";
            break;
          case "FULFILLED":
            statusColor = "text-green-600";
            break;
          case "CANCELLED":
            statusColor = "text-red-600";
            break;
          case "EXPIRED":
            statusColor = "text-gray-400";
            break;
        }

        return (
          <div
      key={req.id}
      className="mt-5 px-5 py-2 rounded-2xl bg-white grid grid-cols-6 items-center text-center"
    >
      <Image width={150} height={200} src={req.book.coverImageUrl || `/api/books/${req.book.id}/cover`}
        alt={req.book.title}
        className="min-w-16 max-w-16 h-auto object-contain rounded"/>

      <div>
        <h2 className="font-semibold mt-2 text-lg">{req.book.title}</h2>
        </div>
        <div>
        <p className="text-sm text-gray-600">{req.book.author}</p>
        </div>

      <p className="text-sm text-gray-600 text-center">
        {req.book.category || "Null"}
      </p>

      <p className={`font-semibold ${statusColor}`}>
        {req.status}
      </p>

      <p className="text-sm text-gray-500">
        {new Date(req.reservedAt).toLocaleDateString()}
      </p>
    </div>
        );
      })}
    </div>
    </div>
    </div>
  );
}
