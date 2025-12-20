"use client";

import { useState } from "react";
import { MakeNewTeamApp } from "./actions";

const MakeTeamButtons = ({ applicationId }) => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [namaTim, setNamaTim] = useState("");
  const [loading, setLoading] = useState(false);

  const openModal = () => {
    setMounted(true);
    requestAnimationFrame(() => setOpen(true));
  };

  const closeModal = () => {
    setOpen(false);
    setTimeout(() => setMounted(false), 200);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const result = await MakeNewTeamApp(applicationId, namaTim);
    setLoading(false);

    if (result.success) {
      setNamaTim("");
      closeModal();
    } else {
      alert(result.error);
    }
  };

  return (
    <>
      {/* BUTTON */}
      <button
        onClick={openModal}
        className="ml-6 px-4 py-2 text-sm font-semibold bg-slate-800 text-white rounded-md hover:bg-slate-900 transition"
      >
        + Team
      </button>

      {/* MODAL */}
      {mounted && (
        <div
          className={`
            fixed inset-0 z-50 flex items-center justify-center
            bg-black/40 transition-opacity duration-200
            ${open ? "opacity-100" : "opacity-0"}
          `}
        >
          <div
            className={`
              bg-white w-full max-w-md rounded-lg shadow-lg p-6 space-y-4
              transform transition-all duration-200
              ${open ? "scale-100 opacity-100" : "scale-95 opacity-0"}
            `}
          >
            <h2 className="text-lg font-semibold text-slate-800">
              Buat Team Baru
            </h2>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Nama Team
              </label>
              <input
                value={namaTim}
                onChange={(e) => setNamaTim(e.target.value)}
                placeholder="Contoh: Backend Team"
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-slate-800/20"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm border border-slate-300 rounded-md hover:bg-slate-100"
              >
                Batal
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 text-sm font-semibold bg-slate-800 text-white rounded-md hover:bg-slate-900 disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MakeTeamButtons;
