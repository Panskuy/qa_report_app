"use client";

import { useState } from "react";
import { addMember } from "./action";

const Page = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (formData) => {
    setError("");
    setSuccess("");

    try {
      await addMember(formData);
      setSuccess("Member berhasil ditambahkan");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white border rounded-lg p-8">
      <h1 className="text-xl font-semibold text-slate-800">Add New Member</h1>
      <p className="text-sm text-slate-500 mt-1">
        Tambahkan anggota baru ke dalam sistem
      </p>

      <form action={handleSubmit} className="mt-6 space-y-4">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>
        )}

        {success && (
          <p className="text-sm text-emerald-600 bg-emerald-50 p-2 rounded">
            {success}
          </p>
        )}

        <div>
          <label className="text-sm text-slate-600">Nama</label>
          <input
            name="name"
            type="text"
            className="w-full mt-1 border px-3 py-2 rounded"
            placeholder="Nama lengkap"
          />
        </div>

        <div>
          <label className="text-sm text-slate-600">Email</label>
          <input
            name="email"
            type="email"
            className="w-full mt-1 border px-3 py-2 rounded"
            placeholder="email@company.com"
          />
        </div>

        <div>
          <label className="text-sm text-slate-600">Password</label>
          <input
            name="password"
            type="password"
            className="w-full mt-1 border px-3 py-2 rounded"
            placeholder="********"
          />
        </div>

        <div>
          <label className="text-sm text-slate-600">Role</label>
          <select
            name="role"
            className="w-full mt-1 border px-3 py-2 rounded"
            defaultValue="USER"
          >
            <option value="ADMIN">Admin</option>
            <option value="QA">QA</option>
            <option value="DEV">Developer</option>
            <option value="USER">User</option>
          </select>
        </div>

        <button className="w-full bg-slate-900 text-white py-2 rounded hover:bg-slate-800 transition">
          Add Member
        </button>
      </form>
    </div>
  );
};

export default Page;
