import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const userId = session.user.id;

  // Count borrowed books
  const borrowedCount = await prisma.borrowing.count({
    where: { userId, status: "BORROWED" },
  });

  // Count returned books
  const returnedCount = await prisma.borrowing.count({
    where: { userId, status: "RETURNED" },
  });

  // Count wishlist items (optional: depends on your schema)
  const wishlistCount = await prisma.reservation.count({
    where: { userId, status: "PENDING" },
  });

  return new Response(
    JSON.stringify({
      borrowed: borrowedCount,
      returned: returnedCount,
      wishlist: wishlistCount,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
