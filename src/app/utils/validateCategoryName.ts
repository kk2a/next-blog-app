import { Category } from "@/app/_types/Category";

export const validateCategoryName = (
  name: string,
  categories: Category[] | null
): string => {
  const maxLength = 16;
  const minLength = 1;
  if (name.length < minLength || name.length > maxLength) {
    return `${minLength}文字以上${maxLength}文字以内で入力してください。`;
  }
  if (categories && categories.some((c) => c.name === name)) {
    return "同じ名前のカテゴリが既に存在します。";
  }
  return "";
};
