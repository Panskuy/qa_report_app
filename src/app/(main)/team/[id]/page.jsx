import prisma from "@/app/libs/prisma";
import Link from "next/link";
import ButtonCatatBug from "./components/ButtonCatatBug";
import { auth } from "@/app/libs/auth";
import { notFound } from "next/navigation";

/* =====================
   STATUS STYLE
===================== */
const STATUS_STYLE = {
  Open: "bg-red-100 text-red-700",
  InProgress: "bg-blue-100 text-blue-700",
  Closed: "bg-emerald-100 text-emerald-700",
};

const page = async ({ params }) => {
  const { id } = await params;
  const session = await auth();

  const detailTeam = await prisma.team.findUnique({
    where: { id },
    include: {
      application: true,
      reports: {
        orderBy: { createdAt: "desc" },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!detailTeam) {
    return notFound();
  }

  /* 🔹 GUNAKAN REPORTS DARI detailTeam */
  const reports = detailTeam.reports;

  const openReports = reports.filter((r) => r.status !== "Closed");
  const closedReports = reports.filter((r) => r.status === "Closed");

  /* 🔹 STATS */
  const stats = {
    Open: openReports.filter((r) => r.status === "Open").length,
    InProgress: openReports.filter((r) => r.status === "InProgress").length,
    Closed: closedReports.length,
  };

  const total = reports.length;

  return (
    <div className="p-6 space-y-10">
      {/* HEADER */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Team {detailTeam.namaTim}
          </h1>
          <p className="text-sm text-slate-500">
            {detailTeam.application?.namaAplikasi ?? "-"}
          </p>
        </div>

        {session.user.role === "QA" && (
          <ButtonCatatBug
            idTeam={id}
            idApplication={detailTeam.application.id}
          />
        )}
      </header>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard label="Total" value={total} variant="default" />
        <SummaryCard label="Open" value={stats.Open} variant="open" />
        <SummaryCard
          label="In Progress"
          value={stats.InProgress}
          variant="progress"
        />
        <SummaryCard label="Closed" value={stats.Closed} variant="closed" />
      </div>

      {/* OPEN & IN PROGRESS */}
      <section>
        <SectionHeader title="Open & In Progress" count={openReports.length} />

        {openReports.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {openReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </section>

      {/* CLOSED */}
      <section>
        <SectionHeader title="Error Selesai" count={stats.Closed} />

        {closedReports.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {closedReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                userId={session?.user?.id}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

/* =====================
   COMPONENTS
===================== */

const ReportCard = ({ report, userId }) => (
  <Link
    href={`/report/${report.id}`}
    className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-md transition"
  >
    {/* HEADER */}
    <div className="flex items-start justify-between mb-2">
      <h3 className="font-medium text-slate-800 line-clamp-2">
        {report.kode} || {report.judul}
      </h3>

      <div className="space-x-2">
        {report.createdById === userId && (
          <span className="text-xs text-white whitespace-nowrap bg-blue-600 px-1 py-1 rounded-lg">
            You
          </span>
        )}
        <span className="text-xs text-slate-400 whitespace-nowrap">
          {report.createdBy?.email ?? "-"}
        </span>
      </div>
    </div>

    {/* BADGES */}
    <div className="flex flex-wrap items-center gap-2 text-xs mb-4">
      <Badge>{report.jenis}</Badge>
      <Badge>Severity: {report.severity}</Badge>
      <span className={`px-2 py-1 rounded ${STATUS_STYLE[report.status]}`}>
        {report.status}
      </span>
      {report.status === "Closed" && report.approval_status === "Approved" && (
        <div className="flex items-center gap-2">
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
        </div>
      )}
    </div>

    {/* FOOTER */}
    <p className="text-xs text-slate-500">
      {new Date(report.createdAt).toLocaleDateString("id-ID")}
    </p>
  </Link>
);

const Badge = ({ children }) => (
  <span className="px-2 py-1 rounded bg-slate-100 text-slate-600">
    {children}
  </span>
);

/* =====================
   SUMMARY CARD
===================== */
const SUMMARY_VARIANT = {
  default: "text-slate-700",
  open: "text-red-600",
  progress: "text-blue-600",
  closed: "text-emerald-600",
};

const SummaryCard = ({ label, value, variant }) => (
  <div className="bg-white border border-slate-200 rounded-lg p-4">
    <p className="text-xs text-slate-500">{label}</p>
    <p className={`text-2xl font-semibold ${SUMMARY_VARIANT[variant]}`}>
      {value}
    </p>
  </div>
);

const SectionHeader = ({ title, count }) => (
  <div className="flex items-center gap-2 mb-4">
    <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
    <span className="text-sm text-slate-500">({count})</span>
  </div>
);

const EmptyState = () => (
  <div className="text-sm text-slate-500 italic">Tidak ada data</div>
);

export default page;
