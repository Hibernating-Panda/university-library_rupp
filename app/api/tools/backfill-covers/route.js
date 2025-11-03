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

// Derive a cover URL from a Cloudinary PDF fileUrl
async function deriveCoverUrlFromFileUrl(fileUrl) {
  try {
    const u = new URL(fileUrl);
    if (!u.hostname.includes("res.cloudinary.com")) return null;

    const path = u.pathname;
    const splitMarker = path.includes("/image/upload/")
      ? "/image/upload/"
      : path.includes("/raw/upload/")
      ? "/raw/upload/"
      : null;
    if (!splitMarker) return null;

    const rest = path.split(splitMarker)[1] || "";
    const withoutVersion = rest.startsWith("v") ? rest.split("/").slice(1).join("/") : rest;
    const publicIdWithExt = withoutVersion.replace(/^\/+/, "");
    const publicId = publicIdWithExt.replace(/\.(jpg|jpeg|png|gif|pdf)$/i, "");

    // Try public upload delivery (no signing)
    const publicCoverUrl = cloudinary.url(publicId, {
      resource_type: "image",
      type: "upload",
      page: 1,
      format: "jpg",
      transformation: [{ quality: "auto", fetch_format: "auto" }],
      secure: true,
    });
    let res = await fetch(publicCoverUrl, { cache: "no-store" });
    if (res.ok) return publicCoverUrl;

    // Try signed upload delivery
    const signedUploadUrl = cloudinary.url(publicId, {
      resource_type: "image",
      type: "upload",
      page: 1,
      format: "jpg",
      transformation: [{ quality: "auto", fetch_format: "auto" }],
      secure: true,
      sign_url: true,
    });
    res = await fetch(signedUploadUrl, { cache: "no-store" });
    if (res.ok) return signedUploadUrl;

    // Try authenticated delivery
    const signedAuthUrl = cloudinary.url(publicId, {
      resource_type: "image",
      type: "authenticated",
      page: 1,
      format: "jpg",
      transformation: [{ quality: "auto", fetch_format: "auto" }],
      secure: true,
      sign_url: true,
    });
    res = await fetch(signedAuthUrl, { cache: "no-store" });
    if (res.ok) return signedAuthUrl;

    return null;
  } catch {
    return null;
  }
}

export async function POST() {
  try {
    // Optional: restrict in production
    if (process.env.NODE_ENV === "production") {
      return json({ error: "Disabled in production" }, { status: 403 });
    }

    const updated = [];
    const failed = [];
    const batchSize = 25;
    let cursor = undefined;

    // Backfill books with missing or empty coverImageUrl
    while (true) {
      const books = await prisma.book.findMany({
        where: {
          OR: [
            { coverImageUrl: null },
            { coverImageUrl: "" },
          ],
          NOT: [{ fileUrl: null }],
        },
        take: batchSize,
        ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
        orderBy: { id: "asc" },
        select: { id: true, title: true, fileUrl: true },
      });

      if (!books.length) break;

      for (const b of books) {
        const coverUrl = await deriveCoverUrlFromFileUrl(b.fileUrl);
        if (coverUrl) {
          await prisma.book.update({
            where: { id: b.id },
            data: { coverImageUrl: coverUrl },
          });
          updated.push(b.id);
        } else {
          failed.push(b.id);
        }
      }

      cursor = books[books.length - 1].id;
      if (books.length < batchSize) break;
    }

    return json({ success: true, updatedCount: updated.length, failedCount: failed.length, updated, failed });
  } catch (e) {
    console.error(e);
    return json({ error: "Backfill failed", message: e?.message || "Unknown error" }, { status: 500 });
  }
}

export async function GET() {
  return json({ error: "Method Not Allowed", message: "Use POST to backfill covers" }, { status: 405 });
}
