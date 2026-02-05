"use client";

import { useState } from "react";

export function usePagination(totalItems: number, initialPageSize = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = Math.ceil(totalItems / pageSize);
  
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  return {
    currentPage,
    pageSize,
    totalPages,
    startIndex,
    endIndex,
    nextPage,
    prevPage,
    goToPage,
    setPageSize,
  };
}
