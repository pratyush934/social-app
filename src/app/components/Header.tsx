"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Header = () => {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (e) {}
  };

  return (
    <div>
      <button onClick={handleSignOut}>Sign Out</button>
      <Link href={"/lgoin"}>Login</Link>
      <Link href={"/register"}>Register</Link>
    </div>
  );
};

export default Header;
