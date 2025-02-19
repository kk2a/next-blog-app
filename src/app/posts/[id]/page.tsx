"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // ◀ 注目

import type { Post } from "@/app/_types/Post";
import Loading from "@/app/_components/Loading";

import { PostGetApiResponse } from "@/app/_types/PostGetApiResponse";
import PostDetail from "@/app/_components/PostDetail";

// 投稿記事の詳細表示 /posts/[id]
const Page: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // 動的ルートパラメータから 記事id を取得 （URL:/posts/[id]）
  const { id } = useParams() as { id: string };

  // コンポーネントが読み込まれたときに「1回だけ」実行する処理
  useEffect(() => {
    setIsLoading(true);
    const fetchPost = async () => {
      try {
        // microCMS から記事データを取得
        const requestUrl = `/api/posts/${id}`;
        const response = await fetch(requestUrl, {
          method: "GET",
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("データの取得に失敗しました");
        }
        const data = (await response.json()) as PostGetApiResponse;
        setPost({
          ...data,
          coverImage: {
            key: data.coverImageKey,
          },
          categories: data.categories.map((category) => ({
            ...category.category,
          })),
        });
      } catch (e) {
        setFetchError(
          e instanceof Error ? e.message : "予期せぬエラーが発生しました"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // 投稿データの取得中は「Loading...」を表示
  if (isLoading) {
    return <Loading />;
  }

  if (fetchError) {
    return <div>{fetchError}</div>;
  }

  if (!post) {
    return <div>データが見つかりませんでした</div>;
  }

  return (
    <main>
      <PostDetail post={post} />
    </main>
  );
};

export default Page;
