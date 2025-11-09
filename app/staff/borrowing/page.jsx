import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function StaffBorrowings() {
  // Fetch all borrowings, including user and book info
  const borrowings = await prisma.borrowing.findMany({
    include: {
      book: { select: { title: true } },
      user: { select: { name: true, email: true } },
    },
    orderBy: { borrowedAt: "desc" },
  }); 

  // Server action: mark borrowing as returned
  async function markReturned(borrowingId, bookId) {
    "use server";

    // Update borrowing status
    await prisma.borrowing.update({
      where: { id: borrowingId },
      data: { status: "RETURNED", returnedAt: new Date() },
    });

    // Increment book quantity
    await prisma.book.update({
      where: { id: bookId },
      data: { quantity: { increment: 1 } },
    });
  }

  return (
    <div className="min-h-screen w-full grid grid-cols-12 pr-5 absolute">
      <div className="col-start-3 col-span-10 z-20 mt-20 pt-10 px-10 bg-[#F3F3F7]">
    <div className="py-6 px-10 text-black bg-white min-h-screen rounded-lg">
      <h1 className="text-xl font-bold mb-4">Borrowing Management</h1>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Book</th>
            <th className="border p-2">User</th>
            <th className="border p-2">Borrowed At</th>
            <th className="border p-2">Due Date</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {borrowings.map((b) => (
            <tr key={b.id}>
              <td className="border p-2 text-center">{b.book.title}</td>
              <td className="border p-2 text-center">{b.user.name} — {b.user.email}</td>
              <td className="border p-2 text-center">{new Date(b.borrowedAt).toLocaleDateString()}</td>
              <td className="border p-2 text-center">{new Date(b.dueDate).toLocaleDateString()}</td>
              <td className="border p-2 text-center">{b.status}</td>
              <td className="border p-2 text-center">
                {b.status === "BORROWED" ? (
                  <form action={markReturned.bind(null, b.id, b.bookId)}>
                    <button className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">
                      Mark Returned
                    </button>
                  </form>
                ) : (
                  <span className="text-gray-500">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
    </div>
  );
}
