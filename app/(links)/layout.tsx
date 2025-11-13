import Image from 'next/image';
import Menu_slide from "@/app/components/menu_slide/page";
import Navbar from "@/app/components/navbar/page";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        <Image width={1920} height={1080} className="fixed top-0 left-0 z-10 bg-[#FFFFFF]" src="background.svg" alt="Background"/>
        <Navbar />
        <Menu_slide />
        {children}
    </div>
  );
}
