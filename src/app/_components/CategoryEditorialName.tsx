"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

type Props = {
  nowCategoryName: string;
  updateNowCategoryName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  nowCategoryNameError: string | null;
};

const CategoryEditorialName: React.FC<Props> = (props) => {
  const { nowCategoryName, updateNowCategoryName, nowCategoryNameError } =
    props;

  return (
    <div className="space-y-2">
      <label htmlFor="name" className="block font-bold">
        カテゴリの名前
      </label>
      <input
        type="text"
        id="name"
        name="name"
        className="w-full rounded-md border-2 px-2 py-1"
        placeholder="カテゴリの名前を記入してください"
        value={nowCategoryName}
        onChange={updateNowCategoryName}
        autoComplete="off"
        required
      />
      {nowCategoryNameError && (
        <div className="flex items-center space-x-1 text-sm font-bold text-red-500">
          <FontAwesomeIcon icon={faTriangleExclamation} className="mr-0.5" />
          <div>{nowCategoryNameError}</div>
        </div>
      )}
    </div>
  );
};

export default CategoryEditorialName;
