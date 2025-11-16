import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function StaffBorrowings() {
  const borrowings = await prisma.borrowing.findMany({
    include: {
      book: { select: { title: true } },
      user: { select: { name: true, email: true } },
    },
    orderBy: { borrowedAt: "desc" },
  });

  async function markReturned(borrowingId, bookId) {
    "use server";

    await prisma.borrowing.update({
      where: { id: borrowingId },
      data: { status: "RETURNED", returnedAt: new Date() },
    });

    await prisma.book.update({
      where: { id: bookId },
      data: { quantity: { increment: 1 } },
    });
  }

  return (
    <div className="min-h-screen w-full grid grid-cols-12 pr-5 absolute">
      <div className="col-start-3 col-span-10 z-20 mt-20 pt-10 px-10 bg-[#F3F3F7]">
        <div className="py-6 px-10 text-black bg-white min-h-screen rounded-lg">
          <h1 className="text-2xl font-semibold mb-6 text-gray-800">Borrowing Management</h1>

          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-gray-50 border-b text-gray-600">
                <tr>
                  <th className="p-3 text-left font-semibold">Book</th>
                  <th className="p-3 text-left font-semibold">User</th>
                  <th className="p-3 text-center font-semibold">Borrowed At</th>
                  <th className="p-3 text-center font-semibold">Due Date</th>
                  <th className="p-3 text-center font-semibold">Status</th>
                  <th className="p-3 text-center font-semibold">Action</th>
                </tr>
              </thead>

              <tbody>
                {borrowings.map((b, index) => (
                  <tr
                    key={b.id}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition`}
                  >
                    <td className="p-3">{b.book.title}</td>
                    <td className="p-3">{b.user.name} <span className="text-xs text-gray-500">({b.user.email})</span></td>
                    <td className="p-3 text-center">{new Date(b.borrowedAt).toLocaleDateString()}</td>
                    <td className="p-3 text-center">{new Date(b.dueDate).toLocaleDateString()}</td>

                    <td className="p-3 text-center">
                      {b.status === "BORROWED" ? (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                          Borrowed
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                          Returned
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-center">
                      {b.status === "BORROWED" ? (
                        <form action={markReturned.bind(null, b.id, b.bookId)}>
                          <button
                            className="px-3 py-1 text-xs font-medium rounded-md bg-green-600 text-white hover:bg-green-700 transition cursor-pointer"
                          >
                            Mark Returned
                          </button>
                        </form>
                      ) : (
                        <span className="text-gray-300 text-lg">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
