"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Home, LogIn, LogOut, Upload } from "lucide-react";

const Header = () => {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (e) {
      console.error("Error signing out:", e);
    }
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <Link href="/" className="flex items-center gap-2">
        <Home className="w-5 h-5" />
        <span>Home</span>
      </Link>

      <nav className="flex items-center gap-4">
        {session ? (
          <>
            <Link href="/upload" className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              <span>Upload</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <Link
            href="/api/auth/signin"
            className="flex items-center gap-2 bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
          >
            <LogIn className="w-5 h-5" />
            <span>Login</span>
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
