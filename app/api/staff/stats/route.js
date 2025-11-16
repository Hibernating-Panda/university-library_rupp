export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const userId = session.user.id;

  const uploaded = await prisma.book.count({ where: { uploaderId: userId } });
  const accepted = await prisma.request.count({ where: { staffId: userId, status: "ACCEPTED" } });
  const rejected = await prisma.request.count({ where: { staffId: userId, status: "REJECTED" } });

  return new Response(JSON.stringify({ uploaded, accepted, rejected }), {
    headers: { "Content-Type": "application/json" },
  });
}
