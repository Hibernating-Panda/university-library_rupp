import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ClientHome from "./ClientHome";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  const books = await prisma.book.findMany({
  where: {
    borrowings: {
      some: {
        userId: user?.id,
        status: "BORROWED"
      }
    }
  },
  select: {
    id: true,
    title: true,
    author: true,
    coverImageUrl: true,
    quantity: true,
    category: true,
    borrowings: {
      where: {
        userId: user?.id,
        status: "BORROWED"
      },
      select: {
        borrowedAt: true,
        dueDate: true
      }
    }
  },
  orderBy: { createdAt: "desc" }
});


  return <ClientHome user={user} initialBooks={books} />;
}
