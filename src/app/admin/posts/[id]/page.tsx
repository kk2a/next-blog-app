"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { CategoryApiResponse } from "@/app/_types/CategoryApiResponse";
import Loading from "@/app/_components/Loading";
import LoadingPopup from "@/app/_components/LoadingPopup";
import { SelectableCategory } from "@/app/_types/SelectableCategory";
import { PostApiResponse } from "@/app/_types/PostApiResponse";
import { PostPutRequestBody } from "@/app/_types/PostPutRequestBody";
import PostEditorialBase from "@/app/_components/PostEditorialBase";

// 投稿記事の新規作成のページ
const Page: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchErrorMsg, setFetchErrorMsg] = useState<string | null>(null);

  const [nowTitle, setNowTitle] = useState("");
  const [nowContent, setNowContent] = useState("");
  const [nowCoverImageURL, setNowCoverImageURL] = useState("");

  const router = useRouter();

  const { id } = useParams() as { id: string };

  // カテゴリ配列 (State)。取得中と取得失敗時は null、既存カテゴリが0個なら []
  const [checkableCategories, setCheckableCategories] = useState<
    SelectableCategory[] | null
  >(null);

  const [initCheckableCategories, setInitCheckableCategories] = useState<
    SelectableCategory[] | null
  >(null);

  // コンポーネントがマウントされたとき (初回レンダリングのとき) に1回だけ実行
  useEffect(() => {
    setIsLoading(true);
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
          setInitCheckableCategories(null);
          throw new Error(`${res.status}: ${res.statusText}`); // -> catch節に移動
        }

        // レスポンスのボディをJSONとして読み取りカテゴリ配列 (State) にセット
        const apiResBody = (await res.json()) as CategoryApiResponse[];
        setInitCheckableCategories(
          apiResBody.map((body) => ({
            id: body.id,
            name: body.name,
            isSelect: false,
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
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const fetchPostData = async () => {
      try {
        const requestUrl = `/api/posts/${id}`;
        const res = await fetch(requestUrl, {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`${res.status}: ${res.statusText}`); // -> catch節に移動
        }

        const postData = (await res.json()) as PostApiResponse;
        setNowTitle(postData.title);
        setNowContent(postData.content);
        setNowCoverImageURL(postData.coverImageURL);
        if (initCheckableCategories && postData.categories) {
          const checkedCategories: string[] = postData.categories.map(
            (c) => c.category.id
          );
          setCheckableCategories(
            initCheckableCategories.map((category: SelectableCategory) => ({
              ...category,
              isSelect: checkedCategories.includes(category.id),
            }))
          );
        }
      } catch (error) {
        const errorMsg =
          error instanceof Error
            ? `投稿記事のデータのフェッチに失敗しました: ${error.message}`
            : `予期せぬエラーが発生しました ${error}`;
        console.error(errorMsg);
        setFetchErrorMsg(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };
    console.log("aaa");
    fetchPostData();
  }, [id, initCheckableCategories]);

  // チェックボックスの状態 (State) を更新する関数
  const switchCategoryState = (categoryId: string) => {
    if (!checkableCategories) return;

    setCheckableCategories(
      checkableCategories.map((category) =>
        category.id === categoryId
          ? { ...category, isSelect: !category.isSelect }
          : category
      )
    );
  };

  const updateTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ここにタイトルのバリデーション処理を追加する
    setNowTitle(e.target.value);
  };

  const updateContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // ここに本文のバリデーション処理を追加する
    setNowContent(e.target.value);
  };

  const updateCoverImageURL = (e: React.ChangeEvent<HTMLInputElement>) => {
    // ここにカバーイメージURLのバリデーション処理を追加する
    setNowCoverImageURL(e.target.value);
  };

  // フォームの送信処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // この処理をしないとページがリロードされるので注意

    setIsSubmitting(true);

    // ▼▼ 追加 ウェブAPI (/api/admin/posts) にPOSTリクエストを送信する処理
    try {
      const requestBody: PostPutRequestBody = {
        title: nowTitle,
        content: nowContent,
        coverImageURL: nowCoverImageURL,
        categoryIds: checkableCategories
          ? checkableCategories.filter((c) => c.isSelect).map((c) => c.id)
          : [],
      };
      const requestUrl = `/api/admin/posts/${id}`;
      console.log(`${requestUrl} => ${JSON.stringify(requestBody, null, 2)}`);
      const res = await fetch(requestUrl, {
        method: "PUT",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        throw new Error(`${res.status}: ${res.statusText}`); // -> catch節に移動
      }

      const postResponse = await res.json();
      setIsSubmitting(false);
      router.push(`/posts/${id}`); // 投稿記事の詳細ページに移動
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? `投稿記事のPOSTリクエストに失敗しました\n${error.message}`
          : `予期せぬエラーが発生しました\n${error}`;
      console.error(errorMsg);
      window.alert(errorMsg);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!checkableCategories) {
    return <div className="text-red-500">{fetchErrorMsg}</div>;
  }

  return (
    <main>
      <div className="mb-4 text-2xl font-bold">投稿記事の編集</div>

      {isSubmitting && <LoadingPopup />}

      <form
        onSubmit={handleSubmit}
        className={twMerge("space-y-4", isSubmitting && "opacity-50")}
      >
        <PostEditorialBase
          nowTitle={nowTitle}
          updateNowTitle={updateTitle}
          nowContent={nowContent}
          updateNowContent={updateContent}
          nowCoverImageURL={nowCoverImageURL}
          updateNowCoverImageURL={updateCoverImageURL}
          checkableCategories={checkableCategories}
          switchCategoryState={switchCategoryState}
        />

        <div className="flex justify-end">
          <button
            type="submit"
            className={twMerge(
              "rounded-md px-5 py-1 font-bold",
              "bg-indigo-500 text-white hover:bg-indigo-600",
              "disabled:cursor-not-allowed"
            )}
            disabled={isSubmitting}
          >
            記事を更新
          </button>
        </div>
      </form>
    </main>
  );
};

export default Page;
