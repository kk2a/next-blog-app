"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Category } from "@/app/_types/Category";
import { CategoryApiResponse } from "@/app/_types/CategoryApiResponse";
import Loading from "@/app/_components/Loading";
import Link from "next/link";
import CategorySearch from "@/app/_components/CategorySearch";
import LoadingPopup from "@/app/_components/LoadingPopup";
import { useAuth } from "@/app/_hooks/useAuth";

// カテゴリの編集・削除のページ
const Page: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [fetchErrorMsg, setFetchErrorMsg] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ページの移動に使用するフック
  const router = useRouter();

  // カテゴリ配列 (State)。取得中と取得失敗時は null、既存カテゴリが0個なら []
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // 検索クエリの状態管理
  const [filteredCategories, setFilteredCategories] = useState<
    Category[] | null
  >(null);

  const { token } = useAuth();

  // ウェブAPI (/api/categories) からカテゴリの一覧をフェッチする関数の定義
  const fetchCategories = async () => {
    try {
      setIsLoading(true);

      // フェッチ処理の本体
      const requestUrl = "/api/categories";
      const res = await fetch(requestUrl, {
        method: "GET",
        cache: "no-store",
      });

      // レスポンスのステータスコードが200以外の場合 (カテゴリのフェッチに失敗した場合)
      if (!res.ok) {
        setCategories(null);
        throw new Error(
          `カテゴリの一覧のフェッチに失敗しました: (${res.status}: ${res.statusText})`
        ); // -> catch節に移動
      }

      // レスポンスのボディをJSONとして読み取りカテゴリ配列 (State) にセット
      const apiResBody = (await res.json()) as CategoryApiResponse[];
      const fetchedCategories = apiResBody.map((body) => ({
        id: body.id,
        name: body.name,
      }));
      setCategories(fetchedCategories);
      setFilteredCategories(fetchedCategories);
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : `予期せぬエラーが発生しました ${error}`;
      console.error(errorMsg);
      setFetchErrorMsg(errorMsg);
    } finally {
      // 成功した場合も失敗した場合もローディング状態を解除
      setIsLoading(false);
    }
  };

  // コンポーネントがマウントされたとき (初回レンダリングのとき) に1回だけ実行
  useEffect(() => {
    fetchCategories();
  }, []);

  // 「削除」のボタンが押下されたときにコールされる関数
  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    if (isDeleting) return;
    const currentCategory = categories?.find((category) => category.id === id);
    if (!currentCategory) {
      console.error("カテゴリが見つかりません");
      return;
    }

    // prettier-ignore
    if (!window.confirm(`カテゴリ「${currentCategory}」を本当に削除しますか？`)) {
      return;
    }

    try {
      if (!token) {
        window.alert("予期せぬ動作：トークンができません。");
        return;
      }
      const requestUrl = `/api/admin/categories/${id}`;
      const res = await fetch(requestUrl, {
        method: "DELETE",
        cache: "no-store",
        headers: {
          Authorization: token,
        },
      });

      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }
      // カテゴリの一覧ページに移動
      router.replace("/admin/categories/");
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? `カテゴリのDELETEリクエストに失敗しました\n${error.message}`
          : `予期せぬエラーが発生しました\n${error}`;
      console.error(errorMsg);
      window.alert(errorMsg);
    }
    setIsDeleting(false);
    const updateCategories = (categories as Category[]).filter(
      (category) => category.id !== id
    );
    setCategories(updateCategories);
    setFilteredCategories(updateCategories);
  };

  const handleSearch = () => {
    if (categories) {
      const filtered = categories.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  };

  // カテゴリの一覧を取得中の画面
  if (isLoading) {
    return <Loading />;
  }

  // カテゴリの一覧を取得失敗したときの画面
  if (!categories) {
    return <div className="text-red-500">{fetchErrorMsg}</div>;
  }

  return (
    <main>
      {isDeleting && <LoadingPopup />}

      <div className="mb-4 text-2xl font-bold">カテゴリの一覧</div>
      <div className="mb-4">
        <Link href="/admin/categories/new">
          <button className="rounded bg-green-500 px-3 py-1 text-white">
            新規追加
          </button>
        </Link>
      </div>
      <CategorySearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />
      <div className="space-y-3">
        {filteredCategories ? (
          filteredCategories.map((category) => (
            <div
              key={category.id}
              className="rounded-md border border-slate-400 p-3"
            >
              <div className="flex items-center justify-between">
                <Link href={`/admin/categories/${category.id}`}>
                  <span className="font-bold">{category.name}</span>
                </Link>
                <div className="flex space-x-2">
                  <Link href={`/admin/categories/${category.id}`}>
                    <button className="rounded bg-blue-500 px-3 py-1 text-white">
                      編集
                    </button>
                  </Link>
                  <button
                    className="rounded bg-red-500 px-3 py-1 text-white"
                    onClick={() => handleDelete(category.id)}
                  >
                    削除
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500">
            （カテゴリは1個も作成されていません）
          </div>
        )}
      </div>
    </main>
  );
};

export default Page;
