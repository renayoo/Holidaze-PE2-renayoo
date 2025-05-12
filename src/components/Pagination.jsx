import React from "react";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  function handleClick(page) {
    onPageChange(page);
    scrollToTop();
  }

  return (
    <div className="flex justify-center mt-6 space-x-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => handleClick(page)}
          className={`px-3 py-1 rounded ${
            page === currentPage ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
}

export default Pagination;
