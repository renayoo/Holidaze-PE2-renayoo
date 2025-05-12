import React from "react";

function SearchInput({ search, onChange }) {
  return (
    <input
      type="text"
      value={search}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search by title or location..."
      className="w-full md:w-1/2 border p-2 rounded"
    />
  );
}

export default SearchInput;
