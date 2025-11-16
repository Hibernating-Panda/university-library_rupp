import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      studentId: true,
      profile: true,
      bio: true,
      major: true,
    },
  });

  return NextResponse.json(user);
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, bio, major, email } = await req.json();

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      bio,
      major,
      email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      studentId: true,
      profile: true,
      bio: true,
      major: true,
    },
  });

  return NextResponse.json(updated);
}
