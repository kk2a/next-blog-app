"use client";
import { SelectableCategory } from "@/app/_types/SelectableCategory";
import { useRef, useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import { supabase } from "@/utils/supabase";
import { calculateMD5Hash } from "@/app/_utils/calculateMD5Hash";

type Props = {
  nowTitle: string;
  updateNowTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  nowContent: string;
  updateNowContent: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  nowCoverImageKey: string | undefined;
  updateNowCoverImageKey: (e: string | undefined) => void;
  nowBodyPdfKey: string | undefined;
  updateNowBodyPdfKey: (e: string | undefined) => void;
  checkableCategories: SelectableCategory[] | null;
  switchCategoryState: (id: string) => void;
};

const PostEditorialBase: React.FC<Props> = (props) => {
  const {
    nowTitle,
    updateNowTitle,
    nowContent,
    updateNowContent,
    nowCoverImageKey,
    updateNowCoverImageKey,
    nowBodyPdfKey,
    updateNowBodyPdfKey,
    checkableCategories,
    switchCategoryState,
  } = props;

  const [nowCoverImageURL, updateNowCoverImageURL] = useState<
    string | undefined
  >();
  const [nowFilePublicUrl, setNowFilePublicUrl] = useState<
    string | undefined
  >();

  const hiddenCoverImageInputRef = useRef<HTMLInputElement>(null);
  const hiddenBodyPdfInputRef = useRef<HTMLInputElement>(null);

  const coverImageBucketName = "cover_image";
  const bodyPdfBucketName = "body_pdf";

  useEffect(() => {
    if (nowCoverImageKey) {
      const publicUrlResult = supabase.storage
        .from(coverImageBucketName)
        .getPublicUrl(nowCoverImageKey);
      updateNowCoverImageURL(publicUrlResult.data.publicUrl);
    }
  }, [nowCoverImageKey]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNowCoverImageKey(undefined);
    updateNowCoverImageURL(undefined);

    // 画像が選択されていない場合は戻る
    if (!e.target.files || e.target.files.length === 0) return;

    // 複数ファイルが選択されている場合は最初のファイルを使用する
    const file = e.target.files?.[0];
    // ファイルのハッシュ値を計算
    const fileHash = await calculateMD5Hash(file); // ◀ 追加
    // バケット内のパスを指定
    const path = `private/${fileHash}`; // ◀ 変更
    // ファイルが存在する場合は上書きするための設定 → upsert: true
    const { data, error } = await supabase.storage
      .from(coverImageBucketName)
      .upload(path, file, { upsert: true });

    if (error || !data) {
      window.alert(`アップロードに失敗 ${error.message}`);
      return;
    }
    // 画像のキー (実質的にバケット内のパス) を取得
    updateNowCoverImageKey(data.path);
    const publicUrlResult = supabase.storage
      .from(coverImageBucketName)
      .getPublicUrl(data.path);
    // 画像のURLを取得
    updateNowCoverImageURL(publicUrlResult.data.publicUrl);
  };

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    updateNowBodyPdfKey(undefined);
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      const fileHash = await calculateMD5Hash(file);
      const path = `private/${fileHash}`;
      const { data, error } = await supabase.storage
        .from(bodyPdfBucketName)
        .upload(path, file, { upsert: true });

      if (error || !data) {
        window.alert(`アップロードに失敗 ${error.message}`);
        return;
      }
      updateNowBodyPdfKey(data.path);
      const publicUrlResult = supabase.storage
        .from(bodyPdfBucketName)
        .getPublicUrl(data.path);
      setNowFilePublicUrl(publicUrlResult.data.publicUrl);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="title" className="block font-bold">
          タイトル
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="w-full rounded-md border-2 px-2 py-1"
          value={nowTitle}
          onChange={updateNowTitle}
          placeholder="タイトルを記入してください"
          required
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="content" className="block font-bold">
          本文
        </label>
        <textarea
          id="content"
          name="content"
          className="h-48 w-full rounded-md border-2 px-2 py-1"
          value={nowContent}
          onChange={updateNowContent}
          placeholder="本文を記入してください"
          required
        />
      </div>

      <div>
        <label className="block font-bold">PDF</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={onFileChange}
          hidden={true}
          ref={hiddenBodyPdfInputRef}
        />
        <button
          onClick={() => hiddenBodyPdfInputRef.current?.click()}
          type="button"
          className="rounded-md bg-indigo-500 px-3 py-1 text-white"
        >
          ファイルを選択
        </button>
        {nowBodyPdfKey && <p>アップロードしたファイル: {nowBodyPdfKey}</p>}
        {nowFilePublicUrl && (
          <a
            href={nowFilePublicUrl}
            className="mt-4 inline-block rounded-md bg-blue-500 px-3 py-1 text-white"
          >
            PDFを表示する
          </a>
        )}
      </div>

      <div>
        <label className="block font-bold">カバー画像</label>
        <input
          id="imgSelector"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          hidden={true} // ◀ 追加 (非表示に設定)
          ref={hiddenCoverImageInputRef} // ◀ 追加 (参照を設定)
        />
        <button
          // 参照を経由してプログラム的にクリックイベントを発生させる
          onClick={() => hiddenCoverImageInputRef.current?.click()}
          type="button"
          className="rounded-md bg-indigo-500 px-3 py-1 text-white"
        >
          ファイルを選択
        </button>
        {nowCoverImageKey && (
          <div className="break-all text-sm">
            coverImageKey : {nowCoverImageKey}
          </div>
        )}
        {nowCoverImageURL && (
          <div className="mt-2">
            <Image
              className="w-1/2 border-2 border-gray-300"
              src={nowCoverImageURL}
              alt="プレビュー画像"
              width={1024}
              height={1024}
              priority
            />
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="font-bold">タグ</div>
        <div className="flex flex-wrap gap-x-3.5">
          {checkableCategories ? (
            checkableCategories.map((c) => (
              <label key={c.id} className="flex space-x-1">
                <input
                  id={c.id}
                  type="checkbox"
                  checked={c.isSelect}
                  className="mt-0.5 cursor-pointer"
                  onChange={() => switchCategoryState(c.id)}
                />
                <span className="cursor-pointer">{c.name}</span>
              </label>
            ))
          ) : (
            <div>選択可能なカテゴリが存在しません。</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostEditorialBase;
