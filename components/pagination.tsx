"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    // Reduce visible pages on mobile
    const maxVisiblePages = window.innerWidth < 640 ? 3 : 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust for mobile (smaller range)
      if (window.innerWidth < 640) {
        start = Math.max(2, currentPage);
        end = Math.min(totalPages - 1, currentPage);
      }

      // Adjust if near start
      if (currentPage <= 3) {
        end = Math.min(totalPages - 1, window.innerWidth < 640 ? 2 : 4);
      }

      // Adjust if near end
      if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - (window.innerWidth < 640 ? 1 : 3));
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col gap-3 items-center sm:flex-row sm:justify-between sm:items-center pt-6 pb-4">
      <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
        Showing <span className="font-semibold">{startItem}</span> to{" "}
        <span className="font-semibold">{endItem}</span> of{" "}
        <span className="font-semibold">{totalItems}</span> results
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-xs sm:text-sm"
        >
          <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        <div className="flex gap-1">
          {pageNumbers.map((page, index) =>
            page === "..." ? (
              <div
                key={`dots-${index}`}
                className="px-1 sm:px-2 py-1 text-muted-foreground text-xs sm:text-sm"
              >
                ...
              </div>
            ) : (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page as number)}
                className="w-8 h-8 sm:w-10 sm:h-10 p-0 text-xs sm:text-sm"
              >
                {page}
              </Button>
            ),
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="text-xs sm:text-sm"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 sm:ml-1" />
        </Button>
      </div>
    </div>
  );
}
