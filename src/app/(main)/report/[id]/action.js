"use server";

import prisma from "@/app/libs/prisma";
import { revalidatePath } from "next/cache";

export async function updateReportStatus(reportId, newStatus) {
  try {
    // Validasi status harus sesuai enum ReportStatus
    const validStatuses = ["Open", "InProgress", "Closed"];

    if (!validStatuses.includes(newStatus)) {
      return {
        success: false,
        error: "Invalid status value",
      };
    }

    const updatedReport = await prisma.report.update({
      where: {
        id: reportId,
      },
      data: {
        status: newStatus, // field yang pakai enum
      },
    });

    revalidatePath("/reports");

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
    console.log("Assigning PIC:", { reportId, currentPIC });

    const updatedReport = await prisma.report.update({
      where: {
        id: reportId,
      },

      data: {
        assignedToId: currentPIC,
      },
    });

    revalidatePath("/reports");
  } catch (error) {
    console.error("Error assigning PIC:", error);
  }
}

export async function updateCatatanPerbaikan(reportId, catatan) {
  try {
    const updatedReport = await prisma.report.update({
      where: {
        id: reportId,
      },
      data: {
        Perbaikan: catatan,
        tanggal_perbaikan: catatan ? new Date() : null, // Set tanggal jika ada catatan
      },
    });

    revalidatePath("/reports");
    revalidatePath(`/reports/${reportId}`); // Revalidate halaman detail

    return {
      success: true,
      data: updatedReport,
    };
  } catch (error) {
    console.error("Error updating catatan perbaikan:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function approveReportByQA(reportId, newApprovalStatus) {
  try {
    if (newApprovalStatus === "Approved") {
      const updatedReport = await prisma.report.update({
        where: {
          id: reportId,
        },
        data: {
          approval_status: "Approved", // Update jadi Approved
          status: "Closed", // Contoh, juga update status jadi Closed
        },
      });

      revalidatePath("/reports");
      revalidatePath(`/reports/${reportId}`);

      return {
        success: true,
        data: updatedReport,
      };
    }

    if (newApprovalStatus === "Pending") {
      const updatedReport = await prisma.report.update({
        where: {
          id: reportId,
        },
        data: {
          approval_status: "Pending",
          status: "Open", // Contoh reset status jadi Open
        },
      });

      revalidatePath("/reports");
      revalidatePath(`/reports/${reportId}`);

      return {
        success: true,
        data: updatedReport,
      };
    }

    return {
      success: false,
      error: "Invalid approval status",
    };
  } catch (error) {
    console.error("Error approving report:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
