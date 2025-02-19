export type PostSummaryType = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  coverImageKey?: string;
  categories: {
    id: string;
    name: string;
  }[];
};
