import prisma from "../libs/prisma";
import TeamSection from "../../components/TeamSection";
import {
  AddNewApplicationButton,
  DeleteApplicationButtons,
  MakeTeamButtons,
} from "./Buttons";
import { auth } from "../libs/auth";
import SearchBarHomePage from "@/components/searchBarHomePage";

const page = async ({ searchParams }) => {
  const session = await auth();
  const apps = await await searchParams;
  const keyword = apps?.app || "";

  const applications = await prisma.application.findMany({
    where: keyword
      ? {
          namaAplikasi: {
            contains: keyword,
            mode: "insensitive",
          },
        }
      : undefined,
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
    orderBy: {
      createdAt: "desc",
    },
  });

  if (applications.length === 0) {
    return (
      <div className="p-8 space-y-4 text-slate-600">
        <h1 className="text-lg font-semibold">
          {keyword ? "Aplikasi tidak ditemukan" : "Belum ada aplikasi"}
        </h1>

        {keyword && (
          <p className="text-sm">
            Tidak ada aplikasi dengan kata kunci{" "}
            <span className="font-semibold">"{keyword}"</span>
          </p>
        )}

        {session.user.role === "ADMIN" && <AddNewApplicationButton />}
      </div>
    );
  }

  return (
    <div className="p-8 space-y-12">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Welcome, {session.user.name}
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            {session.user.role === "ADMIN" &&
              "Kelola aplikasi, tim, dan laporan QA"}
            {session.user.role === "QA" &&
              "Temukan dan laporkan bug pada aplikasi"}
            {session.user.role === "DEV" && "Perbaiki bug pada aplikasi"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {session.user.role === "ADMIN" && <AddNewApplicationButton />}
        </div>
      </div>

      {/* APPLICATION LIST */}
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

                {session.user.role === "ADMIN" && (
                  <div className="flex gap-2">
                    <MakeTeamButtons applicationId={application.id} />
                    <DeleteApplicationButtons applicationId={application.id} />
                  </div>
                )}
              </div>
            </div>

            {/* TEAM LIST */}
            {application.teams.map((team) => (
              <TeamSection key={team.id} team={team} user={session.user} />
            ))}
          </section>
        );
      })}
    </div>
  );
};

export default page;
