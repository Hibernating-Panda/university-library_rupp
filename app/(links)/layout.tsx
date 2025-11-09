import Menu_slide from "@/app/components/menu_slide/page";
import Navbar from "@/app/components/navbar/page";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
 
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        <img className="fixed top-0 left-0 z-10 bg-[#FFFFFF]" src="background.svg" alt="Background" />
        <Navbar />
        <Menu_slide />
        {children}
    </div>
  );
}
