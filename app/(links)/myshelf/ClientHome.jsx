"use client";
import Image from 'next/image';

import Link from "next/link";
import { useState, useMemo } from "react";

export default function ClientHome({ initialBooks }) {
  const [query, setQuery] = useState("");

  const books = useMemo(() => {
    const q = query.toLowerCase();
    return initialBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        (book.category || "").toLowerCase().includes(q)
    );
  }, [query, initialBooks]);

  return (
    <div className="min-h-screen w-full grid grid-cols-12 pr-5 bg-[#F3F3F7] absolute">
        {/* ✅ Search box */}
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
      <div className="flex-1 col-start-3 col-span-10 mt-20 px-6 py-4 z-20 bg-[#F3F3F7]">

        <main>
          <div className="grid grid-cols-3 gap-4 p-6 text-black">
            {books.length === 0 ? (
              <div className="col-span-4 text-center text-gray-500 py-10">
                No books found.
              </div>
            ) : (
              books.map((book) => (
              <div
                key={book.id}
                className="relative bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col justify-between transition-all hover:shadow-md"
              >
                {/* ✅ Cover + Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2 justify-center">
                    <Image width={150} height={200} src={book.coverImageUrl}
                      alt={book.title}
                      className="w-auto h-[200px] object-contain rounded-md"/>
                    <p className="text-lg font-semibold text-[#4D4D4D]">
                      {book.title}
                    </p>
                    <p className="text-sm text-[#4D4D4D]">{book.author}</p>
                  </div>

                  <div className="justify-between flex flex-col">
                    <div>
                      {book.borrowings && book.borrowings.length > 0 && (
                        <div className="flex flex-col gap-4">
                        <div className="flex-1 flex flex-col">
                          <span className="text-lg text-[#4D4D4D] font-semibold">Borrowed on</span>
                          <p className="text-sm font-medium text-[#747373]">{new Date(book.borrowings[0].borrowedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex-1 flex flex-col">
                          <span className="text-lg text-[#4D4D4D] font-semibold">Submission date</span>
                          <p className="text-sm font-medium text-[#747373]">{new Date(book.borrowings[0].dueDate).toLocaleDateString()}</p>
                        </div>
                        <div className="flex-1 flex flex-col">
                          <span className="text-lg text-[#4D4D4D] font-semibold">Status</span>
                          <p className="text-sm font-medium text-[#747373]">
                          {new Date(book.borrowings[0].dueDate).getTime() < new Date().getTime() ? (
                            <span className="text-red-600 font-medium text-lg">Overdue</span>
                          ):(
                            <span className="text-green-600 font-medium text-lg">Borrowed</span>
                          )}
                        </p>
                        </div>
                        </div>
                      )}
                    </div>

                    {/* ✅ View Button */}
                    <Link
                      href={`/${book.id}/read`}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center"
                    >
                      Read Book
                    </Link>
                  </div>
                </div>
              </div>
            ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
