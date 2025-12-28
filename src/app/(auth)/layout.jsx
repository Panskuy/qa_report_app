import React from "react";
import { auth } from "../libs/auth";
import { redirect } from "next/navigation";

const layout = async ({ children }) => {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-full max-w-md px-4">{children}</div>
    </div>
  );
};

export default layout;
