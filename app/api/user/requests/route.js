import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const requests = await prisma.reservation.findMany({
    where: {
      user: { email: session.user.email }
    },
    include: {
      book: true
    },
    orderBy: { reservedAt: "desc" }
  });

  return Response.json(requests);
}
