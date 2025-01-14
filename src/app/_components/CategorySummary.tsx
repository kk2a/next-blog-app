"use client";
import { twMerge } from "tailwind-merge";
import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";
import { Category } from "@/app/_types/Category";

type Props = {
  category: Category;
  selected: boolean;
};

const CategorySummary: React.FC<Props> = (props) => {
  const { category, selected } = props;
  return (
    <div
      key={category.id}
      className={twMerge(
        "rounded-md px-2 py-0.5",
        "border border-slate-400 text-slate-500",
        selected && " bg-gray-100",
        "hover:bg-gray-200"
      )}
    >
      <Link href={`/admin/categories/${category.id}`}>{category.name}</Link>
    </div>
  );
};

export default CategorySummary;
