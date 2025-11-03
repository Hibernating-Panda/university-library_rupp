"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/books/all", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || data?.message || "Failed to load books");
      setBooks(data);
    } catch (e) {
      setError(e?.message || "Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id) => {
    if (!confirm("Delete this book? This cannot be undone.")) return;
    try {
      setDeletingId(id);
      const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || data?.message || "Failed to delete");
      setBooks((prev) => prev.filter((b) => b.id !== id));
    } catch (e) {
      alert(e?.message || "Failed to delete");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Manage Books</h1>
        <div className="flex gap-2">
          <Link href="/admin/upload" className="px-3 py-2 text-sm bg-blue-600 text-white rounded">Upload New</Link>
          <Link href="/books" className="px-3 py-2 text-sm border rounded">Public Books</Link>
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {books.map((b) => (
            <div key={b.id} className="border rounded p-3">
              <img src={`/api/books/${b.id}/cover`} alt={b.title} className="w-full h-48 object-cover rounded" />
              <h2 className="font-semibold mt-2">{b.title}</h2>
              <p className="text-sm text-gray-600">{b.author}</p>
              <div className="flex gap-2 mt-3">
                <Link href={`/books/${b.id}`} className="text-blue-600 text-sm underline">View</Link>
                <button
                  onClick={() => onDelete(b.id)}
                  disabled={deletingId === b.id}
                  className={`text-sm px-2 py-1 rounded ${deletingId === b.id ? 'bg-red-300 text-white' : 'bg-red-600 text-white hover:bg-red-700'}`}
                >
                  {deletingId === b.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
          {!books.length && (
            <div className="col-span-3 text-center text-gray-500">No books found.</div>
          )}
        </div>
      )}
    </div>
  );
}
