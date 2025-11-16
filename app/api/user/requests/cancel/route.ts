import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // Parse the POST body to get the reservation ID
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Reservation ID is required" }, { status: 400 });
    }

    // Get the user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the reservation
    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }

    // Only the owner can cancel
    if (reservation.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Only pending reservations can be cancelled
    if (reservation.status !== "PENDING") {
      return NextResponse.json({ error: "Only pending reservations can be cancelled" }, { status: 400 });
    }

    // Update status to CANCELLED
    await prisma.reservation.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error cancelling reservation:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
