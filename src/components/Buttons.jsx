"use client";

import { deleteTeam } from "@/app/(main)/actions";
import React, { useState } from "react";
import toast from "react-hot-toast";

export const DeleteTeamButton = ({ team_id }) => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deskripsi, setDeskripsi] = useState("");

  const openModal = () => {
    setMounted(true);
    requestAnimationFrame(() => setOpen(true));
  };

  const closeModal = () => {
    setOpen(false);
    setTimeout(() => setMounted(false), 200);
  };

  const handleDelete = async () => {
    console.log(team_id);

    setLoading(true);
    const result = await deleteTeam(team_id);
    setLoading(false);

    if (result.success) {
      toast.success("Berhasil Delete Team");
      setDeskripsi("");
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
        className="ml-4 px-4 py-2 text-sm font-semibold
        bg-red-600 text-white rounded-md
        hover:bg-red-700 transition"
      >
        Delete
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
              Hapus Team Ini?
            </h2>

            <p className="text-sm text-slate-600">
              Tindakan ini <b>tidak dapat dibatalkan</b>.
            </p>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <button
                onClick={closeModal}
                disabled={loading}
                className="px-4 py-2 text-sm border border-slate-300 rounded-md hover:bg-slate-100"
              >
                Batal
              </button>

              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 text-sm font-semibold
                bg-red-600 text-white rounded-md
                hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
