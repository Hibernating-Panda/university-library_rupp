import prisma from "@/lib/prisma";

export const runtime = "nodejs";

function json(data, init = {}) {
  const status = typeof init === "number" ? init : init.status || 200;
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(_req, { params }) {
  try {
    const { id } = await params;
    if (!id) return json({ error: "Missing id" }, { status: 400 });

    const deleted = await prisma.book.delete({ where: { id } });
    return json({ success: true, id: deleted.id });
  } catch (e) {
    if (e?.code === "P2025") {
      return json({ error: "Not found" }, { status: 404 });
    }
    console.error(e);
    return json({ error: "Failed to delete" }, { status: 500 });
  }
}

export async function GET(_req, { params }) {
  // Optional helper: fetch a single book
  try {
    const { id } = await params;
    if (!id) return json({ error: "Missing id" }, { status: 400 });

    const book = await prisma.book.findUnique({
      where: { id },
      select: { id: true, title: true, author: true, fileUrl: true, coverImageUrl: true, createdAt: true },
    });
    if (!book) return json({ error: "Not found" }, { status: 404 });
    return json(book);
  } catch (e) {
    console.error(e);
    return json({ error: "Server error" }, { status: 500 });
  }
}
