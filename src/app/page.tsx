"use client";
import { useState, useEffect } from "react";
import type { Post } from "@/app/_types/Post";
import PostSummary from "@/app/_components/PostSummary";
import Loading from "@/app/_components/Loading";
import { PostSummaryType } from "@/app/_types/PostSummaryType";
import { PostApiResponse } from "@/app/_types/PostApiResponse";

const Page: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<PostSummaryType[] | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // microCMS から記事データを取得
        const requestUrl = "/api/posts";
        const response = await fetch(requestUrl, {
          method: "GET",
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("データの取得に失敗しました");
        }
        const apiResBody = (await response.json()) as PostApiResponse[];
        setPosts(
          apiResBody.map((body) => ({
            ...body,
            categories: body.categories.map((category) => ({
              ...category.category,
            })),
          }))
        );
      } catch (e) {
        setFetchError(
          e instanceof Error ? e.message : "予期せぬエラーが発生しました"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (fetchError) {
    return <div>{fetchError}</div>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main>
      <div className="mb-4 text-2xl font-bold">投稿記事の一覧</div>
      <div className="space-y-3">
        {posts ? (
          posts.map((post) => <PostSummary key={post.id} post={post} />)
        ) : (
          <div className="text-gray-500">（記事は1個も作成されていません）</div>
        )}
      </div>
    </main>
  );
};

export default Page;
