"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!pdf) {
      setError("Please select a PDF file");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("quantity", quantity);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("pdfFile", pdf);

    try { 
      const res = await fetch("/api/upload", {   
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to upload book");
      }

      setSuccess("Book uploaded successfully!");

      // Reset form
      setTitle("");
      setAuthor("");
      setQuantity(1);
      setCategory("");
      setDescription("");
      setPdf(null);

      setTimeout(() => {
        router.push("/staff/books");
      }, 2000);

    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-12 pr-5 bg-[#F3F3F7] absolute">
      <div className="flex-1 col-start-3 col-span-10 mt-20 px-6 pt-8 z-20 bg-[#F3F3F7]">
    <div className="p-6 max-w-md mx-auto bg-white rounded-2xl">
      <h1 className="text-2xl font-semibold mb-4 text-[#FA7C54]">Upload New Book</h1>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>}

      <form onSubmit={handleUpload} className="grid grid-cols-2 gap-4 text-black">
        
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Book Title</label>
          <input
            type="text"
            className="border p-2 w-full rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
          <input
            type="text"
            className="border p-2 w-full rounded"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
          <input
            type="number"
            min="1"
            className="border p-2 w-full rounded"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            required
          />
        </div>

        {/* ✅ Category */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            className="w-full border rounded px-3 pt-2 pb-3 text-left text-black"
            value={category}               // bind state
            onChange={(e) => setCategory(e.target.value)}  // update state
            required
          >
            <option value="" disabled>Select a category</option>
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

        {/* ✅ Description */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            className="border p-2 w-full rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description of the book"
            rows={3}
          />
        </div>

        <div className="col-span-2 flex items-center gap-2">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdf(e.target.files?.[0] || null)}
            className="block w-full hover:cursor-pointer hover:border-gray-300"
            required
          />
        </div>

        <div className="col-span-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded text-white font-medium ${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Uploading..." : "Upload Book"}
          </button>
        </div>
      </form>
    </div>
    </div>
    </div>
  );
}
