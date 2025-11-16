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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${file.name}`;
    const uploadPath = path.join(process.cwd(), "public/images/profiles", fileName);

    // Save file to /public/images/profiles
    await writeFile(uploadPath, buffer);

    // Public URL for frontend
    const url = `/images/profiles/${fileName}`;

    // Update user in database
    await prisma.user.update({
      where: { id: session.user.id },
      data: { profile: url },
    });

    return NextResponse.json({ url });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json({ error: "Failed to upload" }, { status: 500 });
  }
}
