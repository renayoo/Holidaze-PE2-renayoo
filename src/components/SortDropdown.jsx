import React from "react";

function SortDropdown({ sortOption, onChange }) {
  return (
    <select
      value={sortOption}
      onChange={(e) => onChange(e.target.value)}
      className="w-full md:w-1/4 border p-2 rounded"
    >
      <option value="newest">Newest</option>
      <option value="priceLow">Price: Low → High</option>
      <option value="priceHigh">Price: High → Low</option>
    </select>
  );
}

export default SortDropdown;
