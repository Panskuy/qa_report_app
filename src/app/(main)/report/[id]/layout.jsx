import ListNewError from "./ListNewError";
import Chat from "./Chat";
import prisma from "@/app/libs/prisma";
import ListTeam from "./ListTeam";

const layout = async ({ children, params }) => {
  const { id } = await params;
  console.log(id);

  const report = await prisma.report.findUnique({
    where: { id },
    select: {
      team: {
        select: {
          id: true,
          namaTim: true,
          application: {
            select: {
              id: true,
              namaAplikasi: true,
              teams: {
                select: {
                  id: true,
                  namaTim: true,
                },
              },
            },
          },
          reports: {
            where: {
              status: { not: "Closed" },
            },
            select: {
              id: true,
              judul: true,
              status: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="flex  overflow-hidden gap-2">
      <aside className="w-50   overflow-y-auto h-fit space-y-4 sticky">
        <ListTeam listTeam={report.team?.application} />
        <ListNewError reports={report.team?.reports} />
      </aside>
      <main className="flex-1 p-8 bg-white rounded-lg border border-black/10">
        {children}
      </main>
    </div>
  );
};

export default layout;
