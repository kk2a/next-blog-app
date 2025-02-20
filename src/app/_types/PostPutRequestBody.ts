export type PostPutRequestBody = {
  title: string;
  content: string;
  coverImageKey?: string;
  bodyPdfKey?: string;
  categoryIds: string[];
};
