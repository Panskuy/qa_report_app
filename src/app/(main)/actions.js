"use server";

import prisma from "@/app/libs/prisma";
import { revalidatePath } from "next/cache";

export async function MakeNewTeamApp(applicationId, namaTim) {
  if (!namaTim || namaTim.trim() === "") {
    return { success: false, error: "Nama tim wajib diisi" };
  }

  await prisma.team.create({
    data: {
      namaTim,
      application: {
        connect: { id: applicationId },
      },
    },
  });

  // refresh halaman aplikasi
  revalidatePath("/");

  return { success: true };
}
