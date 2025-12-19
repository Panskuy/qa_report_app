"use client";

import Link from "next/link";
import { useState } from "react";

/* ================== Helpers ================== */
const formatDate = (date) =>
  new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const statusStyle = (status) => {
  switch (status) {
    case "Open":
      return "bg-slate-200 text-slate-800";
    case "InProgress":
      return "bg-blue-100 text-blue-700";
    case "Closed":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
};

const severityStyle = (severity) => {
  switch (severity) {
    case "Low":
      return "bg-slate-100 text-slate-700";
    case "Medium":
      return "bg-amber-100 text-amber-700";
    case "High":
      return "bg-orange-100 text-orange-700";
    case "Critical":
      return "bg-red-100 text-red-700 font-semibold";
    default:
      return "bg-slate-100 text-slate-600";
  }
};

/* ================== Component ================== */
const TeamSection = ({ team }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-lg mb-6">
      {/* Team Header */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex justify-between items-center px-6 py-4 border-b border-slate-200 hover:bg-slate-50 transition"
      >
        {/* 🔗 Team Link */}
        <Link
          href={`/team/${team.id}`}
          onClick={(e) => e.stopPropagation()}
          className="font-medium text-slate-800 hover:underline"
        >
          Team: {team.namaTim}
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-600">
            Bug: <strong>{team._count.reports}</strong>
          </span>
          <span className="text-slate-400">{open ? "▲" : "▼"}</span>
        </div>
      </button>

      {/* Lazy Loaded Reports */}
      {open && (
        <div className="divide-y divide-slate-200">
          {/* Table Header */}
          <div className="grid grid-cols-14 px-6 py-3 text-xs font-semibold text-slate-500 uppercase bg-slate-50">
            <div className="col-span-5">Judul</div>
            <div className="col-span-2">Jenis</div>
            <div className="col-span-2">Severity</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-2 text-right">Tanggal</div>
          </div>

          {/* Table Rows */}
          {team.reports.map((report) => (
            <Link
              href={`/report/${report.id}`}
              key={report.id}
              className="grid grid-cols-14 px-6 py-4 text-sm hover:bg-slate-50 transition"
            >
              <div className="col-span-5 font-medium text-slate-800">
                {report.judul}
              </div>

              <div className="col-span-2 text-slate-600">{report.jenis}</div>

              <div className="col-span-2">
                <span
                  className={`px-2 py-1 rounded text-xs ${severityStyle(
                    report.severity
                  )}`}
                >
                  {report.severity}
                </span>
              </div>

              <div className="col-span-3">
                <span
                  className={`px-2 py-1 rounded text-xs ${statusStyle(
                    report.status
                  )}`}
                >
                  {report.status}
                </span>
              </div>

              <div className="col-span-2 text-right text-xs text-slate-500">
                {formatDate(report.createdAt)}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamSection;
