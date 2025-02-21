import dayjs from "dayjs";

const format = "YYYY-MM-DD";

export const dateFormat = (date: string): string => {
  return dayjs(date).format(format);
};
