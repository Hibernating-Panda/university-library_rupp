import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function StaffReservations() {
  const reservations = await prisma.reservation.findMany({
    where: { status: "PENDING" },
    include: {
      book: { select: { title: true, quantity: true } },
      user: { select: { name: true, email: true } },
    },
    orderBy: { reservedAt: "desc" },
  });

  async function accept(id, bookId, userId) {
    "use server";

    // Re-read current book quantity
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: { quantity: true, status: true },
    });

    if (!book) {
      // mark reservation cancelled if book not found
      await prisma.reservation.update({
        where: { id },
        data: { status: "CANCELLED" },
      });
      await prisma.notification.create({
        data: {
          userId,
          type: "SYSTEM",
          message: "Sorry, the requested book was not found.",
        },
      });
      return;
    }

    if (book.quantity <= 0) {
      // no copies available -> cancel reservation
      await prisma.reservation.update({
        where: { id },
        data: { status: "CANCELLED" },
      });

      await prisma.notification.create({
        data: {
          userId,
          type: "SYSTEM",
          message: "Sorry, no copies available",
        },
      });

      return;
    }

    // Approve (fulfill) reservation
    await prisma.reservation.update({
      where: { id },
      data: { status: "FULFILLED" }, // <-- use enum value
    });

    // Create borrowing record (7 days)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7); // Add 7 days

    await prisma.borrowing.create({
      data: {
        bookId,
      userId,
      dueDate,
      status: "BORROWED",
    },
  });

    // Reduce quantity (atomic update)
    await prisma.book.update({
      where: { id: bookId },
      data: {
        quantity: { decrement: 1 },
        // Optionally update book status if none left
        ...(book.quantity - 1 <= 0 ? { status: "BORROWED" } : {}),
      },
    });

    // Notify user (use SYSTEM since NotificationType doesn't have BORROW_ACCEPTED)
    await prisma.notification.create({
      data: {
        userId,
        type: "SYSTEM",
        message: "Your borrow request was approved.",
      },
    });
  }

  async function reject(id, userId) {
    "use server";

    await prisma.reservation.update({
      where: { id },
      data: { status: "CANCELLED" }, // <-- use enum value
    });

    await prisma.notification.create({
      data: {
        userId,
        type: "SYSTEM",
        message: "Your borrow request was rejected.",
      },
    });
  }
 
  return (
    <div className="min-h-screen w-full grid grid-cols-12 pr-5 absolute">
      <div className="col-start-3 col-span-10 z-20 pt-30 px-20 bg-[#F3F3F7]">
    <div className="p-6 text-black bg-white rounded-lg">
      <h1 className="text-xl font-bold mb-4">Borrow Requests</h1>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Book</th>
            <th className="border p-2">User</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r.id}>
              <td className="border p-2">
                {r.book.title} ({r.book.quantity} left)
              </td>
              <td className="border p-2">
                {r.user.name} — {r.user.email}
              </td>
              <td className="border p-2 space-x-2">
                <form action={accept.bind(null, r.id, r.bookId, r.userId)}>
                  <button className="bg-green-600 text-white px-2 py-1 rounded">Accept</button>
                </form>
                <form action={reject.bind(null, r.id, r.userId)}>
                  <button className="bg-red-600 text-white px-2 py-1 rounded">Reject</button>
                </form>
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
