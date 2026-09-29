export function getVisiblePageNumbers(currentPage: number, totalPages: number, windowSize = 5) {
  const pageCount = Math.max(0, Math.floor(totalPages));
  const visibleCount = Math.min(pageCount, Math.max(1, Math.floor(windowSize)));
  const firstPage = Math.max(
    1,
    Math.min(currentPage - Math.floor(visibleCount / 2), pageCount - visibleCount + 1),
  );
  return Array.from({ length: visibleCount }, (_, index) => firstPage + index);
}
