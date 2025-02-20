"use client";

import Image from "next/image";
import { twMerge } from "tailwind-merge";
import DOMPurify from "isomorphic-dompurify";
import { Post } from "@/app/_types/Post";
import { dateFormat } from "../utils/dateFormat";
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import { FaFilePdf } from "react-icons/fa";

type Props = {
  post: Post;
};

const PostDetail: React.FC<Props> = (props) => {
  const { post } = props;
  const safeHTML = DOMPurify.sanitize(post.content, {
    ALLOWED_TAGS: ["b", "strong", "i", "em", "u", "br"],
  });

  console.log(`post: ${JSON.stringify(post, null, 2)}`);
  const coverImageBucketName = "cover_image";
  const imagePublicUrlRes = post.coverImage
    ? supabase.storage
        .from(coverImageBucketName)
        .getPublicUrl(post.coverImage.key)
    : undefined;
  if (post.coverImage) {
    console.log(`coverImageaaaa: ${JSON.stringify(post.coverImage, null, 2)}`);
  }

  const bodyPdfBucketName = "body_pdf";
  const pdfPublicUrlRes = post.bodyPdfKey
    ? supabase.storage.from(bodyPdfBucketName).getPublicUrl(post.bodyPdfKey)
    : undefined;
  console.log(`pdfPublicUrlRes: ${JSON.stringify(pdfPublicUrlRes, null, 2)}`);

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
    </div>
  );
};

export default PostDetail;
