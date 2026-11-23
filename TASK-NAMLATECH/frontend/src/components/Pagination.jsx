function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  return (
    <nav className="pagination" aria-label="Hotel list pages">
      <button className="page-arrow" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} aria-label="Go to previous page">←</button>
      {pages.map((page) => (
        <button key={page} className={`page-number${currentPage === page ? " active" : ""}`} onClick={() => onPageChange(page)} aria-current={currentPage === page ? "page" : undefined} aria-label={`Go to page ${page}`}>
          {String(page).padStart(2, "0")}
        </button>
      ))}
      <button className="page-arrow" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Go to next page">→</button>
    </nav>
  );
}

export default Pagination;
