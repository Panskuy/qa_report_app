import Link from "next/link";

const ListNewError = ({ reports = [] }) => {
  return (
    <div className="h-full flex flex-col bg-white border border-slate-200 rounded-lg">
      {/* HEADER */}
      <div className="px-4 py-3 border-b bg-black rounded-t-lg">
        <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
          Error Reports
        </h2>
        <p className="text-xs text-slate-50 mt-1">
          Daftar error pada tim terkait
        </p>
      </div>

      {/* LIST */}
      <ul className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {reports.length === 0 && (
          <li className="px-4 py-6 text-center text-sm text-slate-500">
            Tidak ada report
          </li>
        )}

        {reports.map((report) => (
          <li key={report.id}>
            <Link
              href={`/report/${report.id}`}
              className="block px-4 py-3 hover:bg-slate-50 transition"
            >
              <p className="text-sm font-medium text-slate-800 truncate">
                {report.judul}
              </p>

              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-slate-500">
                  {new Date(report.createdAt).toLocaleDateString("id-ID")}
                </span>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium
                    ${
                      report.status === "Open"
                        ? "bg-red-100 text-red-700"
                        : report.status === "InProgress"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-emerald-100 text-emerald-700"
                    }
                  `}
                >
                  {report.status}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListNewError;
