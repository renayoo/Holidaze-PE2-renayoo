import { Search, X } from "lucide-react";
import React from "react";

function SearchInput({ search, onChange }) {
  return (
    <div className="relative w-full md:w-1/2">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

      <input
        type="text"
        value={search}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by title or country..."
        className="w-full pl-10 pr-10 py-2 rounded-full bg-white border border-gray-300 focus:ring-2 focus:ring-[var(--color-button-turq)] outline-none shadow-sm transition"
      />

      {search && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}

export default SearchInput;
