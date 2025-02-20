export type PostPostRequestBody = {
  title: string;
  content: string;
  coverImageKey?: string;
  bodyPdfKey?: string;
  categoryIds: string[];
};
