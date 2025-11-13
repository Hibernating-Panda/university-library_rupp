"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function ViewBookPage() {
  const { id } = useParams();
  const router = useRouter();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`/api/books/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load book");
        setBook(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBook();
  }, [id]);

  if (loading)
    return <div className="p-10 text-center text-gray-600">Loading book...</div>;

  if (error)
    return <div className="p-10 text-center text-red-600">{error}</div>;

  if (!book)
    return <div className="p-10 text-center text-gray-600">Book not found.</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
      <div className="bg-white rounded-xl shadow-md p-10 w-full max-w-3xl">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            <Image
              width={200}
              height={300}
              src={book.coverImageUrl || `/api/books/${book.id}/cover`}
              alt={book.title}
              className="rounded-lg object-contain border border-gray-200"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">{book.title}</h1>
            <p className="text-gray-600 mb-4">by {book.author}</p>

            <div className="grid grid-cols-2 gap-y-2 text-gray-700">
              <p><span className="font-medium">Category:</span> {book.category || "—"}</p>
              <p><span className="font-medium">Quantity:</span> {book.quantity}</p>
              <p className="col-span-2">
                <span className="font-medium">Description:</span>{" "}
                {book.description || "No description available."}
              </p>
              {book.fileUrl && (
                <a
                  href={book.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline mt-3 inline-block"
                >
                  📄 View PDF
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/staff/books")}
            className="px-6 py-2 rounded-lg border border-gray-400 text-gray-600 hover:bg-gray-100"
          >
            ← Back to Book List
          </button>
        </div>
      </div>
    </div>
  );
}
