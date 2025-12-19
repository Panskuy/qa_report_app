"use client";

import { useState } from "react";
import { createBugReport } from "../actions";

const ButtonCatatBug = ({ idTeam, idApplication }) => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [preview, setPreview] = useState([]);

  const openModal = () => {
    setMounted(true);
    requestAnimationFrame(() => setOpen(true));
  };

  const closeModal = () => {
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
                await createBugReport(formData);
                closeModal();
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
                  placeholder="Contoh: Error saat submit form login"
                  className="
                    w-full border border-slate-300 rounded-md
                    px-3 py-2 text-sm
                    focus:outline-none focus:ring-2
                    focus:ring-slate-800/20
                  "
                />
              </div>

              {/* JENIS & SEVERITY */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Jenis
                  </label>
                  <select
                    name="jenis"
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="Bug">Bug</option>
                    <option value="UI">UI</option>
                    <option value="Performance">Performance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Severity
                  </label>
                  <select
                    name="severity"
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Deskripsi
                </label>

                <textarea
                  name="deskripsi"
                  id="deskripsi"
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm min-h-40"
                />
              </div>

              {/* UPLOAD IMAGE */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Screenshot / Evidence
                </label>

                <input
                  type="file"
                  name="images"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setPreview(files.map((file) => URL.createObjectURL(file)));
                  }}
                  className="
                    block w-full text-sm text-slate-600
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-slate-100 file:text-slate-700
                    hover:file:bg-slate-200 transition
                  "
                />

                {/* PREVIEW */}
                {preview.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {preview.map((src, i) => (
                      <div
                        key={i}
                        className="border rounded-md overflow-hidden"
                      >
                        <img
                          src={src}
                          alt="Preview"
                          className="h-20 w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* FOOTER */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="
                    px-4 py-2 text-sm
                    border border-slate-300
                    rounded-md
                    text-slate-700
                    hover:bg-slate-100
                    transition
                  "
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="
                    px-4 py-2 text-sm font-medium
                    bg-slate-800 text-white
                    rounded-md
                    hover:bg-slate-900
                    transition
                  "
                >
                  Simpan Laporan
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
