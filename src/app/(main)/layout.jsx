import Navbar from "@/components/Navbar";
import React from "react";
import { auth } from "../libs/auth";
import { redirect } from "next/navigation";

const layout = async ({ children }) => {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }
  return (
    <div>
      <Navbar />
      <div className="max-w-450 mx-auto pt-20">{children}</div>
    </div>
  );
};

export default layout;
