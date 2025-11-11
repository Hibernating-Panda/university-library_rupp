import prisma from "@/lib/prisma";

export const runtime = "nodejs";

function json(data, init = {}) {
  const status = typeof init === "number" ? init : init.status || 200;
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET(_req, { params }) {
  const { id } = params;
  if (!id) return json({ error: "Missing id" }, { status: 400 });

  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) return json({ error: "Not found" }, { status: 404 });

  return json(book);
}

export async function DELETE(_req, { params }) {
  const { id } = params;
  if (!id) return json({ error: "Missing id" }, { status: 400 });

  try {
    const deleted = await prisma.book.delete({ where: { id } });
    return json({ success: true, id: deleted.id });
  } catch (e) {
    if (e?.code === "P2025") return json({ error: "Not found" }, { status: 404 });
    console.error(e);
    return json({ error: "Failed to delete" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    if (!id) return json({ error: "Missing id" }, { status: 400 });

    const body = await req.json();

    const updated = await prisma.book.update({
      where: { id },
      data: {
        title: body.title,
        author: body.author,
        category: body.category,
        quantity: body.quantity,
        description: body.description || "",
      },
    });

    return json({ success: true, book: updated });
  } catch (e) {
    console.error("PUT error:", e);
    return json({ error: "Failed to update" }, { status: 500 });
  }
}
