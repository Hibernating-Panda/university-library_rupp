import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email)
    return NextResponse.json({ success: false, msg: "Not Logged In" }, { status: 401 });

  const bookId = params.id;
  const userEmail = session.user.email;

  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true },
    });

    if (!user)
      return NextResponse.json({ success: false, msg: "User not found" }, { status: 400 });

    await prisma.reservation.create({
      data: {
        bookId,
        userId: user.id,
        reservedAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: "PENDING",
      },
    });

    // ⬇️ return success and stay on same page
    return NextResponse.json({ success: true, msg: "Borrow Requested" });
  } catch (err) {
    return NextResponse.json(
      { success: false, msg: "Failed to request borrow", details: err.message },
      { status: 500 }
    );
  }
}
