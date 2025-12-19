"use client";

import { useState } from "react";

/* ================= Helpers ================= */
const statusStyle = (status) => {
  switch (status) {
    case "Open":
      return "bg-red-100 text-red-700";
    case "InProgress":
      return "bg-blue-100 text-blue-700";
    case "Closed":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
};

/* ================= Component ================= */
const TeamReportClient = ({ team }) => {
  const [filters, setFilters] = useState(["All"]);

  const toggleFilter = (value) => {
    if (value === "All") {
      setFilters(["All"]);
    } else {
      setFilters((prev) => {
        const next = prev.includes(value)
          ? prev.filter((f) => f !== value)
          : [...prev.filter((f) => f !== "All"), value];

        return next.length === 0 ? ["All"] : next;
      });
    }
  };

  const filteredReports = filters.includes("All")
    ? team.reports
    : team.reports.filter((r) => filters.includes(r.status));

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          Team {team.namaTim}
        </h1>
        <p className="text-sm text-slate-500">
          Application: {team.application?.nama ?? "-"}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="flex flex-wrap gap-6 text-sm">
          {["All", "Open", "InProgress", "Closed"].map((status) => (
            <label
              key={status}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.includes(status)}
                onChange={() => toggleFilter(status)}
                className="rounded border-slate-300"
              />
              <span className="text-slate-700">
                {status === "InProgress" ? "In Progress" : status}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Cards */}
      {filteredReports.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-6 text-sm text-slate-500">
          Tidak ada data sesuai filter
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-sm transition"
            >
              <h3 className="font-medium text-slate-800 mb-2 line-clamp-2">
                {report.judul}
              </h3>

              <div className="flex flex-wrap gap-2 text-xs mb-4">
                <span className="px-2 py-1 rounded bg-slate-100 text-slate-600">
                  {report.jenis}
                </span>

                <span className="px-2 py-1 rounded bg-slate-100 text-slate-600">
                  Severity: {report.severity}
                </span>

                <span
                  className={`px-2 py-1 rounded ${statusStyle(report.status)}`}
                >
                  {report.status}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>
                  {new Date(report.createdAt).toLocaleDateString("id-ID")}
                </span>
                <span className="italic">QA Report</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamReportClient;
