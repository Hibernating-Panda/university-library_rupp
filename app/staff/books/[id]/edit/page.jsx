"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditBookPage() {
  const { id } = useParams();
  const router = useRouter();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details"); // 'details' | 'reupload'
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pdf, setPdf] = useState(null);

  // Load book details
  useEffect(() => {
    const loadBook = async () => {
      try {
        setLoading(true);
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
    if (id) loadBook();
  }, [id]);

  // Update book details
  const handleDetailUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: book.title,
          author: book.author,
          category: book.category,
          quantity: book.quantity,
          description: book.description,
        }), 
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || data?.message || "Update failed");

      setSuccess("Book details updated successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  // Reupload PDF
  const handleReupload = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!pdf) {
      setError("Please select a PDF file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("pdfFile", pdf);
    formData.append("title", book.title);
    formData.append("author", book.author);

    try {
      const res = await fetch(`/api/books/${id}/reupload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || data?.message || "Reupload failed");

      setSuccess("Book file reuploaded successfully!");
      setPdf(null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading)
    return <div className="p-10 text-gray-600 text-center">Loading book...</div>;

  if (!book)
    return (
      <div className="p-10 text-center text-red-600">
        Failed to load book data.
      </div>
    );

  return (
    <div className="min-h-screen w-full grid grid-cols-12 pr-5 absolute">
      <div className="col-start-3 col-span-10 z-20 mt-20 pt-10 px-20 bg-[#F3F3F7]">
        <div className="grid bg-white px-12 py-6 rounded-lg">
        <div className="text-2xl font-semibold text-center mb-4 text-black">
          Edit Book – {book.title}
        </div>

        {/* Tabs */}
        <div className="flex justify-around mb-6">
          <button
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeTab === "details"
                ? "bg-[#F76B56] text-white"
                : "bg-gray-100 text-gray-600"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Edit Details
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeTab === "reupload"
                ? "bg-[#F76B56] text-white"
                : "bg-gray-100 text-gray-600"
            }`}
            onClick={() => setActiveTab("reupload")}
          >
            Reupload PDF
          </button>
        </div>

        {/* Alerts */}
        {error && <div className="p-2 mb-3 text-sm bg-red-100 text-red-600 rounded">{error}</div>}
        {success && <div className="p-2 mb-3 text-sm bg-green-100 text-green-600 rounded">{success}</div>}

        {/* TAB 1: Edit Details */}
        {activeTab === "details" && (
          <form onSubmit={handleDetailUpdate} className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                className="border p-2 w-full rounded text-black"
                value={book.title}
                onChange={(e) => setBook({ ...book, title: e.target.value })}
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author
              </label>
              <input
                type="text"
                className="border p-2 w-full rounded text-black"
                value={book.author}
                onChange={(e) => setBook({ ...book, author: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                className="border px-2 pt-2 pb-3 w-full rounded text-black"
                value={book.category || ""}
                onChange={(e) => setBook({ ...book, category: e.target.value })}
              >
                <option value="">Select Category</option>
                <option value="English">English</option>
                <option value="Math">Math</option>
                <option value="IT">IT</option>
                <option value="History">History</option>
                <option value="Engineering">Engineering</option>
                <option value="Sociology">Sociology</option>
                <option value="Psychology">Psychology</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Physics">Physics</option>
                <option value="Biology">Biology</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                min="0"
                className="border p-2 w-full rounded text-black"
                value={book.quantity}
                onChange={(e) =>
                  setBook({ ...book, quantity: parseInt(e.target.value) || 0 })
                }
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="border p-2 w-full rounded text-black"
                value={book.description || ""}
                onChange={(e) => setBook({ ...book, description: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-[#F76B56] text-white rounded-lg hover:bg-[#fa5d44] mt-4 col-span-2"
            >
              Save Changes
            </button>
          </form>
        )}

        {/* TAB 2: Reupload PDF */}
        {activeTab === "reupload" && (
          <form onSubmit={handleReupload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current File
              </label>
              <a
                href={book.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Current PDF
              </a>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                New PDF File
              </label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdf(e.target.files?.[0] || null)}
                className="text-black"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Upload New File
            </button>
          </form>
        )}

        <button
          onClick={() => router.push("/staff/books")}
          className="mt-6 w-full py-2 border border-gray-400 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          ← Back to Book List
        </button>
        </div>
      </div>
    </div>
  );
}
