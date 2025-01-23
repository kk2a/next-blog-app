"use client";
import { SelectableCategory } from "@/app/_types/SelectableCategory";

type Props = {
  nowTitle: string;
  updateNowTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  nowContent: string;
  updateNowContent: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  nowCoverImageURL: string;
  updateNowCoverImageURL: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checkableCategories: SelectableCategory[] | null;
  switchCategoryState: (id: string) => void;
};

const PostEditorialBase: React.FC<Props> = (props) => {
  const {
    nowTitle,
    updateNowTitle,
    nowContent,
    updateNowContent,
    nowCoverImageURL,
    updateNowCoverImageURL,
    checkableCategories,
    switchCategoryState,
  } = props;
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

      <div className="space-y-1">
        <label htmlFor="coverImageURL" className="block font-bold">
          カバーイメージ (URL)
        </label>
        <input
          type="text"
          id="coverImageURL"
          name="coverImageURL"
          className="w-full rounded-md border-2 px-2 py-1"
          value={nowCoverImageURL}
          onChange={updateNowCoverImageURL}
          placeholder="カバーイメージのURLを記入してください"
        />
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
