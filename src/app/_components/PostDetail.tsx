"use client";

import Image from "next/image";
import { twMerge } from "tailwind-merge";
import DOMPurify from "isomorphic-dompurify";
import { Post } from "@/app/_types/Post";
import { dateFormat } from "../utils/dateFormat";
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { PostSummaryType } from "../_types/PostSummaryType";
import { PostGetApiResponse } from "../_types/PostGetApiResponse";
import PostSummary from "./PostSummary";

type Props = {
  post: Post;
};

const PostDetail: React.FC<Props> = (props) => {
  const { post } = props;
  const safeHTML = DOMPurify.sanitize(post.content, {
    ALLOWED_TAGS: ["b", "strong", "i", "em", "u", "br"],
  });

  // console.log(`post: ${JSON.stringify(post, null, 2)}`);
  const coverImageBucketName = "cover_image";
  const imagePublicUrlRes = post.coverImage
    ? supabase.storage
        .from(coverImageBucketName)
        .getPublicUrl(post.coverImage.key)
    : undefined;

  const bodyPdfBucketName = "body_pdf";
  const pdfPublicUrlRes = post.bodyPdfKey
    ? supabase.storage.from(bodyPdfBucketName).getPublicUrl(post.bodyPdfKey)
    : undefined;
  // console.log(`pdfPublicUrlRes: ${JSON.stringify(pdfPublicUrlRes, null, 2)}`);

  const [relatedPosts, setRelatedPosts] = useState<PostSummaryType[]>([]);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        const requestUrl = "/api/posts";
        const res = await fetch(requestUrl, {
          method: "GET",
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error(`${res.status}: ${res.statusText}`);
        }
        const tmp = (await res.json()) as PostGetApiResponse[];
        const data: PostSummaryType[] = tmp.map((body) => ({
          ...body,
          categories: body.categories.map((category) => ({
            ...category.category,
          })),
        }));
        console.log(`data: ${JSON.stringify(data, null, 2)}`);
        console.log(
          `post.categories: ${JSON.stringify(
            post.categories.map((pc) => pc.id),
            null,
            2
          )}`
        );
        for (const p of data) {
          console.log(`p: ${JSON.stringify(p, null, 2)}`);
          console.log(
            `p.categories: ${JSON.stringify(
              p.categories.some((c) =>
                post.categories.map((pc) => pc.id).includes(c.id)
              ),
              null,
              2
            )}`
          );
        }
        const filteredData = data.filter(
          (p) =>
            p.id !== post.id &&
            p.categories.some((c) =>
              post.categories.map((pc) => pc.id).includes(c.id)
            )
        );
        console.log(`filteredData: ${JSON.stringify(filteredData, null, 2)}`);
        setRelatedPosts(filteredData);
        console.log(`relatedPosts: ${JSON.stringify(filteredData, null, 2)}`);
      } catch (error) {
        const errorMsg =
          error instanceof Error
            ? `カテゴリのDELETEリクエストに失敗しました\n${error.message}`
            : `予期せぬエラーが発生しました\n${error}`;
        console.error(errorMsg);
        window.alert(errorMsg);
      }
    };

    fetchRelatedPosts();
  }, [post]);

  return (
    <div className="space-y-2">
      <div className="mb-2 text-2xl font-bold">{post.title}</div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div>投稿日: {dateFormat(post.createdAt)}</div>
          {pdfPublicUrlRes && (
            <a
              href={pdfPublicUrlRes.data?.publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1"
            >
              <FaFilePdf className="text-red-500" />
              <span>PDFで見る</span>
            </a>
          )}
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
      {imagePublicUrlRes && (
        <div className="relative">
          <Image
            src={imagePublicUrlRes.data?.publicUrl}
            alt="Example Image"
            layout="responsive"
            width={100}
            height={50}
            priority
            className="rounded-xl"
          />
        </div>
      )}
      <div dangerouslySetInnerHTML={{ __html: safeHTML }} />
      <div className="text-lg font-bold">関連記事</div>
      <div className="grid grid-cols-1 gap-2">
        {relatedPosts.length ? (
          relatedPosts.map((post) => <PostSummary key={post.id} post={post} />)
        ) : (
          <div>関連記事はありません</div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
