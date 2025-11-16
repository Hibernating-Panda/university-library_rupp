
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        <div className="min-h-screen w-full grid grid-cols-12 absolute text-black">
            <div className="col-span-10 col-start-3 z-50 bg-[#F3F3F7] mt-27">
                {children}
            </div>
        </div>
    </div>
  );
}
