import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData();
    const file = form.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Ensure it is an image
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate a unique filename
    const fileName = `${Date.now()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), "public/images/profiles");

    // Save file to /public/images/profiles
    await writeFile(path.join(uploadDir, fileName), buffer);

    // Public URL for frontend
    const url = `/images/profiles/${fileName}`;

    // Update user profile in database
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { profile: url },
      select: { id: true, profile: true },
    });

    return NextResponse.json({ profile: updatedUser.profile });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json({ error: "Failed to upload" }, { status: 500 });
  }
}
