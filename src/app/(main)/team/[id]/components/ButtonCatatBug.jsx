"use client";

import { useState } from "react";
import { createBugReport } from "../actions";

const ButtonCatatBug = ({ idTeam, idApplication }) => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [preview, setPreview] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const openModal = () => {
    setMounted(true);
    requestAnimationFrame(() => setOpen(true));
  };

  const closeModal = () => {
    if (isLoading) return; // ❗ cegah close saat loading
    setOpen(false);
    setTimeout(() => {
      setMounted(false);
      setPreview([]);
    }, 200);
  };

  return (
    <>
      {/* BUTTON */}
      <button
        onClick={openModal}
        className="
          px-4 py-2 text-sm font-medium
          border border-slate-300
          text-slate-700 bg-white
          rounded-lg
          hover:bg-slate-100
          transition
        "
      >
        Catat Bug
      </button>

      {/* MODAL */}
      {mounted && (
        <div
          className={`
            fixed inset-0 z-50 flex items-center justify-center
            bg-slate-900/40
            transition-opacity duration-200
            ${open ? "opacity-100" : "opacity-0"}
          `}
        >
          <div
            className={`
              bg-white w-full max-w-lg rounded-lg shadow-lg
              transform transition-all duration-200
              ${open ? "scale-100 opacity-100" : "scale-95 opacity-0"}
            `}
          >
            {/* HEADER */}
            <div className="px-6 py-4 border-b">
              <h2 className="text-base font-semibold text-slate-800">
                Catat Bug Baru
              </h2>
              <p className="text-sm text-slate-500">
                Lengkapi informasi bug yang ditemukan pada aplikasi
              </p>
            </div>

            {/* FORM */}
            <form
              action={async (formData) => {
                try {
                  setIsLoading(true);
                  await createBugReport(formData);
                  closeModal();
                } finally {
                  setIsLoading(false);
                }
              }}
              className="px-6 py-5 space-y-4"
            >
              {/* HIDDEN */}
              <input type="hidden" name="teamId" value={idTeam} />
              <input type="hidden" name="applicationId" value={idApplication} />

              {/* JUDUL */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Judul Bug
                </label>
                <input
                  name="judul"
                  required
                  disabled={isLoading}
                  placeholder="Contoh: Error saat submit form login"
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              {/* JENIS & SEVERITY */}
              <div className="grid grid-cols-2 gap-4">
                <select
                  name="jenis"
                  disabled={isLoading}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="Bug">Bug</option>
                  <option value="UI">UI</option>
                  <option value="Performance">Performance</option>
                </select>

                <select
                  name="severity"
                  disabled={isLoading}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              {/* DESKRIPSI */}
              <textarea
                name="deskripsi"
                disabled={isLoading}
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm min-h-40"
              />

              {/* UPLOAD IMAGE */}
              <input
                type="file"
                name="images"
                multiple
                accept="image/*"
                disabled={isLoading}
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setPreview(files.map((file) => URL.createObjectURL(file)));
                }}
              />

              {/* FOOTER */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm border rounded-md"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`
                    px-4 py-2 text-sm font-medium rounded-md text-white
                    ${
                      isLoading
                        ? "bg-slate-400"
                        : "bg-slate-800 hover:bg-slate-900"
                    }
                  `}
                >
                  {isLoading ? "Menyimpan..." : "Simpan Laporan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ButtonCatatBug;
