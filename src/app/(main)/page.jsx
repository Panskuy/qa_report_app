import prisma from "../libs/prisma";
import TeamSection from "../../components/TeamSection";

const page = async () => {
  const application = await prisma.application.findFirst({
    include: {
      teams: {
        include: {
          reports: true,
          _count: {
            select: {
              reports: {
                where: {
                  jenis: "Bug",
                  status: { not: "Closed" },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!application) {
    return <div className="p-8 text-slate-600">Data belum tersedia</div>;
  }

  const totalBugApp = application.teams.reduce(
    (sum, team) => sum + team._count.reports,
    0
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-slate-800">
          Quality Assurance Report
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Internal monitoring & defect tracking system
        </p>
      </div>

      {/* Application Summary */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-medium text-slate-800">
              {application.namaAplikasi}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {application.deskripsi}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Total Bug
            </p>
            <p className="text-2xl font-semibold text-slate-800">
              {totalBugApp}
            </p>
          </div>
        </div>
      </div>

      {/* Teams */}
      {application.teams.map((team) => (
        <TeamSection key={team.id} team={team} />
      ))}
    </div>
  );
};

export default page;
