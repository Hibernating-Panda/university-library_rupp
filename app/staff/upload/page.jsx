"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
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
    formData.append("pdfFile", pdf);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      
      if (!res.ok) {
        console.error('Upload error response:', data);
        let errorMessage = 'Failed to upload book';
        
        if (data.error) {
          errorMessage = data.error;
          if (data.message) errorMessage += `: ${data.message}`;
        } else if (data.message) {
          errorMessage = data.message;
        }
        
        if (process.env.NODE_ENV === 'development' && data.stack) {
          console.error('Server error stack:', data.stack);
        }
        
        throw new Error(errorMessage);
      }

      setSuccess("Book uploaded successfully!");
      
      // Reset form
      setTitle("");
      setAuthor("");
      setPdf(null);
      
      // Redirect to books page after 2 seconds
      setTimeout(() => {
        router.push("/books");
      }, 2000);
      
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Upload New Book</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}
      
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Book Title
          </label>
          <input
            type="text"
            placeholder="Enter book title"
            className="border p-2 w-full rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Author
          </label>
          <input
            type="text"
            placeholder="Enter author name"
            className="border p-2 w-full rounded"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PDF File
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdf(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            required
          />
        </div>
        
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded text-white font-medium
            ${loading 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'}`}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </span>
          ) : 'Upload Book'}
        </button>
      </form>
    </div>
  );
}
