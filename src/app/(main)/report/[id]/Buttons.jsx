"use client";

import React, { useState } from "react";
import {
  approveReportByQA,
  assignPICToReport,
  editDeskripsiQA,
  updateReportStatus,
} from "./action";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const ButtonUpdateStatus = ({ status, reportId }) => {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sesuaikan dengan enum ReportStatus
  const statusOptions = ["Open", "InProgress", "Closed"];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Open":
        return {
          bg: "bg-blue-50 hover:bg-blue-100 border-blue-200",
          text: "text-blue-700",
          dot: "bg-blue-500",
        };
      case "InProgress":
        return {
          bg: "bg-amber-50 hover:bg-amber-100 border-amber-200",
          text: "text-amber-700",
          dot: "bg-amber-500",
        };
      case "Closed":
        return {
          bg: "bg-slate-50 hover:bg-slate-100 border-slate-200",
          text: "text-slate-700",
          dot: "bg-slate-400",
        };
      default:
        return {
          bg: "bg-slate-50 hover:bg-slate-100 border-slate-200",
          text: "text-slate-700",
          dot: "bg-slate-400",
        };
    }
  };

  // Format display text
  const formatStatusText = (status) => {
    if (status === "InProgress") return "In Progress";
    return status;
  };

  const handleStatusChange = async (newStatus) => {
    setIsLoading(true);

    try {
      const result = await updateReportStatus(reportId, newStatus);

      if (result.success) {
        setCurrentStatus(newStatus);
        setIsOpen(false);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      alert("Terjadi kesalahan saat update status");
    } finally {
      setIsLoading(false);
    }
  };

  const currentStyle = getStatusStyle(currentStatus);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={`
          inline-flex items-center gap-2 px-4 py-2 
          border rounded-md font-medium text-sm
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${
            isLoading
              ? "bg-gray-100 border-gray-300 text-gray-500"
              : `${currentStyle.bg} ${currentStyle.text} border`
          }
        `}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            isLoading ? "bg-gray-400" : currentStyle.dot
          }`}
        />
        {isLoading ? "Updating..." : formatStatusText(currentStatus)}
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && !isLoading && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute top-full left-0 mt-2 min-w-50 bg-white border border-gray-200 rounded-md shadow-lg z-20 overflow-hidden">
            <div className="py-1">
              {statusOptions.map((option) => {
                const optionStyle = getStatusStyle(option);
                return (
                  <button
                    key={option}
                    onClick={() => handleStatusChange(option)}
                    className={`
                      w-full px-4 py-2.5 text-left text-sm
                      flex items-center gap-3
                      transition-colors duration-150
                      ${
                        option === currentStatus
                          ? `${optionStyle.bg} ${optionStyle.text} font-medium`
                          : "hover:bg-gray-50 text-gray-700"
                      }
                    `}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${optionStyle.dot}`}
                    />
                    {formatStatusText(option)}
                    {option === currentStatus && (
                      <svg
                        className="w-4 h-4 ml-auto"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export const ButtonAssignPIC = ({ reportId, currentPIC }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const result = await assignPICToReport(reportId, currentPIC);

      if (!result.success) {
        toast.error(result.error);
      }
    } catch (error) {
      console.error(error);
      alert("Gagal mengambil PIC");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubmit}
      disabled={isLoading}
      className={`
        px-3 py-1.5 text-sm font-semibold rounded-lg
        border border-blue-600
        transition-all flex items-center gap-2
        ${
          isLoading
            ? "bg-blue-600 text-white cursor-not-allowed"
            : "bg-white text-blue-600 hover:bg-blue-600 hover:text-white"
        }
      `}
    >
      {isLoading && (
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}

      {isLoading ? "Mengambil..." : "Ambil"}
    </button>
  );
};

export const ButtonApproveQA = ({ reportId, currentStatus }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [catatan, setCatatan] = useState("");

  const handleAction = async (status) => {
    if (!catatan.trim()) {
      alert("Catatan wajib diisi");
      return;
    }

    setLoading(true);

    try {
      const result = await approveReportByQA(reportId, status, catatan);

      if (!result.success) {
        alert(result.error);
        return;
      }

      window.location.reload(); // bisa diganti revalidate
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  /* =====================
     STATUS CLOSED / APPROVED
  ====================== */
  if (currentStatus === "Closed") {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-green-700 bg-green-100 border border-green-300 rounded-md">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        Approved
      </span>
    );
  }

  /* =====================
     ACTION BUTTON
  ====================== */
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={loading}
        className="
          inline-flex items-center justify-center
          px-5 py-2 text-sm font-semibold
          bg-blue-700 text-white rounded-md
          hover:bg-blue-800 transition
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        Approval QA
      </button>

      {/* =====================
          MODAL
      ====================== */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-xl p-6 space-y-5 animate-fadeIn">
            <h2 className="text-lg font-semibold text-slate-800 text-center">
              Konfirmasi Approval QA
            </h2>

            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Tambahkan catatan untuk developer..."
              rows={4}
              className="
                w-full border border-slate-300 rounded-md p-3 text-sm
                focus:ring-2 focus:ring-slate-800/20
                resize-none
              "
            />

            <div className="flex gap-3">
              <button
                onClick={() => handleAction("Approved")}
                disabled={loading}
                className="
                  flex-1 px-4 py-2 text-sm font-semibold
                  bg-green-600 text-white rounded-md
                  hover:bg-green-700 transition
                  disabled:opacity-50
                "
              >
                {loading ? "Processing..." : "Approve"}
              </button>

              <button
                onClick={() => handleAction("Pending")}
                disabled={loading}
                className="
                  flex-1 px-4 py-2 text-sm font-semibold
                  bg-red-600 text-white rounded-md
                  hover:bg-red-700 transition
                  disabled:opacity-50
                "
              >
                {loading ? "Processing..." : "Kembalikan ke PIC"}
              </button>
            </div>

            <button
              onClick={() => setOpen(false)}
              disabled={loading}
              className="
                w-full px-4 py-2 text-sm
                border border-slate-300 rounded-md
                hover:bg-slate-100 transition
                disabled:opacity-50
              "
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export const ButtonEditDeskripsi = ({ reportId, initialValue = "" }) => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [deskripsi, setDeskripsi] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const openModal = () => {
    setMounted(true);
    requestAnimationFrame(() => setOpen(true));
  };

  const closeModal = () => {
    setOpen(false);
    setTimeout(() => setMounted(false), 200);
  };

  const handleSubmit = async () => {
    setLoading(true);

    const result = await editDeskripsiQA(reportId, deskripsi);

    if (!result.success) {
      closeModal();
      toast.error(result.error);
      setLoading(false);
      router.refresh();
    } else {
      closeModal();
    }

    setLoading(false);
  };

  return (
    <>
      {/* BUTTON */}
      <button
        onClick={openModal}
        className="px-3 py-1.5 text-xs font-semibold
        border border-slate-300 rounded-md
        text-slate-700 hover:bg-slate-100 transition"
      >
        Edit Deskripsi
      </button>

      {/* MODAL */}
      {mounted && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center
          bg-black/40 transition-opacity duration-200
          ${open ? "opacity-100" : "opacity-0"}`}
        >
          <div
            className={`bg-white w-full max-w-lg rounded-lg shadow-lg p-6
            transform transition-all duration-200
            ${open ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              Edit Deskripsi
            </h2>

            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              rows={5}
              className="w-full border border-slate-300 rounded-md p-3 text-sm
              focus:ring-2 focus:ring-slate-800/20"
            />

            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
              <button
                onClick={closeModal}
                disabled={loading}
                className="px-4 py-2 text-sm border border-slate-300 rounded-md hover:bg-slate-100"
              >
                Batal
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 text-sm font-semibold
                bg-slate-800 text-white rounded-md
                hover:bg-slate-900 disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
