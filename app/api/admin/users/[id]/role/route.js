import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = params?.id;
  if (!id) return NextResponse.json({ error: "Missing user id" }, { status: 400 });
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { role } = body || {};
  if (!role || !["STAFF", "USER"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (target.role === "ADMIN") {
    return NextResponse.json({ error: "Cannot modify admin" }, { status: 400 });
  }
  const updated = await prisma.user.update({ where: { id }, data: { role } });
  return NextResponse.json({ id: updated.id, role: updated.role });
}
