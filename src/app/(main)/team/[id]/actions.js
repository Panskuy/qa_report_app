"use server";

import { auth } from "@/app/libs/auth";
import cloudinary from "@/app/libs/cloudinary";
import prisma from "@/app/libs/prisma";
import { revalidatePath } from "next/cache";

export async function createBugReport(formData) {
  try {
    const judul = formData.get("judul");
    const jenis = formData.get("jenis");
    const severity = formData.get("severity");
    const teamId = formData.get("teamId");
    const files = formData.getAll("images");
    const deskripsi = formData.get("deskripsi");

    const session = await auth();
    const userId = session?.user?.id;

    const imageUrls = [];

    for (const file of files) {
      if (!file || file.size === 0) continue;

      const buffer = Buffer.from(await file.arrayBuffer());

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "bug-reports" }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          })
          .end(buffer);
      });

      imageUrls.push(uploadResult.secure_url);
    }

    await prisma.report.create({
      data: {
        judul,
        jenis,
        severity,
        deskripsi,
        status: "Open",
        image: imageUrls,

        team: {
          connect: { id: teamId },
        },

        createdBy: userId ? { connect: { id: userId } } : undefined,
      },
    });

    // ✅ INI YANG BIKIN HALAMAN KE-REFRESH
    revalidatePath(`/team/${teamId}`);

    return { success: true };
  } catch (error) {
    console.error("CREATE BUG ERROR:", error);
    throw new Error("Gagal membuat laporan bug");
  }
}
