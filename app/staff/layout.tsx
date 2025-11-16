import StaffMenu from "@/app/components/staff_menu/page";
import StaffNavbar from "@/app/components/staffnav/page";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
  {/* Background layer */}
  <div
    className="fixed top-0 left-0 w-screen h-screen bg-[#FFFFFF] z-10"
    style={{ backgroundImage: "url('/background.svg')" }}
  />

  {/* Navbar & Menu */}
  <div className="relative">
    <StaffNavbar />
    <StaffMenu />
  </div>

  {/* Main Content */}
  <main className="relative">{children}</main>
</div>

  );
}
