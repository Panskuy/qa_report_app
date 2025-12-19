"use client";

import { signOut } from "next-auth/react";

const LogoutButton = () => {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/signin" })}
      className="px-4 py-1 text-sm rounded bg-red-600 hover:bg-red-700 transition"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
