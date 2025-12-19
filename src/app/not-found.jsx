"use client";

import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl shadow-sm p-8 text-center">
        {/* Code */}
        <h1 className="text-6xl font-bold text-slate-800 mb-2">404</h1>

        {/* Title */}
        <h2 className="text-xl font-semibold text-slate-700 mb-3">
          Halaman Tidak Ditemukan
        </h2>

        {/* Description */}
        <p className="text-sm text-slate-500 mb-6">
          Halaman yang Anda cari tidak tersedia atau telah dipindahkan. Silakan
          kembali ke halaman utama aplikasi.
        </p>

        {/* Action */}
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-md bg-slate-800 text-white hover:bg-slate-700 transition"
        >
          Kembali
        </button>
      </div>
    </div>
  );
};

export default NotFound;
