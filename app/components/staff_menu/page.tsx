import Link from "next/link";
import Image from "next/image";

export default function MenuBar() {
  return (
    <div className="min-h-screen pt-5 pl-5 fixed top-0 left-0 w-2/12 z-50">
      <div className="bg-white min-h-screen rounded-tl-lg p-5 flex w-full justify-between flex-col">

      <div className="flex flex-col gap-10 w-full">
        {/* Logo/Title */}
        <Link href="/" className="flex items-center gap-2">
          <Image width={50} height={50} src="/logo.png" alt="Logo" />
          <div>
            <p className="text-xl font-bold text-[#FA7C54]">Library</p>
            <p className="text-sm text-gray-600">Staff</p>
          </div>
        </Link> 
  
        {/* Navigation Menu */}
        <nav className="flex flex-col gap-8 justify-between">
          <Link 
            href="/staff" 
            className="group flex items-center gap-3 text-gray-800 hover:text-orange-500 transition-colors"
          >
            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M8.38686 0.336827C8.83596 -0.112276 9.5641 -0.112276 10.0132 0.336827L18.0632 8.38683C18.3921 8.71572 18.4905 9.21036 18.3125 9.64009C18.1345 10.0698 17.7152 10.35 17.25 10.35H16.1V17.25C16.1 17.8851 15.5852 18.4 14.95 18.4H12.65C12.0149 18.4 11.5 17.8851 11.5 17.25V13.8C11.5 13.1649 10.9852 12.65 10.35 12.65H8.05003C7.41491 12.65 6.90003 13.1649 6.90003 13.8V17.25C6.90003 17.8851 6.38516 18.4 5.75003 18.4H3.45003C2.81491 18.4 2.30003 17.8851 2.30003 17.25V10.35H1.15003C0.684902 10.35 0.26557 10.0698 0.0875721 9.64009C-0.090426 9.21036 0.00796312 8.71572 0.336861 8.38683L8.38686 0.336827Z" fill="currentColor"/>
            </svg>
            <span className="text-xl font-sans font-normal">Home</span>
          </Link>
          
          <Link 
            href="/staff/books"
            className="group flex items-center gap-3 text-gray-800 hover:text-orange-500 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 4.84969V16.7397C22 17.7097 21.21 18.5997 20.24 18.7197L19.93 18.7597C18.29 18.9797 15.98 19.6597 14.12 20.4397C13.47 20.7097 12.75 20.2197 12.75 19.5097V5.59969C12.75 5.22969 12.96 4.88969 13.29 4.70969C15.12 3.71969 17.89 2.83969 19.77 2.67969H19.83C21.03 2.67969 22 3.64969 22 4.84969Z" fill="currentColor"/>
              <path d="M10.7083 4.70969C8.87828 3.71969 6.10828 2.83969 4.22828 2.67969H4.15828C2.95828 2.67969 1.98828 3.64969 1.98828 4.84969V16.7397C1.98828 17.7097 2.77828 18.5997 3.74828 18.7197L4.05828 18.7597C5.69828 18.9797 8.00828 19.6597 9.86828 20.4397C10.5183 20.7097 11.2383 20.2197 11.2383 19.5097V5.59969C11.2383 5.21969 11.0383 4.88969 10.7083 4.70969ZM4.99828 7.73969H7.24828C7.65828 7.73969 7.99828 8.07969 7.99828 8.48969C7.99828 8.90969 7.65828 9.23969 7.24828 9.23969H4.99828C4.58828 9.23969 4.24828 8.90969 4.24828 8.48969C4.24828 8.07969 4.58828 7.73969 4.99828 7.73969ZM7.99828 12.2397H4.99828C4.58828 12.2397 4.24828 11.9097 4.24828 11.4897C4.24828 11.0797 4.58828 10.7397 4.99828 10.7397H7.99828C8.40828 10.7397 8.74828 11.0797 8.74828 11.4897C8.74828 11.9097 8.40828 12.2397 7.99828 12.2397Z" fill="currentColor"/>
            </svg>

            <span className="text-xl font-sans font-normal">Books</span>
          </Link>
           
          <Link
            href="/staff/upload"
            className="group flex items-center gap-3 text-gray-800 hover:text-orange-500 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 640 640" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M342.6 73.4C330.1 60.9 309.8 60.9 297.3 73.4L169.3 201.4C156.8 213.9 156.8 234.2 169.3 246.7C181.8 259.2 202.1 259.2 214.6 246.7L288 173.3L288 384C288 401.7 302.3 416 320 416C337.7 416 352 401.7 352 384L352 173.3L425.4 246.7C437.9 259.2 458.2 259.2 470.7 246.7C483.2 234.2 483.2 213.9 470.7 201.4L342.7 73.4zM160 416C160 398.3 145.7 384 128 384C110.3 384 96 398.3 96 416L96 480C96 533 139 576 192 576L448 576C501 576 544 533 544 480L544 416C544 398.3 529.7 384 512 384C494.3 384 480 398.3 480 416L480 480C480 497.7 465.7 512 448 512L192 512C174.3 512 160 497.7 160 480L160 416z" fill="currentColor"/></svg>
            <span className="text-xl font-sans font-normal">Upload</span>
          </Link>

          <Link
            href="/staff/borrowing"
            className="group flex items-center gap-3 text-gray-800 hover:text-orange-500 transition-colors"
          >
            <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M96 160C96 124.7 124.7 96 160 96L480 96C515.3 96 544 124.7 544 160L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 160zM160 160L160 224L224 224L224 160L160 160zM480 160L288 160L288 224L480 224L480 160zM160 288L160 352L224 352L224 288L160 288zM480 288L288 288L288 352L480 352L480 288zM160 416L160 480L224 480L224 416L160 416zM480 416L288 416L288 480L480 480L480 416z" fill="currentColor" /></svg>
            <span className="text-xl font-sans font-normal">Borrowers</span>
          </Link>

          <Link
            href="/staff/reservations"
            className="group flex items-center gap-3 text-gray-800 hover:text-orange-500 transition-colors"
          >
            <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 479 511.83"><path d="M219.08 0h197.57v226.67c-.36 6.16-8.32 6.3-16.92 5.92H216.16c-11.88 0-21.6 9.72-21.6 21.62 0 11.89 9.72 21.61 21.6 21.61h191.48v-23h16.91v29.24c0 5.32-4.34 9.66-9.68 9.66H217.01c-27.07 0-38.91-9.57-38.91-30.97V40.98C178.1 18.44 196.53 0 219.08 0zM6.73 300.41h82.33c3.7 0 6.73 3.03 6.73 6.73v159.27c0 3.71-3.03 6.73-6.73 6.73H6.73c-3.7 0-6.73-3.02-6.73-6.73V307.14c0-3.7 3.03-6.73 6.73-6.73zm110.4 158.79V315.82c70.69 1.65 84.62-1.24 147.39 40.35l50.09 1.17c22.64 1.89 33.98 25.15 11.61 39.74-17.88 12.46-41.03 11.19-64.73 8.51-16.36-1.18-17.59 20.81-.49 21.29 5.92.6 12.4-.64 18.04-.52 29.65.66 54.2-4.44 69.69-27.51l7.92-17.35 75.37-35.21c37.57-11.41 63.15 28.21 35.06 54.69-54.88 38.01-110.99 69.04-168.2 93.81-41.69 24.05-82.79 22.24-123.34-2.87l-58.41-32.72z" fill="currentColor"/></svg>
            <span className="text-xl font-sans font-normal">Borrow Lists</span>
          </Link>

        </nav>
      </div>
      <Link href="/logout" className="mb-20 px-4 py-2 rounded-md border border-red-500 text-red-600 hover:bg-red-50">
        Log out
      </Link>
      </div>
    </div>
  );
}
