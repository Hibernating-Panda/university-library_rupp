import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "/lib/authOptions";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "STAFF") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData();
    const pdfFile = form.get("pdfFile");

    if (!pdfFile || !(pdfFile instanceof File)) {
      return NextResponse.json({ error: "No valid file uploaded" }, { status: 400 });
    }

    const bytes = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure upload folder exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", "books");
    await mkdir(uploadDir, { recursive: true });

    const filePath = `/uploads/books/${params.id}.pdf`;
    const fullPath = path.join(process.cwd(), "public", filePath);

    await writeFile(fullPath, buffer);

    const updated = await prisma.book.update({
      where: { id: params.id },
      data: { fileUrl: filePath },
    });

    return NextResponse.json({ success: true, book: updated });
  } catch (err) {
    console.error("Reupload error:", err);
    return NextResponse.json(
      { error: "Reupload failed", details: err.message },
      { status: 500 }
    );
  }
}
