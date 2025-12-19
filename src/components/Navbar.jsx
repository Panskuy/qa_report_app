import { auth } from "@/app/libs/auth";
import React from "react";
import LogoutButton from "./LogoutButton";
import Link from "next/link";
import FullscreenButton from "./FullScreenButton";

const Navbar = async () => {
  const session = await auth();

  return (
    <div className="fixed top-0 w-full z-50 bg-black">
      <div className="w-full max-w-7xl mx-auto p-4 text-white flex items-center justify-between">
        <Link href="/" className="font-bold">
          Error Reports
        </Link>

        <div className="flex items-center gap-3">
          {session?.user && <p className="text-sm mt-1">{session.user.name}</p>}

          {session && <LogoutButton />}
          <FullscreenButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
