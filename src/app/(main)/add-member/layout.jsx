import { auth } from "@/app/libs/auth";
import { redirect } from "next/navigation";

const layout = async ({ children }) => {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return <>{children}</>;
};

export default layout;
