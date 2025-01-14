"use client";
import Link from "next/link";
import { PostSummaryType } from "@/app/_types/PostSummaryType";
import PostSummaryBase from "./PostSummaryBase";

type Props = {
  post: PostSummaryType;
  onDelete: (id: string) => void;
};

const PostSummaryEditorial: React.FC<Props> = (props) => {
  const { post, onDelete } = props;
  return (
    <div className="border border-slate-400 p-3">
      <PostSummaryBase post={post} />
      <div className="mt-2 flex justify-end space-x-2">
        <Link href={`/admin/posts/${post.id}`}>
          <button className="rounded bg-blue-500 px-3 py-1 text-white">
            編集
          </button>
        </Link>
        <button
          className="rounded bg-red-500 px-3 py-1 text-white"
          onClick={() => onDelete(post.id)}
        >
          削除
        </button>
      </div>
    </div>
  );
};

export default PostSummaryEditorial;
