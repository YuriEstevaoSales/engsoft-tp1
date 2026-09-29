interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  visiblePages: number[];
  onPageChange: (page: number) => void;
}

export function PaginationControls({ currentPage, totalPages, visiblePages, onPageChange }: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-8 flex justify-center gap-2">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-lg border border-[#d2dedb] bg-white px-3 py-2 text-sm disabled:opacity-40"
      >
        Anterior
      </button>
      {visiblePages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`min-w-9 rounded-lg px-3 py-2 text-sm font-semibold ${
            page === currentPage ? "bg-[#1d635e] text-white" : "border border-[#d2dedb] bg-white"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-lg border border-[#d2dedb] bg-white px-3 py-2 text-sm disabled:opacity-40"
      >
        Próxima
      </button>
    </nav>
  );
}
