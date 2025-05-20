function Pagination({ currentPage, totalPages, onPageChange }) {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const getPageNumbers = () => {
    const maxPagesToShow = 7;
    const pages = [];

    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const start = Math.max(currentPage - 2, 1);
    const end = Math.min(currentPage + 2, totalPages);

    if (start > 1) pages.push(1, "...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages) pages.push("...", totalPages);

    return pages;
  };

  function handleClick(page) {
    if (page === "...") return;
    onPageChange(page);
    scrollToTop();
  }

  return (
    <div className="flex justify-center mt-6 space-x-2">
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => handleClick(page)}
          className={`px-3 py-1 rounded ${
            page === currentPage ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          disabled={page === "..."}
        >
          {page}
        </button>
      ))}
    </div>
  );
}

export default Pagination;
