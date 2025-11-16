import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const count = await prisma.user.count({
    where: {
      role: {
        not: "ADMIN"
      }
    }
  });
  return NextResponse.json({ totalUsers: count });
}