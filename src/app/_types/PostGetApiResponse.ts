export type PostGetApiResponse = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  coverImageKey?: string;
  bodyPdfKey?: string;
  categories: {
    category: {
      id: string;
      name: string;
    };
  }[];
};
