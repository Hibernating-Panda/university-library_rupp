import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  let session: any = null;
  try {
    session = (await getServerSession(authOptions as any)) as any;
  } catch (e) {
    session = null;
  }
  const userName = session?.user?.name as string | undefined;

  return (
    <div className="flex-col min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <div className="w-full h-20 bg-white flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div>Nav Bar</div>
          {userName ? (
            <span className="text-sm text-zinc-600">Signed in as {userName}</span>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          {!userName ? (
            <>
              <Link href="/signup" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Sign up</Link>
              <Link href="/login" className="px-4 py-2 rounded-md border border-zinc-300 hover:bg-zinc-100">Log in</Link>
            </>
          ) : (
            <Link href="/logout" className="px-4 py-2 rounded-md border border-red-500 text-red-600 hover:bg-red-50">Log out</Link>
          )}
        </div>
      </div>
      <div className="min-h-full pt-20 w-40 bg-blue-500 flex">
        Sidebar
      </div>
    </div>
  );
}
