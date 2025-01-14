export type PostSummaryType = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  coverImageURL?: string;
  categories: {
    id: string;
    name: string;
  }[];
};
