import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function GET(_req, { params }) {
  try {
    const { id } = await params;

    const book = await prisma.book.findUnique({
      where: { id },
      select: { id: true, title: true, coverImageUrl: true, fileUrl: true },
    });
    if (!book) return new Response("Not found", { status: 404 });

    const requestInit = {
      cache: "no-store",
      headers: { Accept: "image/*,*/*" },
      redirect: "follow",
    };

    // Try existing cover URL first
    let src = book.coverImageUrl || "";
    let upstream;
    if (src) {
      upstream = await fetch(src, requestInit);
    }

    // If not OK, try to derive cover from Cloudinary public_id with multiple strategies
    if (!upstream || !upstream.ok || !upstream.body) {
      const tryFrom = book.coverImageUrl || book.fileUrl || "";
      try {
        const u = new URL(tryFrom);
        const isCloudinary = u.hostname.includes("res.cloudinary.com");
        if (isCloudinary) {
          // Determine resource_type path segment
          const path = u.pathname;
          const splitMarker = path.includes("/image/upload/")
            ? "/image/upload/"
            : path.includes("/raw/upload/")
            ? "/raw/upload/"
            : null;
          if (splitMarker) {
            const rest = path.split(splitMarker)[1] || "";
            const withoutVersion = rest.startsWith("v")
              ? rest.split("/").slice(1).join("/")
              : rest;
            const publicIdWithExt = withoutVersion.replace(/^\/+/, "");
            const publicId = publicIdWithExt.replace(/\.(jpg|jpeg|png|gif|pdf)$/i, "");

            // 1) Try public upload delivery (no signing)
            const publicCoverUrl = cloudinary.url(publicId, {
              resource_type: "image",
              type: "upload",
              page: 1,
              format: "jpg",
              transformation: [{ quality: "auto", fetch_format: "auto" }],
              secure: true,
            });
            upstream = await fetch(publicCoverUrl, requestInit);

            // 2) If not OK, try signed upload delivery
            if (!upstream.ok || !upstream.body) {
              const signedUploadUrl = cloudinary.url(publicId, {
                resource_type: "image",
                type: "upload",
                page: 1,
                format: "jpg",
                transformation: [{ quality: "auto", fetch_format: "auto" }],
                secure: true,
                sign_url: true,
              });
              upstream = await fetch(signedUploadUrl, requestInit);
            }

            // 3) If still not OK, try authenticated delivery
            if (!upstream.ok || !upstream.body) {
              const signedAuthUrl = cloudinary.url(publicId, {
                resource_type: "image",
                type: "authenticated",
                page: 1,
                format: "jpg",
                transformation: [{ quality: "auto", fetch_format: "auto" }],
                secure: true,
                sign_url: true,
              });
              upstream = await fetch(signedAuthUrl, requestInit);
            }
          }
        }
      } catch {}
    }

    if (!upstream || !upstream.ok || !upstream.body) {
      // Graceful fallback: return a simple SVG placeholder instead of an error status
      const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
  <defs>
    <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#eef2ff"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect x="60" y="80" width="480" height="640" rx="8" fill="#ffffff" stroke="#cbd5e1"/>
  <g fill="#94a3b8">
    <rect x="100" y="130" width="400" height="32" rx="4"/>
    <rect x="100" y="180" width="260" height="20" rx="4"/>
    <rect x="100" y="240" width="400" height="480" rx="6" fill="#f1f5f9"/>
  </g>
  <g fill="#64748b" font-family="Arial, Helvetica, sans-serif" text-anchor="middle">
    <text x="300" y="210" font-size="20">Cover unavailable</text>
  </g>
</svg>`;
      const headers = new Headers();
      headers.set("Content-Type", "image/svg+xml");
      headers.set("Cache-Control", "no-store");
      return new Response(svg, { status: 200, headers });
    }

    const headers = new Headers();
    headers.set("Content-Type", upstream.headers.get("content-type") || "image/jpeg");
    headers.set("Cache-Control", "no-store");
    return new Response(upstream.body, { status: 200, headers });
  } catch (e) {
    console.error(e);
    return new Response("Server error", { status: 500 });
  }
}
