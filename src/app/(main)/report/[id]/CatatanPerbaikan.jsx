"use client";
import React, { useState } from "react";
import { updateCatatanPerbaikan } from "./action";

const CatatanPerbaikan = ({ catatan_perbaikan, reportId }) => {
  const [newCatatan, setNewCatatan] = useState(catatan_perbaikan || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    setIsSaved(false);

    try {
      const result = await updateCatatanPerbaikan(reportId, newCatatan);

      if (result.success) {
        setIsEditing(false);
        setIsSaved(true);

        // Hide success message after 3 seconds
        setTimeout(() => setIsSaved(false), 3000);
      } else {
        alert("Gagal menyimpan catatan: " + result.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menyimpan catatan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setNewCatatan(catatan_perbaikan || "");
    setIsEditing(false);
  };

  return (
    <div className="space-y-3">
      {isEditing ? (
        <>
          <textarea
            value={newCatatan}
            onChange={(e) => setNewCatatan(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-black/40 focus:border-transparent resize-none min-h-30"
            placeholder="Tulis catatan perbaikan di sini..."
            disabled={isLoading}
          />

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </button>

            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Batal
            </button>
          </div>
        </>
      ) : (
        <>
          {newCatatan ? (
            <div className="prose prose-sm max-w-none">
              <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {newCatatan}
              </p>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center">
              <p className="text-sm text-slate-500 italic">
                Belum terdapat catatan perbaikan
              </p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              {newCatatan ? "Edit Catatan" : "Tambah Catatan"}
            </button>

            {isSaved && (
              <span className="text-sm text-green-600 flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Tersimpan
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CatatanPerbaikan;
