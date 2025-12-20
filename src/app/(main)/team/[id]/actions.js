"use server";

import { auth } from "@/app/libs/auth";
import cloudinary from "@/app/libs/cloudinary";
import prisma from "@/app/libs/prisma";
import { revalidatePath } from "next/cache";

async function generateUniqueReportCode(jenis) {
  let kode = "";
  let isUnique = false;

  while (!isUnique) {
    const random = Math.floor(1000 + Math.random() * 9000);
    kode = `${jenis}-${random}`;

    const exists = await prisma.report.findUnique({
      where: { kode },
    });

    if (!exists) isUnique = true;
  }

  return kode;
}

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

    const kode = await generateUniqueReportCode("RPRT");

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
        kode, // ✅ SIMPAN KODE REPORT
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

    revalidatePath(`/team/${teamId}`);

    return { success: true, kode };
  } catch (error) {
    console.error("CREATE BUG ERROR:", error);
    throw new Error("Gagal membuat laporan bug");
  }
}
