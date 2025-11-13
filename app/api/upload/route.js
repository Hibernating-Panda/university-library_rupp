import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

function json(data, init = {}) {
  const status = typeof init === "number" ? init : init.status || 200;
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function toSlug(input) {
  return String(input || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export async function POST(req) {
  try {
    const form = await req.formData();
    const title = form.get("title");
    const author = form.get("author");
    const pdfFile = form.get("pdfFile");
    const quantity = Number(form.get("quantity")) || 1;
    const category = form.get("category");
    const description = form.get("description");

    if (!title || !author || !pdfFile) {
      return json({ error: "Invalid request", message: "Missing title, author, or pdfFile" }, { status: 400 });
    }

    if (typeof title !== "string" || typeof author !== "string") {
      return json({ error: "Invalid request", message: "title and author must be strings" }, { status: 400 });
    }

    if (typeof pdfFile !== "object" || typeof pdfFile.arrayBuffer !== "function") {
      return json({ error: "Invalid file", message: "pdfFile is not a valid file" }, { status: 400 });
    }

    const arrayBuffer = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const publicIdBase = `${toSlug(title)}-${Date.now()}`;

    const uploaded = await new Promise((resolve, reject) => {
      const options = {
        resource_type: "image",
        folder: "library/books",
        public_id: publicIdBase,
        format: "pdf",
        use_filename: false,
        unique_filename: false,
        overwrite: true,
        eager: [
          {
            page: 1,
            format: "jpg",
            transformation: [{ quality: "auto", fetch_format: "auto" }],
          },
        ],
      };

      const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
      stream.end(buffer);
    });

    const fileUrl = uploaded.secure_url;

    let coverImageUrl = "";
    try {
      // Prefer the eager generated thumbnail if present
      if (uploaded.eager && uploaded.eager.length > 0 && uploaded.eager[0].secure_url) {
        coverImageUrl = uploaded.eager[0].secure_url;
      } else {
        const publicId = uploaded.public_id;
        coverImageUrl = cloudinary.url(publicId, {
          resource_type: "image",
          type: "upload",
          page: 1,
          format: "jpg",
          secure: true,
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        });
      }
    } catch {}

    const book = await prisma.book.create({
      data: {
        title,
        author,
        fileUrl,
        coverImageUrl: coverImageUrl || null,
        quantity,
        category,
        description,
      },
      select: { id: true, title: true, author: true, fileUrl: true, coverImageUrl: true, quantity: true, category: true, description: true },
    });

    return json({ success: true, book }, { status: 201 });
  } catch (e) {
    console.error(e);
    const message = e?.message || "Upload failed";
    return json({ error: "Upload failed", message }, { status: 500 });
  }
} 

export async function GET() {
  return json({ error: "Method Not Allowed", message: "Use POST to upload a book" }, { status: 405 });
}

