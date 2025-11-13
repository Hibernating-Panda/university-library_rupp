import Image from 'next/image';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <img className="fixed top-0 left-0 z-10 bg-[#FFFFFF]" src="background.svg" alt="Background" />
      <div className="w-full relative flex h-screen px-6 z-20 pt-5">
          {children}
      </div>
    </div>
  );
}
