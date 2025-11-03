import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function BooksPage() {
  const books = await prisma.book.findMany({
    select: {
      id: true,
      title: true,
      author: true,
      fileUrl: true,
      coverImageUrl: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="grid grid-cols-3 gap-4 p-6 bg-white min-h-screen text-black">
      {books.map((book) => (
        <div key={book.id} className="border p-3 rounded shadow">
          <img src={`/api/books/${book.id}/cover`} alt={book.title} className="w-full h-64 object-cover rounded" />
          <h2 className="font-semibold mt-2">{book.title}</h2>
          <p className="text-sm text-gray-600">{book.author}</p>
          <Link
            href={`/books/${book.id}`}
            className="text-blue-600 underline text-sm mt-2 inline-block"
          >
            Read PDF
          </Link>
        </div>
      ))}
    </div>
  );
}
