"use client";
import React, { useEffect, useState } from "react";
import { PostGetApiResponse } from "@/app/_types/PostGetApiResponse";
import { PostSummaryType } from "@/app/_types/PostSummaryType";
import Loading from "@/app/_components/Loading";
import LoadingPopup from "@/app/_components/LoadingPopup";
import Link from "next/link";
import PostSearch from "@/app/_components/PostSearch";
import SortButton from "@/app/_components/SortButton";
import PostSummary from "@/app/_components/PostSummary";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<PostSummaryType[] | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [searchTitle, setSearchTitle] = useState<string>("");
  const [searchCategories, setSearchCategories] = useState<string[]>([]);
  const [searchDateFrom, setSearchDateFrom] = useState<string>("");
  const [searchDateTo, setSearchDateTo] = useState<string>("");
  const [filteredPosts, setFilteredPosts] = useState<PostSummaryType[] | null>(
    null
  );
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [isAscending, setIsAscending] = useState<boolean>(true);

  useEffect(() => {
    // 投稿記事のデータを取得する関数
    const fetchPosts = async () => {
      const response = await fetch("/api/posts");
      const data = (await response.json()) as PostGetApiResponse[];
      const tmp = data.map((body) => ({
        ...body,
        categories: body.categories.map((category) => ({
          ...category.category,
        })),
      }));

      setPosts(tmp);
      setFilteredPosts(tmp);
      setIsLoading(false);
    };

    // カテゴリのデータを取得する関数
    const fetchCategories = async () => {
      const response = await fetch("/api/categories");
      const data = (await response.json()) as { id: string; name: string }[];
      setAllCategories(data.map((category) => category.name));
    };

    fetchPosts();
    fetchCategories();
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

  const handleSearch = () => {
    const filtered = posts?.filter((post) => {
      const matchesTitle = post.title.includes(searchTitle);
      const matchesCategory = searchCategories.length
        ? post.categories.some((category) =>
            searchCategories.includes(category.name)
          )
        : true;
      const matchesDateFrom = searchDateFrom
        ? new Date(post.createdAt) >= new Date(searchDateFrom)
        : true;
      const matchesDateTo = searchDateTo
        ? new Date(post.createdAt) <= new Date(searchDateTo)
        : true;
      return (
        matchesTitle && matchesCategory && matchesDateFrom && matchesDateTo
      );
    });
    setFilteredPosts(filtered || null);
  };

  const handleCategoryChange = (category: string) => {
    setSearchCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSort = () => {
    const sortedPosts = [...(filteredPosts || [])].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return isAscending ? dateA - dateB : dateB - dateA;
    });
    setFilteredPosts(sortedPosts);
    setIsAscending(!isAscending);
  };

  return (
    <main>
      <div className="mb-4 text-2xl font-bold">投稿記事の一覧</div>
      {isDeleting && <LoadingPopup />}
      <PostSearch
        searchTitle={searchTitle}
        setSearchTitle={setSearchTitle}
        searchCategories={searchCategories}
        setSearchCategories={setSearchCategories}
        searchDateFrom={searchDateFrom}
        setSearchDateFrom={setSearchDateFrom}
        searchDateTo={searchDateTo}
        setSearchDateTo={setSearchDateTo}
        allCategories={allCategories}
        handleSearch={handleSearch}
        handleCategoryChange={handleCategoryChange}
      />
      <div className="mb-4">
        <SortButton isAscending={isAscending} handleSort={handleSort} />
      </div>
      <div className="space-y-3">
        {filteredPosts ? (
          filteredPosts.map((post) => <PostSummary key={post.id} post={post} />)
        ) : (
          <div className="text-gray-500">（記事は1個も作成されていません）</div>
        )}
      </div>
    </main>
  );
};

export default HomePage;
