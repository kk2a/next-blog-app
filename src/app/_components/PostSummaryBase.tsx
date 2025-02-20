"use client";
import { twMerge } from "tailwind-merge";
import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";
import { PostSummaryType } from "@/app/_types/PostSummaryType";
import { dateFormat } from "@/app/utils/dateFormat";
import { FaFilePdf } from "react-icons/fa";

type Props = {
  post: PostSummaryType;
};

const PostSummaryBase: React.FC<Props> = (props) => {
  const { post } = props;
  const safeHTML = DOMPurify.sanitize(post.content, {
    ALLOWED_TAGS: ["b", "strong", "i", "em", "u", "br"],
  });
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div>{dateFormat(post.createdAt)}</div>
          {post.bodyPdfKey && <FaFilePdf className="text-red-500" />}
        </div>
        <div className="flex space-x-1.5">
          {post.categories.map((category) => (
            <div
              key={category.id}
              className={twMerge(
                "rounded-md px-2 py-0.5",
                "text-xs font-bold",
                "border border-slate-400 text-slate-500"
              )}
            >
              {category.name}
            </div>
          ))}
        </div>
      </div>
      <Link href={`/posts/${post.id}`}>
        <div className="mb-1 text-lg font-bold">{post.title}</div>
        <div
          className="line-clamp-3"
          dangerouslySetInnerHTML={{ __html: safeHTML }}
        />
      </Link>
    </div>
  );
};

export default PostSummaryBase;
