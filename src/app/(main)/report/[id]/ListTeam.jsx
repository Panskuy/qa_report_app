import Link from "next/link";

const ListTeam = ({ listTeam }) => {
  if (!listTeam?.teams?.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-6 text-sm text-slate-500 text-center">
        Tidak ada team
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white border border-slate-200 rounded-lg">
      {/* HEADER */}
      <div className="px-4 py-3 border-b bg-black rounded-t-lg">
        <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wide">
          Team List
        </h2>
        <p className="text-xs text-slate-100 mt-1">Team dalam aplikasi ini</p>
      </div>

      {/* LIST */}
      <ul className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {listTeam.teams.map((team) => (
          <li key={team.id}>
            <Link
              href={`/team/${team.id}`}
              className="block px-4 py-3 hover:bg-slate-50 transition"
            >
              <p className="text-sm font-medium text-slate-800 truncate">
                {team.namaTim}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListTeam;
