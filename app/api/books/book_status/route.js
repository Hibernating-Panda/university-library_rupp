import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  // Total library copies (sum of quantity field in Book)
  const totalBooks = await prisma.book.aggregate({
    _sum: { quantity: true },
  });

  // Each borrowing = 1 copy
  const borrowedCount = await prisma.borrowing.count({
    where: { status: "BORROWED" },
  });

  const available = totalBooks._sum.quantity - borrowedCount;


  return NextResponse.json({
    totalBooks: totalBooks._sum.quantity || 0,
    borrowed: borrowedCount,
    available: available,
  });
}
