import { v2 as cloudinary } from "cloudinary";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req, { params }) {
  try {
    const { id } = params;
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) return Response.json({ error: "No file provided" }, { status: 400 });

    const book = await prisma.book.findUnique({ where: { id } });
    if (!book) return Response.json({ error: "Book not found" }, { status: 404 });

    // ✅ Read file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ✅ Upload NEW file to Cloudinary
    const uploaded = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "library/books",
          resource_type: "raw", // ✅ IMPORTANT for PDFs
          public_id: `${book.slug}-${Date.now()}`,
          overwrite: true
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      ).end(buffer);
    });

    // ✅ Delete old Cloudinary PDF (optional)
    if (book.pdf_public_id) {
      cloudinary.uploader.destroy(book.pdf_public_id, { resource_type: "raw" });
    }

    return Response.json({
      message: "Book file reuploaded successfully!",
      url: uploaded.secure_url
    });
    

  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
