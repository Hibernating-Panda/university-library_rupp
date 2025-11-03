import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const books = await prisma.book.findMany({
      orderBy: { id: "desc" },
    });

    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
}
