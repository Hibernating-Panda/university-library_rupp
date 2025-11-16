// app/[id]/page.jsx

import prisma from "@/lib/prisma";
import BorrowClient from "./BorrowClient";

export default async function BookReader({ params }) {
  const { id } = await params; // Do NOT await

  const book = await prisma.book.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      author: true,
      category: true,
      quantity: true,
      coverImageUrl: true,
      description: true,
    },
  });

  if (!book) return <div className="p-8">Book not found</div>;

  return <BorrowClient book={book} />;
}
