"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { twMerge } from "tailwind-merge";
import { Category } from "@/app/_types/Category";
import { validateCategoryName } from "@/app/utils/validateCategoryName";
import { CategoryApiResponse } from "@/app/_types/CategoryApiResponse";
import Loading from "@/app/_components/Loading";
import LoadingPopup from "@/app/_components/LoadingPopup";
import CategoryEditorialName from "@/app/_components/CategoryEditorialName";
import CategoryExisting from "@/app/_components/CategoryExisting";
import { useAuth } from "@/app/_hooks/useAuth";

// カテゴリの編集・削除のページ
const Page: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchErrorMsg, setFetchErrorMsg] = useState<string | null>(null);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryNameError, setNewCategoryNameError] = useState("");

  const [currentCategoryName, setCurrentNameCategory] = useState<
    string | undefined
  >(undefined);

  // 動的ルートパラメータから id を取得 （URL:/admin/categories/[id]）
  const { id } = useParams() as { id: string };

  // ページの移動に使用するフック
  const router = useRouter();

  // カテゴリ配列 (State)。取得中と取得失敗時は null、既存カテゴリが0個なら []
  const [categories, setCategories] = useState<Category[] | null>(null);

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
      setCategories(
        apiResBody.map((body) => ({
          id: body.id,
          name: body.name,
        }))
      );
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

  // categories または id が変更されたときにコールされる関数
  useEffect(() => {
    // id に対応するカテゴリ名を取得
    const currentCategory = categories?.find((c) => c.id === id);
    if (currentCategory !== undefined) {
      setCurrentNameCategory(currentCategory.name);
    }
  }, [categories, id]);

  // カテゴリの名前を設定するテキストボックスの値が変更されたときにコールされる関数
  const updateNewCategoryName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategoryNameError(validateCategoryName(e.target.value, categories));
    setNewCategoryName(e.target.value);
  };

  // 「カテゴリの名前を変更」のボタンが押下されたときにコールされる関数
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // これを実行しないと意図せずページがリロードされるので注意
    setIsSubmitting(true);

    try {
      if (!token) {
        window.alert("予期せぬ動作：トークンが取得できません。");
        return;
      }
      const requestUrl = `/api/admin/categories/${id}`;
      const res = await fetch(requestUrl, {
        method: "PUT",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`);
      }

      setNewCategoryName("");
      await fetchCategories(); // カテゴリの一覧を再取得
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? `カテゴリのPUTリクエストに失敗しました\n${error.message}`
          : `予期せぬエラーが発生しました\n${error}`;
      console.error(errorMsg);
      window.alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 「削除」のボタンが押下されたときにコールされる関数
  const handleDelete = async () => {
    // prettier-ignore
    if (!window.confirm(`カテゴリ「${currentCategoryName}」を本当に削除しますか？`)) {
      return;
    }

    setIsSubmitting(true);
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
      router.replace("/admin/categories");
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? `カテゴリのDELETEリクエストに失敗しました\n${error.message}`
          : `予期せぬエラーが発生しました\n${error}`;
      console.error(errorMsg);
      window.alert(errorMsg);
      setIsSubmitting(false);
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

  // プレースホルダの id に一致するカテゴリが存在しないときの画面
  if (currentCategoryName === undefined) {
    return (
      <div className="text-red-500">
        指定された id のカテゴリは存在しません。
      </div>
    );
  }

  return (
    <main>
      <div className="mb-4 text-2xl font-bold">カテゴリの編集・削除</div>

      {isSubmitting && <LoadingPopup />}

      <form
        onSubmit={handleSubmit}
        className={twMerge("mb-4 space-y-4", isSubmitting && "opacity-50")}
      >
        <div className="space-y-6">
          <div className="space-y-1">
            <div className="block font-bold">現在のカテゴリの名前</div>
            <div className="text-gray-500">{currentCategoryName}</div>
          </div>

          <CategoryEditorialName
            nowCategoryName={newCategoryName}
            updateNowCategoryName={updateNewCategoryName}
            nowCategoryNameError={newCategoryNameError}
          />
        </div>

        <div className="flex justify-end space-x-2">
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
            カテゴリの名前を変更
          </button>

          <button
            type="button"
            className={twMerge(
              "rounded-md px-5 py-1 font-bold",
              "bg-red-500 text-white hover:bg-red-600"
            )}
            onClick={handleDelete}
          >
            削除
          </button>
        </div>
      </form>

      <CategoryExisting categories={categories} id={id} />
    </main>
  );
};

export default Page;
