"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Edit, Save, X, Camera, Bookmark, TrendingUp, User } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [major, setMajor] = useState("");
  const [profileImage, setProfileImage] = useState("/default-avatar.png");

  const majors = [
    "English", "Math", "IT", "History", "Engineering", "Sociology",
    "Psychology", "Chemistry", "Physics", "Biology"
  ];

  // Load profile from API
  const loadProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");

      if (res.status === 404) {
        setUser(null);
        setProfileImage("/default-avatar.png");
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch profile");

      const data = await res.json();
      setUser(data);
      setName(data.name || "");
      setBio(data.bio || "");
      setEmail(data.email || "");
      setMajor(data.major || "");
      setProfileImage(data.profile || "/default-avatar.png");
    } catch (error) {
      console.error("Error loading profile:", error);
      setUser(null);
      setProfileImage("/default-avatar.png");
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  function handleCancel() {
    setIsEditing(false);
    if (!user) return;
    setName(user.name);
    setBio(user.bio || "");
    setEmail(user.email);
    setMajor(user.major || "");
    setProfileImage(user.profile || "/default-avatar.png");
  }

  async function handleSave() {
    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, bio, major, email }),
    });

    console.log("Response status:", res.status, res.ok);

    if (res.ok) {
    window.location.reload(); // reload immediately
  } else {
    const text = await res.text();
    console.error("Save failed:", text);
  }
  }

  function triggerFile() {
    fileInputRef.current.click();
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/user/upload", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    if (data.profile) {
      setProfileImage(data.profile);
      await loadProfile();
    }
  }

  const [stats, setStats] = useState({ borrowed: 0, returned: 0, wishlist: 0 });

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/user/stats");
        if (!res.ok) return;
        const data = await res.json();
        setStats(data);
      } catch (e) {
        console.error(e);
      }
    }
    loadStats();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-lg hover:cursor-pointer"
              >
                <X /> Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:cursor-pointer"
                
              >
                <Save /> Save
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:cursor-pointer"
            >
              <Edit /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-10">
        {/* LEFT CARD */}
        <div className="w-1/3 bg-white p-6 rounded-xl shadow-lg text-center">
          <div className="relative mx-auto w-32 h-32">
            <Image
              src={profileImage || "/default-avatar.png"}
              alt="Profile"
              width={1000}
              height={1000}
              className="rounded-full border-4 border-orange-200 object-cover max-w-32 max-h-32"
              unoptimized
              onError={() => setProfileImage("/default-avatar.png")}
            />
            {isEditing && (
              <button
                onClick={triggerFile}
                className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md"
              >
                <Camera className="text-orange-600" />
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleImageUpload}
            className="hidden"
          />

          {isEditing ? (
            <input
              className="mt-4 w-full p-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            <h2 className="mt-4 text-xl font-bold">{name}</h2>
          )}

          <p className="text-sm text-orange-500 mt-1">
            Student ID: {user.studentId}
          </p>

          <label className="block mt-4 text-left text-gray-600">Bio</label>
          {isEditing ? (
            <textarea
              className="w-full border p-2 rounded"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          ) : (
            <p className="bg-gray-50 border p-3 rounded block text-sm font-medium text-gray-500 mt-6 mb-2 text-left">
              {bio || "No bio set."}
            </p>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="w-2/3 flex flex-col gap-4">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-6">Profile Details</h3>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-600">Email</label>
                {isEditing ? (
                  <input
                    className="w-full p-2 border rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                ) : (
                  <p className="text-lg">{email}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600">Major</label>
                {isEditing ? (
                  <select
                    className="w-full p-2 border rounded"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                  >
                    <option value="">Select Major</option>
                    {majors.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-lg">{major || "Not set"}</p>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Library Activity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4 bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="bg-orange-100 p-3 rounded-full">
                  <Bookmark className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-orange-600">{stats.borrowed}</p>
                  <p className="text-sm text-gray-600">Books Borrowed</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="bg-green-100 p-3 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-600">{stats.returned}</p>
                  <p className="text-sm text-gray-600">Books Returned</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="bg-blue-100 p-3 rounded-full">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-600">{stats.wishlist}</p>
                  <p className="text-sm text-gray-600">Books in Wishlist</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
