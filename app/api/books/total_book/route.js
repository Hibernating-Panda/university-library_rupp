import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const count = await prisma.book.count();
  return NextResponse.json({ totalBooks: count });
}
