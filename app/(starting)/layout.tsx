import Image from 'next/image';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Image width={1920} height={1080} className="fixed top-0 left-0 z-10 bg-[#FFFFFF] w-full" src="background.svg" alt="Background"/>
      <div className="w-full relative flex h-screen px-6 z-20 pt-5">
        {children}
      </div>
    </div>
  );
}
