"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function SidebarProfile() {
  const [profile, setProfile] = useState("/default-avatar.png");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      setProfile(data.profile || "/default-avatar.png");
    }
    load();
  }, []);

  return (
    <div className="flex items-center gap-3">
      <Image
        src={profile}
        alt="Profile"
        width={2000}
        height={2000}
        className="rounded-full border border-orange-300 object-cover max-w-10 max-h-10"
      />
    </div>
  );
}
