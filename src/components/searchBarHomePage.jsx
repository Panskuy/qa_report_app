"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

const SearchBarHomePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(searchParams.get("app") || "");

  const goSearch = () => {
    const keyword = value.trim();

    if (!keyword) {
      router.push("/");
      return;
    }

    router.push(`/?app=${encodeURIComponent(keyword)}`);
  };

  return (
    <div className="flex items-center gap-2">
      {/* SEARCH INPUT */}
      <div className="relative w-64">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          name="search-app"
          id="search-app"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") goSearch();
          }}
          placeholder="Cari aplikasi..."
          className="
            w-full h-9 pl-9 pr-3 text-sm
            rounded-md
            border border-slate-800
            bg-white/5
            text-slate-100
            placeholder:text-slate-400
            focus:outline-none
            focus:ring-2 focus:ring-slate-800/20
            focus:border-slate-500
            transition
          "
        />
      </div>

      {/* SUBMIT BUTTON */}
      <button
        onClick={goSearch}
        className="
          h-9 px-4
          text-sm font-medium
          rounded-md
          border border-slate-800
          bg-black
          hover:bg-slate-900
          focus:outline-none
          focus:ring-2 focus:ring-slate-800
          transition
        "
      >
        Cari
      </button>
    </div>
  );
};

export default SearchBarHomePage;
