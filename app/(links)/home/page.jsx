import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ClientHome from "./ClientHome";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  const books = await prisma.book.findMany({
    select: {
      id: true,
      title: true,
      author: true,
      coverImageUrl: true,
      quantity: true,
      category: true
    },
    orderBy: { createdAt: "desc" }
  });

  return <ClientHome user={user} initialBooks={books} />;
}
