"use client";
import React from "react";

interface PostSearchProps {
  searchTitle: string;
  setSearchTitle: (title: string) => void;
  searchCategories: string[];
  setSearchCategories: (categories: string[]) => void;
  searchDateFrom: string;
  setSearchDateFrom: (date: string) => void;
  searchDateTo: string;
  setSearchDateTo: (date: string) => void;
  allCategories: string[];
  handleSearch: () => void;
  handleCategoryChange: (category: string) => void;
}

const PostSearch: React.FC<PostSearchProps> = ({
  searchTitle,
  setSearchTitle,
  searchCategories,
  setSearchCategories,
  searchDateFrom,
  setSearchDateFrom,
  searchDateTo,
  setSearchDateTo,
  allCategories,
  handleSearch,
  handleCategoryChange,
}) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="タイトルで検索"
        value={searchTitle}
        onChange={(e) => setSearchTitle(e.target.value)}
        className="mr-2 border p-1"
      />
      <div className="mb-2">
        {allCategories.map((category) => (
          <label key={category} className="mr-2">
            <input
              type="checkbox"
              value={category}
              checked={searchCategories.includes(category)}
              onChange={() => handleCategoryChange(category)}
              className="mr-1"
            />
            {category}
          </label>
        ))}
      </div>
      <div className="mb-2">
        <label className="mr-2">since</label>
        <input
          type="date"
          value={searchDateFrom}
          onChange={(e) => setSearchDateFrom(e.target.value)}
          className="mr-2 border p-1"
        />
        <label className="mr-2">until</label>
        <input
          type="date"
          value={searchDateTo}
          onChange={(e) => setSearchDateTo(e.target.value)}
          className="border p-1"
        />
      </div>
      <button
        onClick={handleSearch}
        className="ml-2 rounded bg-blue-500 px-3 py-1 text-white"
      >
        検索
      </button>
    </div>
  );
};

export default PostSearch;
