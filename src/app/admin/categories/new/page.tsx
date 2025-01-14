"use client";
import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { Category } from "@/app/_types/Category";
import { validateCategoryName } from "@/app/utils/validateCategoryName";
import { CategoryApiResponse } from "@/app/_types/CategoryApiResponse";
import Loading from "@/app/_components/Loading";
import LoadingPopup from "@/app/_components/LoadingPopup";
import CategoryEditorialName from "@/app/_components/CategoryEditorialName";
import CategoryExisting from "@/app/_components/CategoryExisting";

// カテゴリの新規作成 (追加) のページ
const Page: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchErrorMsg, setFetchErrorMsg] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryNameError, setNewCategoryNameError] = useState("");

  // カテゴリ配列 (State)。取得中と取得失敗時は null、既存カテゴリが0個なら []
  const [categories, setCategories] = useState<Category[] | null>(null);

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
        throw new Error(`${res.status}: ${res.statusText}`); // -> catch節に移動
      }

      // レスポンスのボディをJSONとして読み取りカテゴリ配列 (State) にセット
      const apiResBody = (await res.json()) as CategoryApiResponse[];
      setCategories(
        apiResBody.map((body) => ({
          id: body.id,
          name: body.name,
        }))
      );
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? `カテゴリの一覧のフェッチに失敗しました: ${error.message}`
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

  // テキストボックスの値が変更されたときにコールされる関数
  const updateNewCategoryName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategoryNameError(validateCategoryName(e.target.value, categories));
    setNewCategoryName(e.target.value);
  };

  // フォームのボタン (type="submit") がクリックされたときにコールされる関数
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // これを実行しないと意図せずページがリロードされるので注意
    setIsSubmitting(true);

    // ▼▼ 追加 ウェブAPI (/api/admin/categories) にPOSTリクエストを送信する処理
    try {
      const requestUrl = "/api/admin/categories";
      const res = await fetch(requestUrl, {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`); // -> catch節に移動
      }

      setNewCategoryName("");
      await fetchCategories(); // カテゴリの一覧を再取得
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? `カテゴリのPOSTリクエストに失敗しました\n${error.message}`
          : `予期せぬエラーが発生しました\n${error}`;
      console.error(errorMsg);
      window.alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // カテゴリをウェブAPIから取得中の画面
  if (isLoading) {
    return <Loading />;
  }

  // カテゴリをウェブAPIから取得することに失敗したときの画面
  if (!categories) {
    return <div className="text-red-500">{fetchErrorMsg}</div>;
  }

  // カテゴリ取得完了後の画面
  return (
    <main>
      <div className="mb-4 text-2xl font-bold">カテゴリの新規作成</div>

      {isSubmitting && <LoadingPopup />}

      <form
        onSubmit={handleSubmit}
        className={twMerge("mb-4 space-y-4", isSubmitting && "opacity-50")}
      >
        <CategoryEditorialName
          nowCategoryName={newCategoryName}
          updateNowCategoryName={updateNewCategoryName}
          nowCategoryNameError={newCategoryNameError}
        />

        <div className="flex justify-end">
          <button
            type="submit"
            className={twMerge(
              "rounded-md px-5 py-1 font-bold",
              "bg-indigo-500 text-white hover:bg-indigo-600",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
            disabled={
              isSubmitting ||
              newCategoryNameError !== "" ||
              newCategoryName === ""
            }
          >
            カテゴリを作成
          </button>
        </div>
      </form>

      <CategoryExisting categories={categories} id="" />
    </main>
  );
};

export default Page;
