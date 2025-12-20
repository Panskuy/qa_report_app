import prisma from "../libs/prisma";
import TeamSection from "../../components/TeamSection";
import MakeTeamButtons from "./Buttons";

const page = async () => {
  const applications = await prisma.application.findMany({
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

  if (applications.length === 0) {
    return <div className="p-8 text-slate-600">Data belum tersedia</div>;
  }

  return (
    <div className="p-8 space-y-12">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          Quality Assurance Report
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Internal monitoring & defect tracking system
        </p>
      </div>

      {applications.map((application) => {
        const totalBugApp = application.teams.reduce(
          (sum, team) => sum + team._count.reports,
          0
        );

        return (
          <section
            key={application.id}
            className="bg-white border border-slate-200 rounded-lg p-6 space-y-6"
          >
            {/* APP HEADER */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-medium text-slate-800">
                  {application.namaAplikasi}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {application.deskripsi}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Total Bug
                  </p>
                  <p className="text-2xl font-semibold text-slate-800">
                    {totalBugApp}
                  </p>
                </div>

                <MakeTeamButtons applicationId={application.id} />
              </div>
            </div>

            {/* TEAMS */}
            {application.teams.map((team) => (
              <TeamSection key={team.id} team={team} />
            ))}
          </section>
        );
      })}
    </div>
  );
};

export default page;
