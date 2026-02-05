"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface TableProps {
  headers: string[];
  data: any[];
  renderRow: (item: any) => React.ReactNode;
  pagination?: {
    pageSize: number;
    total: number;
  };
}

export function Table({ headers, data, renderRow, pagination }: TableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = pagination ? Math.ceil(pagination.total / pagination.pageSize) : 1;

  return (
    <div className="w-full space-y-4">
      <div className="overflow-hidden rounded-3xl border border-border bg-white dark:bg-zinc-900 shadow-sm">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-border bg-zinc-50/50 dark:bg-zinc-800/50">
              {headers.map((header) => (
                <th key={header} className="px-6 py-4 font-semibold text-primary dark:text-blue-100">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr 
                key={index} 
                className="border-b border-border last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                {renderRow(item)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between px-2 py-4 text-sm font-medium">
          <span className="text-muted-foreground">
            Showing {data.length} of {pagination.total} results
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-zinc-800"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-zinc-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-4">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-zinc-800"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-zinc-800"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
