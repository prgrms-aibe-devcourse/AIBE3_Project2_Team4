"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getVisiblePages = () => {
    const pages = [];

    // 항상 1페이지 표시
    pages.push(1);

    // 현재 페이지 주변 5개 페이지 계산
    const start = Math.max(2, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);

    // 1페이지와 시작 페이지 사이에 간격이 있으면 ... 추가
    if (start > 2) {
      pages.push("...");
    }

    // 중간 페이지들 추가
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    // 끝 페이지와 마지막 페이지 사이에 간격이 있으면 ... 추가
    if (end < totalPages - 1) {
      pages.push("...");
    }

    // 항상 마지막 페이지 표시 (1페이지가 아닌 경우)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2">
      {/* 이전 페이지 버튼 */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* 페이지 번호들 */}
      {getVisiblePages().map((page, index) => (
        <div key={index}>
          {page === "..." ? (
            <span className="text-muted-foreground px-3 py-2">...</span>
          ) : (
            <Button
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => onPageChange(page as number)}
              className="min-w-[40px]"
            >
              {page}
            </Button>
          )}
        </div>
      ))}

      {/* 다음 페이지 버튼 */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
