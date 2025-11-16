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

    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: { quantity: true, status: true },
    });

    if (!book) {
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

    await prisma.reservation.update({
      where: { id },
      data: { status: "FULFILLED" },
    });

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    await prisma.borrowing.create({
      data: {
        bookId,
        userId,
        dueDate,
        status: "BORROWED",
      },
    });

    await prisma.book.update({
      where: { id: bookId },
      data: {
        quantity: { decrement: 1 },
        ...(book.quantity - 1 <= 0 ? { status: "BORROWED" } : {}),
      },
    });

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
      data: { status: "CANCELLED" },
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
          <h1 className="text-2xl font-semibold mb-6 text-gray-800">Borrow Requests</h1>

          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-gray-50 border-b text-gray-600">
                <tr>
                  <th className="p-3 text-left font-semibold">Book</th>
                  <th className="p-3 text-left font-semibold">User</th>
                  <th className="p-3 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r, index) => (
                  <tr
                    key={r.id}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition`}
                  >
                    <td className="p-3">
                      <span className="font-medium">{r.book.title}</span>{" "}
                      <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                        {r.book.quantity} left
                      </span>
                    </td>

                    <td className="p-3">
                      {r.user.name}{" "}
                      <span className="text-xs text-gray-500">({r.user.email})</span>
                    </td>

                    <td className="p-3 text-center space-x-2">
                      <form action={accept.bind(null, r.id, r.bookId, r.userId)} className="inline-block">
                        <button className="px-3 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition cursor-pointer">
                          Accept
                        </button>
                      </form>

                      <form action={reject.bind(null, r.id, r.userId)} className="inline-block">
                        <button className="px-3 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700 transition cursor-pointer">
                          Reject
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}

                {reservations.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-gray-500">
                      No pending requests
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
