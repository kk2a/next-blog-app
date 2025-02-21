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
import Pagination from "@/app/_components/Pagination";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<PostSummaryType[] | null>(null);
  const [searchKeyWord, setSearchKeyWord] = useState<string>("");
  const [searchCategories, setSearchCategories] = useState<string[]>([]);
  const [searchDateFrom, setSearchDateFrom] = useState<string>("");
  const [searchDateTo, setSearchDateTo] = useState<string>("");
  const [filteredPosts, setFilteredPosts] = useState<PostSummaryType[] | null>(
    null
  );
  const [searchHasPdf, setSearchHasPdf] = useState<boolean>(false);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [isAscending, setIsAscending] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const postsPerPage = 5;

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

  const handleSearch = () => {
    const filtered = posts?.filter((post) => {
      const matchesKeyWord =
        !searchKeyWord ||
        post.title.includes(searchKeyWord) ||
        post.content.includes(searchKeyWord) ||
        (post.categories.some((category) =>
          category.name.includes(searchKeyWord)
        ) as boolean);
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
      const matchesHasPdf = searchHasPdf ? post.bodyPdfKey : true;
      return (
        matchesKeyWord &&
        matchesCategory &&
        matchesDateFrom &&
        matchesDateTo &&
        matchesHasPdf
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

  // 現在のページのポストを取得
  const getCurrentPagePosts = () => {
    if (!filteredPosts) return null;
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return filteredPosts.slice(startIndex, endIndex);
  };

  const totalPages = filteredPosts
    ? Math.ceil(filteredPosts.length / postsPerPage)
    : 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <main>
      <div className="mb-4 text-2xl font-bold">投稿記事の一覧</div>
      <PostSearch
        searchKeyWord={searchKeyWord}
        setKeyWord={setSearchKeyWord}
        searchCategories={searchCategories}
        setSearchCategories={setSearchCategories}
        searchDateFrom={searchDateFrom}
        setSearchDateFrom={setSearchDateFrom}
        searchDateTo={searchDateTo}
        setSearchDateTo={setSearchDateTo}
        searchHasPdf={searchHasPdf}
        setSearchHasPdf={setSearchHasPdf}
        allCategories={allCategories}
        handleSearch={handleSearch}
        handleCategoryChange={handleCategoryChange}
      />
      <div className="mb-4">
        <SortButton isAscending={isAscending} handleSort={handleSort} />
      </div>
      <div className="space-y-3">
        {filteredPosts ? (
          <>
            {getCurrentPagePosts()?.map((post) => (
              <PostSummary key={post.id} post={post} />
            ))}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="text-gray-500">（記事は1個も作成されていません）</div>
        )}
      </div>
    </main>
  );
};

export default HomePage;
