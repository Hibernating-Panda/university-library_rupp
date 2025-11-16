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
        <div className="min-h-screen w-full grid grid-cols-12 absolute text-black">
            <div className="col-span-10 col-start-3 z-50 bg-[#F3F3F7] mt-27">
                {children}
            </div>
        </div>
    </div>
  );
}
