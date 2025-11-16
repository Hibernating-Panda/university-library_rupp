import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const staff = await prisma.user.findMany({
    where: { role: "STAFF" || "ADMIN" }, // change if needed
    select: {
      id: true,
      name: true,
      email: true,
      profile: true,
    },
  });

  return NextResponse.json(staff);
}
