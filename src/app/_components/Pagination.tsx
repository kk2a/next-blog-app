"use client";
import { useState } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const [inputPage, setInputPage] = useState<string>(currentPage.toString());

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPage(e.target.value);
  };

  const handleJumpToPage = () => {
    const pageNumber = parseInt(inputPage);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    } else {
      // 不正な入力の場合、現在のページ番号に戻す
      setInputPage(currentPage.toString());
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const showPages = 5;
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);

    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className="mt-4 flex flex-col items-center space-y-2">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded border px-4 py-2 disabled:opacity-50"
        >
          前へ
        </button>
        {getPageNumbers().map((number) => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`rounded px-3 py-2 ${
              currentPage === number
                ? "bg-blue-500 text-white"
                : "border hover:bg-gray-100"
            }`}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded border px-4 py-2 disabled:opacity-50"
        >
          次へ
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <span>ページ移動:</span>
        <input
          type="number"
          min={1}
          max={totalPages}
          value={inputPage}
          onChange={handlePageInputChange}
          className="w-16 rounded border px-2 py-1"
        />
        <span>/ {totalPages}</span>
        <button
          onClick={handleJumpToPage}
          className="rounded border bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
        >
          移動
        </button>
      </div>
    </div>
  );
};

export default Pagination;
