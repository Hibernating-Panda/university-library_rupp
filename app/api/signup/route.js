import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body || {};
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    const hashed = await hashPassword(password);
    const created = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: role && ["ADMIN","STAFF","USER"].includes(role) ? role : "USER",
      },
      select: { id: true, name: true, email: true, role: true },
    });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
