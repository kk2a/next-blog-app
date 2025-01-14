"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { PostApiResponse } from "@/app/_types/PostApiResponse";
import { PostSummaryType } from "@/app/_types/PostSummaryType";
import Loading from "@/app/_components/Loading";
import PostSummaryEditorial from "@/app/_components/PostSummaryEditorial";
import LoadingPopup from "@/app/_components/LoadingPopup";

const AdminPostsPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<PostSummaryType[] | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    // 投稿記事のデータを取得する関数
    const fetchPosts = async () => {
      const response = await fetch("/api/posts");
      const data = (await response.json()) as PostApiResponse[];
      setPosts(
        data.map((body) => ({
          ...body,
          categories: body.categories.map((category) => ({
            ...category.category,
          })),
        }))
      );
    };

    fetchPosts();
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  const handleDelete = async (id: string) => {
    if (confirm("本当に削除しますか？")) {
      setIsDeleting(true);
      try {
        const res = await fetch(`/api/admin/posts/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error(`${res.status}: ${res.statusText}`); // -> catch節に移動
        }
      } catch (error) {
        const errorMsg =
          error instanceof Error
            ? `投稿記事のPOSTリクエストに失敗しました\n${error.message}`
            : `予期せぬエラーが発生しました\n${error}`;
        console.error(errorMsg);
        window.alert(errorMsg);
      }
      setIsDeleting(false);
      setPosts((posts as PostSummaryType[]).filter((post) => post.id !== id));
    }
  };

  return (
    <main>
      <div className="mb-4 text-2xl font-bold">投稿記事の一覧</div>
      {isDeleting && <LoadingPopup />}
      <div className="space-y-3">
        {posts ? (
          posts.map((post) => (
            <PostSummaryEditorial
              key={post.id}
              post={post}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="text-gray-500">（記事は1個も作成されていません）</div>
        )}
      </div>
    </main>
  );
};

export default AdminPostsPage;
