"use client";
import React, { useState } from "react";
import { FaSearch, FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface PostSearchProps {
  searchKeyWord: string;
  setKeyWord: (title: string) => void;
  searchCategories: string[];
  setSearchCategories: (categories: string[]) => void;
  searchDateFrom: string;
  setSearchDateFrom: (date: string) => void;
  searchDateTo: string;
  setSearchDateTo: (date: string) => void;
  allCategories: string[];
  handleSearch: () => void;
  handleCategoryChange: (category: string) => void;
  searchHasPdf: boolean;
  setSearchHasPdf: (hasPdf: boolean) => void;
}

const PostSearch: React.FC<PostSearchProps> = ({
  searchKeyWord: searchTitle,
  setKeyWord: setSearchTitle,
  searchCategories,
  setSearchCategories,
  searchDateFrom,
  setSearchDateFrom,
  searchDateTo,
  setSearchDateTo,
  allCategories,
  handleSearch,
  handleCategoryChange,
  searchHasPdf,
  setSearchHasPdf,
}) => {
  const [isAdvancedSearchVisible, setIsAdvancedSearchVisible] = useState(false);

  return (
    <div className="mb-4">
      <div className="relative inline-block">
        <input
          type="text"
          placeholder="キーワードで検索"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          className="mr-2 border border-gray-700 p-1 pl-8 rounded"
        />
        <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      <button
        onClick={handleSearch}
        className="rounded bg-blue-500 px-3 py-1 text-white"
      >
        検索
      </button>

      <button
        onClick={() => setIsAdvancedSearchVisible(!isAdvancedSearchVisible)}
        className="ml-2 rounded bg-gray-500 px-3 py-1 text-white"
      >
        詳細検索
      </button>
      {isAdvancedSearchVisible && (
        <div className="mt-2 p-2 bg-gray-100 rounded">
          <div className="grid grid-cols-[1fr_4fr] gap-4 mt-4">
            <div className="flex items-center">
              <label className="mr-2 w-20">カテゴリ</label>
            </div>
            <div>
              {allCategories.map((category) => (
                <div key={category} className="inline-block mr-2">
                  <label>
                    <input
                      type="checkbox"
                      value={category}
                      checked={searchCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="mr-1"
                    />
                    {category}
                  </label>
                </div>
              ))}
            </div>
            <hr className="col-span-2 my-2 border-gray-400" />
            <div className="flex items-center">
              <label className="mr-2 w-20">いつから</label>
            </div>
            <div className="flex items-center relative">
              <DatePicker
                selected={searchDateFrom ? new Date(searchDateFrom) : null}
                onChange={(date) =>
                  setSearchDateFrom(
                    date ? date.toISOString().split("T")[0] : ""
                  )
                }
                dateFormat="yyyy/MM/dd"
                className="border p-1 pl-8"
              />
              <FaCalendarAlt className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <hr className="col-span-2 my-2 border-gray-400" />
            <div className="flex items-center">
              <label className="mr-2 w-20">いつまで</label>
            </div>
            <div className="flex items-center relative">
              <DatePicker
                selected={searchDateTo ? new Date(searchDateTo) : null}
                onChange={(date) =>
                  setSearchDateTo(date ? date.toISOString().split("T")[0] : "")
                }
                dateFormat="yyyy/MM/dd"
                className="border p-1 pl-8"
              />
              <FaCalendarAlt className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <hr className="col-span-2 my-2 border-gray-400" />
            <div className="flex items-center">
              <label className="mr-2 w-20">PDFあり</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={searchHasPdf}
                onChange={(e) => setSearchHasPdf(e.target.checked)}
                className="mr-1"
              />
              <label>PDFがある投稿のみ</label>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setSearchCategories([]);
                setSearchDateFrom("");
                setSearchDateTo("");
              }}
              className="mr-2 rounded bg-red-500 px-3 py-1 text-white"
            >
              リセット
            </button>
            <button
              onClick={handleSearch}
              className="rounded bg-blue-500 px-3 py-1 text-white"
            >
              検索
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostSearch;
