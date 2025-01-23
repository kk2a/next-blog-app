"use client";
type Props = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  handleSearch: () => void;
};

const CategorySearch: React.FC<Props> = (props) => {
  const { searchQuery, setSearchQuery, handleSearch } = props;
  return (
    <div>
      <div className="mb-4 flex space-x-2">
        <input
          type="text"
          placeholder="カテゴリ名で検索"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md border px-3 py-2"
        />
        <button
          onClick={handleSearch}
          className="rounded bg-blue-500 px-3 py-1 text-white"
        >
          検索
        </button>
      </div>
    </div>
  );
};

export default CategorySearch;
