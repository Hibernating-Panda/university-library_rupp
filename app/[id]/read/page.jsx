import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function BookReader({ params }) {
  const { id } = await params;
  const book = await prisma.book.findUnique({
    where: { id },
    select: { title: true, author: true },
  });

  if (!book) return <div>Book not found</div>;

  return (
    <div className="min-h-screen w-full h-full bg-white text-black">

      <iframe
        src={`/api/books/${id}/file`}
        className="w-full h-screen"
        title={book.title}
      />
      <Link
        href={`/${id}`}
        className="fixed top-15 right-10 bg-[#F3F3F7] text-black px-4 py-2 rounded-lg hover:bg-[#F3F3F7]"
      >
        Back
      </Link>
    </div>
  );
}
