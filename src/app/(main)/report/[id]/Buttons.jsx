"use client";

import React, { useState } from "react";
import {
  approveReportByQA,
  assignPICToReport,
  updateReportStatus,
} from "./action";

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
        console.error("Failed to update status:", result.error);
        alert("Gagal update status: " + result.error);
      }
    } catch (error) {
      console.error("Error:", error);
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
      await assignPICToReport(reportId, currentPIC);
      // kalau mau refresh data:
      window.location.reload();
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
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [catatan, setCatatan] = useState("");

  const handleAction = async (type) => {
    setIsLoading(true);

    try {
      const result = await approveReportByQA(reportId, type, catatan);

      if (result.success) {
        window.location.reload();
      } else {
        alert("Gagal melakukan aksi: " + result.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat proses");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  if (currentStatus === "Closed") {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-green-100 border border-green-300 rounded-md shadow-sm">
        <svg
          className="w-5 h-5 text-green-700"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-sm font-semibold text-green-800">Approved</span>
      </div>
    );
  }

  return (
    <>
      <button
        className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-blue-700 text-white text-sm font-semibold rounded-md shadow-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        onClick={() => setIsOpen(true)}
        disabled={isLoading}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        Approval
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
        >
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 space-y-6">
            <h2
              id="dialog-title"
              className="text-xl font-semibold text-gray-900 text-center"
            >
              Approv?
            </h2>

            <div className="flex justify-center gap-6">
              <button
                onClick={() => handleAction("Approved")}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-md shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isLoading ? "Processing..." : "Approve"}
              </button>
              <button
                onClick={() => handleAction("Pending")}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-md shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isLoading ? "Processing..." : "Kembalikan ke PIC"}
              </button>
            </div>

            <textarea
              type="text"
              placeholder="Masukan catatan"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              className="w-full min-h-30 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 resize-none"
            />

            <button
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
              className="w-full px-6 py-3 text-gray-700 font-semibold rounded-md border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
};
