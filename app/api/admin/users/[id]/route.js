import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";

// Disable default body parser
export const config = {
  api: {
    bodyParser: false,
  }, 
};

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = params?.id;
  if (!id) return NextResponse.json({ error: "Missing user id" }, { status: 400 });

  try {
    const body = await req.json();

    const updateData = {
      name: body.name,
      email: body.email,
      studentId: body.studentId,
      role: body.role,
    };

    if (body.password && body.password.trim() !== "") {
      updateData.password = await hash(body.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        studentId: true,
        role: true,
        profile: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}


// ✅ DELETE handler (optional)
export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = params?.id;
  if (!id) return NextResponse.json({ error: "Missing user id" }, { status: 400 });

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (target.role === "ADMIN") {
    return NextResponse.json({ error: "Cannot delete admin" }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
