import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { title, author, description, fileUrl, coverUrl } = req.body;

  try {
    const book = await prisma.book.create({
      data: {
        title,
        author,
        description,
        fileUrl,
        coverUrl,
      },
    });

    res.status(200).json({ message: "Book added successfully!", book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add book" });
  }
}
