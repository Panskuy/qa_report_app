"use server";

import prisma from "@/app/libs/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "../libs/auth";

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

export async function deleteApplication(applicationId) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.application.delete({
      where: { id: applicationId },
    });

    revalidatePath("/"); // atau /applications

    return { success: true };
  } catch (error) {
    console.error("DELETE APPLICATION ERROR:", error);
    return { success: false, error: "Gagal menghapus aplikasi" };
  }
}

export async function createApplication(namaAplikasi, deskripsi) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Tidak diizinkan" };
    }

    await prisma.application.create({
      data: {
        namaAplikasi,
        deskripsi,
      },
    });

    revalidatePath("/"); // atau path list aplikasi

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Gagal membuat aplikasi" };
  }
}

export async function deleteTeam(team_Id) {
  try {
    const session = await auth();

    console.log(team_Id);

    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.team.delete({
      where: { id: team_Id },
    });

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("DELETE TEAM ERROR:", error);
    return { success: false, error: "Gagal menghapus team" };
  }
}
