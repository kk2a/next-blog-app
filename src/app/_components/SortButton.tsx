"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";

interface SortButtonProps {
  isAscending: boolean;
  handleSort: () => void;
}

const SortButton: React.FC<SortButtonProps> = ({ isAscending, handleSort }) => {
  return (
    <button
      onClick={handleSort}
      className="flex items-center rounded bg-gray-500 px-3 py-1 text-white"
    >
      {isAscending ? "新しい順" : "古い順"}に並び替え
      <FontAwesomeIcon
        icon={isAscending ? faArrowDown : faArrowUp}
        className="ml-2"
      />
    </button>
  );
};

export default SortButton;
