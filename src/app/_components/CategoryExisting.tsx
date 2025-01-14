"use client";
import { Category } from "@/app/_types/Category";
import CategorySummary from "@/app/_components/CategorySummary";

type Props = {
  categories: Category[];
  id: string;
};

const CategoryExisting: React.FC<Props> = (props) => {
  const { categories, id } = props;
  return (
    <div>
      <div className="mb-2 text-2xl font-bold">既存のカテゴリの一覧</div>
      {categories.length === 0 ? (
        <div className="text-gray-500">
          （カテゴリは1個も作成されていません）
        </div>
      ) : (
        <div>
          <div className="mb-2">
            クリックすると各カテゴリの名前編集・削除画面に移動します。
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <CategorySummary
                key={category.id}
                category={category}
                selected={category.id === id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryExisting;
