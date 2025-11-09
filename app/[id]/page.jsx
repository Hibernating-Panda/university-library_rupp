import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function BookReader({ params }) {
  const { id } = await params;

  const book = await prisma.book.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      author: true,
      category: true,
      quantity: true,
      coverImageUrl: true,
    },
  });

  if (!book) return <div className="p-8">Book not found</div>;

  return (
    <div className="min-h-screen bg-[#F3F3F7] p-8 flex justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-3xl text-black">
        
        {/* Book Cover */}
        <img
          src={book.coverImageUrl || `/api/books/${book.id}/cover`}
          alt={book.title}
          className="w-full h-96 object-contain rounded"
        />

        {/* Book Info */}
        <h1 className="text-3xl font-bold mt-4">{book.title}</h1>
        <p className="text-lg text-gray-700">by {book.author}</p>
        <p className="text-gray-600 mt-2">
          Category: {book.category || "Unknown"}
        </p>
        <p className="text-gray-600">
          Available:{" "}
          <span className={book.quantity > 0 ? "text-green-600" : "text-red-600"}>
            {book.quantity}
          </span>
        </p>

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <Link
            href={`/${book.id}/read`}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center"
          >
            Read Book
          </Link>

          <form action={`/api/books/${book.id}/borrow`} method="POST">
            <button
              className={`px-5 py-2 rounded-lg text-white ${
                book.quantity > 0
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-500 cursor-not-allowed"
              }`}
              type="submit"
              disabled={book.quantity === 0}
            >
              Borrow Book
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
