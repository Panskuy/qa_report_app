"use server";

import { auth } from "@/app/libs/auth";
import prisma from "@/app/libs/prisma";
import { revalidatePath } from "next/cache";

export async function updateReportStatus(reportId, newStatus) {
  try {
    // 1️⃣ Validasi enum status
    const validStatuses = ["Open", "InProgress", "Closed"];
    if (!validStatuses.includes(newStatus)) {
      return {
        success: false,
        error: "Invalid status value",
      };
    }

    // 2️⃣ Ambil approval status
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      select: {
        approval_status: true,
      },
    });

    if (!report) {
      return {
        success: false,
        error: "Report not found",
      };
    }

    // 3️⃣ Kalau sudah Approved → STOP update
    if (report.approval_status === "Approved") {
      // Tetap refresh UI
      revalidatePath(`/report/${reportId}`);
      revalidatePath(`/team`);

      return {
        success: false,
        error: "Report sudah di-approve QA dan tidak bisa diubah",
      };
    }

    // 4️⃣ Update status kalau belum approved
    const updatedReport = await prisma.report.update({
      where: { id: reportId },
      data: {
        status: newStatus,
      },
    });

    // 5️⃣ Revalidate halaman yang relevan
    revalidatePath(`/report/${reportId}`);
    revalidatePath(`/team`);

    return {
      success: true,
      data: updatedReport,
    };
  } catch (error) {
    console.error("Error updating status:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function assignPICToReport(reportId, currentPIC) {
  try {
    // 1️⃣ Ambil PIC saat ini
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      select: {
        assignedToId: true,
      },
    });

    if (!report) {
      return {
        success: false,
        error: "Report tidak ditemukan",
      };
    }

    // 2️⃣ Jika PIC sudah ada → STOP
    if (report.assignedToId) {
      revalidatePath(`/report/${reportId}`);
      revalidatePath(`/reports`);

      return {
        success: false,
        error: "PIC sudah ditentukan dan tidak bisa diubah",
      };
    }

    // 3️⃣ Assign PIC
    const updatedReport = await prisma.report.update({
      where: { id: reportId },
      data: {
        assignedToId: currentPIC,
      },
    });

    // 4️⃣ Revalidate UI
    revalidatePath(`/report/${reportId}`);
    revalidatePath(`/reports`);

    return {
      success: true,
      data: updatedReport,
    };
  } catch (error) {
    console.error("Error assigning PIC:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function updateCatatanPerbaikan(reportId, catatan) {
  try {
    // 🔎 Ambil status approval QA
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      select: {
        approval_status: true,
      },
    });

    if (!report) {
      return {
        success: false,
        error: "Report tidak ditemukan",
      };
    }
    if (report.approval_status === "Approved") {
      return {
        success: false,
        error:
          "Catatan perbaikan tidak dapat diubah karena report sudah di-approve QA",
      };
    }

    const updatedReport = await prisma.report.update({
      where: { id: reportId },
      data: {
        Perbaikan: catatan,
        tanggal_perbaikan: catatan ? new Date() : null,
      },
    });

    revalidatePath("/reports");
    revalidatePath(`/reports/${reportId}`);

    return {
      success: true,
      data: updatedReport,
    };
  } catch (error) {
    console.error("Error updating catatan perbaikan:", error);
    return {
      success: false,
      error: "Terjadi kesalahan server",
    };
  }
}

export async function approveReportByQA(reportId, newApprovalStatus, catatan) {
  try {
    const updatedReport = await prisma.report.update({
      where: { id: reportId },
      data: {
        approval_status: newApprovalStatus,
        status: newApprovalStatus === "Approved" ? "Closed" : "Open",
        catatan_qa: catatan,
        tanggal_approval_qa:
          newApprovalStatus === "Approved" ? new Date() : null,
      },
    });

    revalidatePath(`/report/${reportId}`);
    revalidatePath(`/team`);

    return { success: true, data: updatedReport };
  } catch (error) {
    console.error("Error approving report:", error);
    return { success: false, error: error.message };
  }
}

export async function editDeskripsiQA(reportId, newValue) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const report = await prisma.report.findUnique({
      where: { id: reportId },
      select: {
        createdById: true,
        assignedToId: true,
      },
    });

    if (!report) {
      return { success: false, error: "Report tidak ditemukan" };
    }

    // 🔒 VALIDASI ROLE & OWNER
    if (user.role !== "QA" || report.createdById !== user.id) {
      revalidatePath(`/reports/${reportId}`);
      return { success: false, error: "Akses ditolak" };
    }

    if (report.assignedToId !== null) {
      return {
        success: false,
        error:
          "Tidak dapat mengubah Deskripsi, karena Report ini sudah di ambil Oleh Developer",
      };
    }

    await prisma.report.update({
      where: { id: reportId },
      data: {
        deskripsi: newValue,
      },
    });

    revalidatePath("/reports");
    revalidatePath(`/reports/${reportId}`);

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Server error" };
  }
}
