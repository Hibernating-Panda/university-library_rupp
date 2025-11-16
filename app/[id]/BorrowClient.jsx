"use client";
import Image from "next/image";
import Link from "next/link";

export default function BorrowClient({ book }) {
  
  async function handleBorrow() {
    const res = await fetch(`/api/books/${book.id}/borrow`, {
      method: "POST",
    });

    const data = await res.json();
    alert(data.msg);
  }

  return (
    <div className="min-h-screen p-8 flex justify-center">
      <Image src="/background.svg" alt="Logo" width={1920} height={1080} className="fixed z-10 top-0 left-0 bg-[#F3F3F7]" />
      <div className="bg-white shadow-lg rounded-2xl p-6 my-20 w-full max-w-3xl text-black z-20">

        <Link href="/" className="flex mb-4 items-center text-gray-600 gap-2 hover:opacity-80 hover:cursor-pointer">
          <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M73.4 297.4C60.9 309.9 60.9 330.2 73.4 342.7L233.4 502.7C245.9 515.2 266.2 515.2 278.7 502.7C291.2 490.2 291.2 469.9 278.7 457.4L173.3 352L544 352C561.7 352 576 337.7 576 320C576 302.3 561.7 288 544 288L173.3 288L278.7 182.6C291.2 170.1 291.2 149.8 278.7 137.3C266.2 124.8 245.9 124.8 233.4 137.3L73.4 297.3z" fill='currentColor'/></svg>
          <p>Back</p>
        </Link>

        <div className="grid grid-cols-2">
          <Image width={150} height={200} src={book.coverImageUrl || `/api/books/${book.id}/cover`} alt={book.title} className="w-auto h-100 object-contain rounded-2xl" />

          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold mt-4">{book.title}</h1>
              <p className="text-lg text-gray-700">By {book.author}</p>
              <p className="text-gray-600 mt-2">Category: {book.category || "Unknown"}</p>

              <p className="text-gray-600">
                {book.quantity > 0 ? (
                  <>Available: <span className="text-green-600">{book.quantity}</span></>
                ) : (
                  <span className="text-red-600">No copies available</span>
                )}
              </p>

              <p className="text-gray-600 mt-2">
                <span className="font-semibold text-black">Description:</span><br />
                {book.description || "No description available."}
              </p>
            </div>

            <div className="flex gap-4 mt-6">
              <Link href={`/${book.id}/read`} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center">
                Read Book
              </Link>

              {book.quantity > 0 && (
                <button onClick={handleBorrow} className="px-5 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700">
                  Borrow Book
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
