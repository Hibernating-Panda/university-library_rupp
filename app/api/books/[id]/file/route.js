import { PrismaClient } from "@prisma/client";
import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const book = await prisma.book.findUnique({
      where: { id },
      select: { fileUrl: true },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const value = String(book.fileUrl || "");

    // If not a Cloudinary URL/public_id, just redirect to the original
    const looksLikeUrl = /^https?:\/\//i.test(value);
    if (looksLikeUrl) {
      try {
        const u = new URL(value);
        if (!u.hostname.includes("res.cloudinary.com")) {
          return NextResponse.redirect(value, { status: 302 });
        }
        // Cloudinary URL -> extract public_id and resource_type
        const path = u.pathname;
        const marker = path.includes("/image/upload/")
          ? "/image/upload/"
          : path.includes("/raw/upload/")
          ? "/raw/upload/"
          : null;
        if (!marker) {
          return NextResponse.redirect(value, { status: 302 });
        }
        const rest = path.split(marker)[1] || "";
        const withoutVersion = rest.startsWith("v") ? rest.split("/").slice(1).join("/") : rest;
        const publicIdWithExt = withoutVersion.replace(/^\/+/, "");
        const publicId = publicIdWithExt.replace(/\.pdf$/i, "");
        const resourceType = marker.includes("/raw/") ? "raw" : "image";

        // Prefer authenticated signed link; if not found, fall back to upload signed link
        const makeUrl = (type) =>
          cloudinary.utils.private_download_url(publicId, "pdf", {
            resource_type: resourceType,
            type,
            attachment: false,
            expires_at: Math.floor(Date.now() / 1000) + 600,
          });

        const authUrl = makeUrl("authenticated");
        const tryAuth = await fetch(authUrl, { cache: "no-store" }).catch(() => null);
        if (tryAuth && tryAuth.ok) return NextResponse.redirect(authUrl, { status: 302 });

        const uploadUrl = makeUrl("upload");
        const tryUpload = await fetch(uploadUrl, { cache: "no-store" }).catch(() => null);
        if (tryUpload && tryUpload.ok) return NextResponse.redirect(uploadUrl, { status: 302 });

        // If neither variant is available, redirect to original value and let browser handle
        return NextResponse.redirect(value, { status: 302 });
      } catch (e) {
        console.error(e);
        return NextResponse.redirect(value, { status: 302 });
      }
    } else {
      // Treat as Cloudinary public_id (folder/name without scheme)
      const publicId = value.replace(/\.pdf$/i, "");

      const makeUrl = (resource_type, type) =>
        cloudinary.utils.private_download_url(publicId, "pdf", {
          resource_type,
          type,
          attachment: false,
          expires_at: Math.floor(Date.now() / 1000) + 600,
        });

      // Try combinations in order of most likely success
      const combos = [
        ["image", "authenticated"],
        ["image", "upload"],
        ["raw", "authenticated"],
        ["raw", "upload"],
      ];
      for (const [rt, tp] of combos) {
        const url = makeUrl(rt, tp);
        const probe = await fetch(url, { cache: "no-store" }).catch(() => null);
        if (probe && probe.ok) return NextResponse.redirect(url, { status: 302 });
      }
      // Nothing worked; return 404
      return NextResponse.json({ error: "PDF not found for public_id" }, { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

