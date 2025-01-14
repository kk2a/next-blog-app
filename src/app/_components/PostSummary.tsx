"use client";
import { PostSummaryType } from "@/app/_types/PostSummaryType";
import PostSummaryBase from "@/app/_components/PostSummaryBase";

type Props = {
  post: PostSummaryType;
};

const PostSummary: React.FC<Props> = (props) => {
  const { post } = props;
  return (
    <div className="border border-slate-400 p-3">
      <PostSummaryBase post={post} />
    </div>
  );
};

export default PostSummary;
