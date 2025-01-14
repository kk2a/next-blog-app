export type PostApiResponse = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  coverImageURL: string;
  categories: {
    category: {
      id: string;
      name: string;
    };
  }[];
};
