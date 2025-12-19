import React from "react";
import { auth } from "../libs/auth";
import { redirect } from "next/navigation";

const layout = async ({ children }) => {
  const session = await auth();

  if (session) {
    redirect("/");
  }
  return <div>{children}</div>;
};

export default layout;
