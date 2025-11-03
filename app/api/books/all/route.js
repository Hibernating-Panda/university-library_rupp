import prisma from "@/lib/prisma";

export const runtime = "nodejs";

function json(data, init = {}) {
  const status = typeof init === "number" ? init : init.status || 200;
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, author: true, fileUrl: true, coverImageUrl: true, createdAt: true },
    });
    return json(books);
  } catch (e) {
    console.error(e);
    return json({ error: "Failed to fetch books" }, { status: 500 });
  }
}
