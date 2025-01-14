"use client";

import Image from "next/image";
import { twMerge } from "tailwind-merge";
import DOMPurify from "isomorphic-dompurify";
import { Post } from "@/app/_types/Post";
import { dateFormat } from "../utils/dateFormat";

type Props = {
  post: Post;
};

const PostDetail: React.FC<Props> = (props) => {
  const { post } = props;
  const safeHTML = DOMPurify.sanitize(post.content, {
    ALLOWED_TAGS: ["b", "strong", "i", "em", "u", "br"],
  });
  return (
    <div className="space-y-2">
      <div className="mb-2 text-2xl font-bold">{post.title}</div>
      <div className="flex items-center justify-between">
        <div>投稿日: {dateFormat(post.createdAt)}</div>
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
      <div className="relative">
        <Image
          src={post.coverImage.url}
          alt="Example Image"
          layout="responsive"
          width={100}
          height={50}
          priority
          className="rounded-xl"
        />
      </div>
      <div dangerouslySetInnerHTML={{ __html: safeHTML }} />
    </div>
  );
};

export default PostDetail;
