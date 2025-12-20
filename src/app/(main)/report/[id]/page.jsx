import { getCurrentUser } from "@/app/libs/globalAction";
import prisma from "@/app/libs/prisma";
import ShowImage from "@/components/ShowImage";
import Image from "next/image";

import {
  ButtonApproveQA,
  ButtonAssignPIC,
  ButtonUpdateStatus,
} from "./Buttons";
import CatatanPerbaikan from "./CatatanPerbaikan";

const statusStyle = (status) => {
  switch (status) {
    case "Open":
      return "bg-red-600 text-red-100";
    case "InProgress":
      return "bg-blue-600 text-blue-100";
    case "Closed":
      return "bg-emerald-600 text-emerald-100";
    default:
      return "bg-slate-600 text-slate-100";
  }
};

const severityStyle = (severity) => {
  switch (severity) {
    case "Critical":
      return "bg-red-600 text-white";
    case "High":
      return "bg-red-600 text-white";
    case "Medium":
      return "bg-yellow-600 text-black";
    case "Low":
      return "bg-slate-600 text-slate-100";
    default:
      return "bg-slate-600 text-slate-100";
  }
};

const page = async ({ params }) => {
  const { id } = await params;

  const report = await prisma.report.findUnique({
    where: { id },
    include: {
      team: {
        include: {
          application: {
            select: {
              id: true,
              namaAplikasi: true,
            },
          },
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  const currentUser = await getCurrentUser();

  if (!report) {
    return <div className="p-8 text-slate-600">Report tidak ditemukan</div>;
  }

  // Check apakah current user adalah PIC
  const isAssignedPIC = report.assignedTo?.id === currentUser?.id;
  const isQA = currentUser?.role === "QA";

  const isClosedAndApproved =
    report.status === "Closed" && report.approval_status === "Approved";

  return (
    <div className="mx-auto space-y-8 w-full max-h-240">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center w-full">
        <header className="space-y-3">
          <h1 className="text-2xl font-semibold text-slate-900">
            {report.judul}
          </h1>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className={`px-3 py-1 rounded ${statusStyle(report.status)}`}>
              Status: {report.status}
            </span>

            <span
              className={`px-3 py-1 rounded ${severityStyle(report.severity)}`}
            >
              Severity: {report.severity}
            </span>

            <span className="px-3 py-1 rounded bg-slate-100 text-slate-700">
              Type: {report.jenis}
            </span>
          </div>

          <div className="text-sm text-slate-500">
            <p>
              Application:{" "}
              <span className="font-medium text-slate-700">
                {report.team?.application?.namaAplikasi}
              </span>
            </p>
            <p>
              Team:{" "}
              <span className="font-medium text-slate-700">
                {report.team?.namaTim}
              </span>
            </p>
          </div>
        </header>

        <div>
          <h1 className="font-semibold mb-2">Images</h1>

          <div className="flex flex-wrap gap-4">
            {report.image.length > 0 ? (
              report.image.map((img, index) => (
                <ShowImage imageUrl={img} key={index} />
              ))
            ) : (
              <p className="text-sm text-slate-500">No images found.</p>
            )}
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full ">
        <div className="lg:col-span-2 bg-white h-fit space-y-6">
          <div className="border border-slate-200 rounded-lg p-6">
            <h2 className="text-sm font-semibold text-slate-800 mb-3 uppercase ">
              Deskripsi Masalah
            </h2>
            <p
              className={`text-sm text-slate-700 whitespace-pre-line leading-relaxed ${
                report.catatan_qa !== null ? "min-h-40" : "min-h-160"
              } max-h-130 overflow-y-auto`}
            >
              {report.deskripsi || "Tidak ada deskripsi."}
            </p>
          </div>

          {report.catatan_qa && (
            <div className="border border-slate-200 rounded-lg p-6">
              <h2 className="text-sm font-semibold text-slate-800 mb-3 uppercase ">
                Catatan QA
              </h2>
              <p
                className={`text-sm text-slate-700 whitespace-pre-line leading-relaxed max-h-130 overflow-y-auto`}
              >
                {report.catatan_qa || "Tidak ada deskripsi."}
              </p>
            </div>
          )}
        </div>

        {/* RIGHT – SIDE INFO */}
        <div className="space-y-6">
          {/* PIC Section - Combined Creator & Assigned */}
          <section className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="text-sm font-semibold text-slate-800 mb-4 uppercase">
              Person In Charge
            </h2>

            <div className="space-y-4">
              {/* Creator / Pembuat */}
              <div>
                <p className="text-xs text-slate-500 mb-2 font-medium">
                  Dibuat Oleh
                </p>
                {report.createdBy ? (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                      {report.createdBy.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-slate-800">
                          {report.createdBy.name || "No name"}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-blue-600 text-white rounded font-medium">
                          {report.createdBy.role}
                        </span>
                        {isQA && report.createdBy.id === currentUser?.id && (
                          <span className="text-xs px-2 py-0.5 bg-green-600 text-white rounded font-medium">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {report.createdBy.email}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">
                    Creator tidak diketahui
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-slate-200"></div>

              {/* Assigned To / PIC DEV */}
              <div>
                <p className="text-xs text-slate-500 mb-2 font-medium">DEV</p>

                {currentUser?.role === "DEV" ? (
                  <>
                    {!report.assignedTo ? (
                      // Belum ada PIC - tampilkan tombol assign
                      <div className="space-y-2">
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-xs text-amber-800">
                            Belum ada PIC untuk report ini
                          </p>
                        </div>
                        <ButtonAssignPIC
                          reportId={report.id}
                          currentPIC={currentUser.id}
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                            {report.assignedTo.name?.charAt(0).toUpperCase() ||
                              "?"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-slate-800">
                                {report.assignedTo.name || "No name"}
                              </span>
                              <span className="text-xs px-2 py-0.5 bg-indigo-600 text-white rounded font-medium">
                                DEV
                              </span>
                              {isAssignedPIC && (
                                <span className="text-xs px-2 py-0.5 bg-green-600 text-white rounded font-medium">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 truncate">
                              {report.assignedTo.email}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  // Bukan DEV - tampilkan info PIC saja
                  <>
                    {report.assignedTo ? (
                      <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                          {report.assignedTo.name?.charAt(0).toUpperCase() ||
                            "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-slate-800">
                              {report.assignedTo.name || "No name"}
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-indigo-600 text-white rounded font-medium">
                              DEV
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 truncate">
                            {report.assignedTo.email}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <p className="text-xs text-slate-500 italic">
                          Belum ada PIC
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Timestamp */}
              <div className="text-xs text-slate-500 pt-2 border-t border-slate-200">
                Dibuat:{" "}
                {new Date(report.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </section>

          {/* Status Pengerjaan Section */}
          <section className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="text-sm font-semibold text-slate-800 mb-3 uppercase">
              Status Pengerjaan
            </h2>

            <div className="flex items-start gap-3">
              {/* Left Side - Status Pengerjaan */}
              <div className="flex-1">
                {isAssignedPIC ? (
                  // User adalah PIC - bisa update status
                  <div className="space-y-2">
                    {report.status === "Closed" &&
                    report.approval_status === "Approved" ? (
                      <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-700">
                        {report.status}
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <ButtonUpdateStatus
                          status={report.status}
                          reportId={report.id}
                        />

                        <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <span className="text-xs font-medium text-yellow-700">
                            Waiting Approval By QA
                          </span>
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-slate-500">
                      Anda dapat mengubah status pengerjaan
                    </p>
                  </div>
                ) : (
                  // Bukan PIC - read only
                  <div className="space-y-2">
                    <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-700">
                      {report.status}
                    </div>
                    {report.assignedTo && currentUser?.role === "DEV" && (
                      <p className="text-xs text-slate-500">
                        Hanya PIC yang dapat mengubah status
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Right Side - QA Approval */}
              <div className="">
                {report.status === "Closed" &&
                report.approval_status === "Approved" ? (
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-xs font-medium text-green-700">
                      Approved
                    </span>
                  </div>
                ) : isQA ? (
                  report.approval_status !== "Approved" &&
                  report.status !== "Closed" ? null : (
                    <>
                      {report.createdBy?.id === currentUser?.id && (
                        <ButtonApproveQA
                          reportId={report.id}
                          currentStatus={report.approval_status}
                        />
                      )}
                    </>
                  )
                ) : null}
              </div>
            </div>
          </section>

          {/* Perbaikan */}
          <section className="bg-white border border-slate-200 rounded-lg p-6">
            <h2 className="text-sm font-semibold text-slate-800 mb-2 uppercase">
              Catatan Perbaikan
            </h2>

            {isClosedAndApproved ? (
              <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {report.Perbaikan || "Tidak ada catatan perbaikan."}
              </p>
            ) : isAssignedPIC ? (
              <CatatanPerbaikan
                catatan_perbaikan={report.Perbaikan}
                reportId={report.id}
              />
            ) : (
              <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {report.Perbaikan || "Belum terdapat catatan perbaikan."}
              </p>
            )}

            {report.tanggal_perbaikan && (
              <p className="text-xs text-slate-500 mt-4">
                Tanggal Perbaikan:{" "}
                {new Date(report.tanggal_perbaikan).toLocaleDateString("id-ID")}
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default page;
