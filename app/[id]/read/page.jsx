import prisma from "@/lib/prisma";

export default async function BookReader({ params }) {
  const { id } = await params;
  const book = await prisma.book.findUnique({
    where: { id },
    select: { title: true, author: true },
  });

  if (!book) return <div>Book not found</div>;

  return (
    <div className="p-8 min-h-screen bg-white text-black">
      <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
      <p className="mb-4 text-gray-700">{book.author}</p>

      <iframe
        src={`/api/books/${id}/file`}
        className="w-full h-[80vh] border rounded"
        title={book.title}
      />
    </div>
  );
}
